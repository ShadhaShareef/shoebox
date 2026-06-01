<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../app/Product.php';
require_once __DIR__ . '/../app/Cart.php';
require_once __DIR__ . '/../app/Inventory.php';

$cart = new Cart();
$items = $cart->structured();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: checkout.php');
    exit;
}

if (empty($items)) {
    $_SESSION['flash'] = ['type' => 'error', 'message' => 'Your cart is empty.'];
    header('Location: cart.php');
    exit;
}

// Basic validation
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');
$payment = trim($_POST['payment'] ?? 'cod');

if ($name === '' || $phone === '' || $address === '') {
    $_SESSION['flash'] = ['type' => 'error', 'message' => 'Please provide name, phone and address.'];
    header('Location: checkout.php');
    exit;
}

// Compute total
$grand = 0;
$orderItems = [];
foreach ($items as $it) {
    $product = Product::find($pdo, $it['product_id']);
    if (!$product) continue;
    $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : ($product['price'] ?? 0);
    $subtotal = $price * $it['quantity'];
    $grand += $subtotal;
    $orderItems[] = ['product_id' => $it['product_id'], 'product_name' => $product['name'], 'qty' => $it['quantity'], 'price' => $price, 'subtotal' => $subtotal, 'size' => $it['size']];
}

if (empty($orderItems)) {
    $_SESSION['flash'] = ['type' => 'error', 'message' => 'No valid products in cart.'];
    header('Location: cart.php');
    exit;
}

// Choose store for this order (nearest placeholder)
$nearest = Inventory::getNearestStore();
$storeId = $nearest['id'];
$storeName = $nearest['name'];

// Generate unique order number
function generateOrderNumber(PDO $pdo) {
    do {
        $num = mt_rand(100000, 999999);
        $order_no = 'SHOEBOX-' . $num;
        $stmt = $pdo->prepare('SELECT id FROM orders WHERE order_number = ? LIMIT 1');
        $stmt->execute([$order_no]);
        $exists = $stmt->fetch();
    } while ($exists);
    return $order_no;
}

$orderNumber = generateOrderNumber($pdo);

try {
    $pdo->beginTransaction();

    // Insert into orders table (include store column if it exists)
    $ordersColsStmt = $pdo->query("SHOW COLUMNS FROM orders");
    $ordersCols = $ordersColsStmt->fetchAll(PDO::FETCH_ASSOC);
    $ordersFields = array_map(function($c){ return $c['Field']; }, $ordersCols);

    if (in_array('store', $ordersFields, true)) {
        $stmt = $pdo->prepare('INSERT INTO orders (order_number, customer_name, phone, address, payment_method, total_amount, store, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$orderNumber, $name, $phone, $address, $payment, $grand, $storeName]);
    } else {
        $stmt = $pdo->prepare('INSERT INTO orders (order_number, customer_name, phone, address, payment_method, total_amount, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$orderNumber, $name, $phone, $address, $payment, $grand]);
    }
    $orderId = $pdo->lastInsertId();

    // Insert items
    // Detect available columns in order_items to avoid SQL errors if schema differs
    $colsStmt = $pdo->query("SHOW COLUMNS FROM order_items");
    $colsInfo = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
    $fields = array_map(function($c){ return $c['Field']; }, $colsInfo);

    // Build insert columns dynamically
    $insertCols = ['order_id', 'product_id', 'quantity'];
    if (in_array('product_name', $fields, true)) {
        $insertCols[] = 'product_name';
    }

    if (in_array('size', $fields, true)) {
        $insertCols[] = 'size';
    }

    // detect price-like column
    $candidates = ['unit_price','price','unitprice','unitPrice','amount','unit_cost'];
    $priceCol = null;
    foreach ($candidates as $cand) {
        if (in_array($cand, $fields, true)) {
            $priceCol = $cand;
            break;
        }
    }
    if ($priceCol) {
        $insertCols[] = $priceCol;
    }

    if (in_array('subtotal', $fields, true)) {
        $insertCols[] = 'subtotal';
    }

    // Prepare SQL
    $placeholders = implode(', ', array_fill(0, count($insertCols), '?'));
    $colsList = implode(', ', $insertCols);
    $sql = "INSERT INTO order_items ({$colsList}) VALUES ({$placeholders})";
    $stmtItem = $pdo->prepare($sql);

    foreach ($orderItems as $it) {
        $values = [];
        foreach ($insertCols as $col) {
            switch ($col) {
                case 'order_id': $values[] = $orderId; break;
                case 'product_id': $values[] = $it['product_id']; break;
                case 'quantity': $values[] = $it['qty']; break;
                case 'product_name': $values[] = $it['product_name']; break;
                case 'size': $values[] = $it['size']; break;
                case 'subtotal': $values[] = $it['subtotal']; break;
                default:
                    if ($col === $priceCol) {
                        $values[] = $it['price'];
                    } else {
                        $values[] = null;
                    }
            }
        }
        $stmtItem->execute($values);

        // Attempt to deduct inventory from chosen store
        $reduced = Inventory::reduceStock($pdo, (int)$it['product_id'], (int)$storeId, (int)$it['qty'], $it['size'] ?? null);
        if (!$reduced) {
            // rollback and report insufficient inventory
            $pdo->rollBack();
            $_SESSION['flash'] = ['type' => 'error', 'message' => "Insufficient stock for product: " . ($it['product_name'] ?? $it['product_id'])];
            header('Location: checkout.php');
            exit;
        }
    }

    $pdo->commit();

    // Clear cart
    $_SESSION['cart'] = [];
    $_SESSION['last_order_number'] = $orderNumber;

    header('Location: order-success.php');
    exit;

} catch (Exception $e) {
    $pdo->rollBack();
    // Log error for debugging
    $logDir = __DIR__ . '/../storage';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    $logFile = $logDir . '/order_errors.log';
    $msg = date('c') . " - Order error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
    @file_put_contents($logFile, $msg, FILE_APPEND);

    $_SESSION['flash'] = ['type' => 'error', 'message' => 'Could not place order. An error occurred; check storage/order_errors.log for details.'];
    header('Location: checkout.php');
    exit;
}

?>