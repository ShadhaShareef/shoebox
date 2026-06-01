<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../app/Product.php';
require_once __DIR__ . '/../../app/Cart.php';
require_once __DIR__ . '/../../app/Inventory.php';

header('Content-Type: application/json; charset=utf-8');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    respond(400, ['error' => 'Invalid JSON payload']);
}

$required = ['firstName', 'phone', 'addressLine1', 'city', 'state', 'pincode', 'deliveryMethod', 'paymentMethod'];
foreach ($required as $field) {
    if (empty(trim((string)($payload[$field] ?? '')))) {
        respond(400, ['error' => "Field {$field} is required."]); 
    }
}

$deliveryMethods = ['home_delivery', 'store_pickup', 'express_delivery'];
$paymentMethods = ['cod', 'upi', 'card'];

if (!in_array($payload['deliveryMethod'], $deliveryMethods, true)) {
    respond(400, ['error' => 'Invalid delivery method.']);
}

if (!in_array($payload['paymentMethod'], $paymentMethods, true)) {
    respond(400, ['error' => 'Invalid payment method.']);
}

$cart = new Cart();
$items = $cart->structured();
if (empty($items)) {
    respond(400, ['error' => 'Your cart is empty.']);
}

$line1 = trim((string)$payload['addressLine1']);
$line2 = trim((string)($payload['addressLine2'] ?? ''));
$city = trim((string)$payload['city']);
$state = trim((string)$payload['state']);
$pincode = trim((string)$payload['pincode']);
$address = $line1;
if ($line2 !== '') {
    $address .= ', ' . $line2;
}
$address .= ', ' . $city . ', ' . $state . ' - ' . $pincode;

$customerName = trim((string)$payload['firstName']);
$phone = trim((string)$payload['phone']);
$deliveryMethod = $payload['deliveryMethod'];
$paymentMethod = $payload['paymentMethod'];

$totalAmount = 0;
$orderItems = [];

foreach ($items as $item) {
    if (empty($item['product_id']) || empty($item['quantity'])) {
        continue;
    }

    $product = Product::find($pdo, $item['product_id']);
    if (!$product) {
        respond(400, ['error' => 'One of the products in your cart is no longer available.']);
    }

    if (empty($item['size'])) {
        respond(400, ['error' => 'Please select a size for ' . $product['name'] . '.']);
    }

    $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : $product['price'];
    $quantity = max(1, (int)$item['quantity']);
    $subtotal = $price * $quantity;
    $totalAmount += $subtotal;
    $orderItems[] = [
        'product_id' => $item['product_id'],
        'product_name' => $product['name'],
        'quantity' => $quantity,
        'price' => $price,
        'subtotal' => $subtotal,
        'size' => $item['size'],
    ];
}

if (empty($orderItems)) {
    respond(400, ['error' => 'No valid products were found in your cart.']);
}

function calculateShipping(string $method): int
{
    if ($method === 'store_pickup') {
        return 0;
    }
    if ($method === 'express_delivery') {
        return 99;
    }
    return 49;
}

function calculateTax(int $subtotal): int
{
    return (int)round($subtotal * 0.05);
}

$shipping = calculateShipping($deliveryMethod);
$tax = calculateTax($totalAmount);
$grandTotal = $totalAmount + $shipping + $tax;

function generateOrderNumber(PDO $pdo): string
{
    do {
        $num = mt_rand(100000, 999999);
        $orderNo = 'SHOEBOX-' . $num;
        $stmt = $pdo->prepare('SELECT id FROM orders WHERE order_number = ? LIMIT 1');
        $stmt->execute([$orderNo]);
        $exists = $stmt->fetch();
    } while ($exists);
    return $orderNo;
}

$nearestStore = Inventory::getNearestStore();
$storeName = $nearestStore['name'];

try {
    $pdo->beginTransaction();

    $ordersColsStmt = $pdo->query('SHOW COLUMNS FROM orders');
    $ordersCols = $ordersColsStmt->fetchAll(PDO::FETCH_ASSOC);
    $ordersFields = array_map(fn($c) => $c['Field'], $ordersCols);

    $orderNumber = generateOrderNumber($pdo);
    $orderInsertFields = ['order_number', 'customer_name', 'phone', 'address', 'payment_method', 'total_amount', 'created_at'];
    $orderInsertValues = [$orderNumber, $customerName, $phone, $address, $paymentMethod, $grandTotal, date('Y-m-d H:i:s')];

    if (in_array('store', $ordersFields, true)) {
        $orderInsertFields[] = 'store';
        $orderInsertValues[] = $storeName;
    }

    if (in_array('delivery_method', $ordersFields, true)) {
        $orderInsertFields[] = 'delivery_method';
        $orderInsertValues[] = $deliveryMethod;
    }

    $fieldsPart = implode(', ', $orderInsertFields);
    $placeholders = implode(', ', array_fill(0, count($orderInsertFields), '?'));
    $stmtOrder = $pdo->prepare("INSERT INTO orders ({$fieldsPart}) VALUES ({$placeholders})");
    $stmtOrder->execute($orderInsertValues);
    $orderId = $pdo->lastInsertId();

    $colsStmt = $pdo->query('SHOW COLUMNS FROM order_items');
    $colsInfo = $colsStmt->fetchAll(PDO::FETCH_ASSOC);
    $fields = array_map(fn($c) => $c['Field'], $colsInfo);

    $insertCols = ['order_id', 'product_id', 'quantity'];
    if (in_array('product_name', $fields, true)) {
        $insertCols[] = 'product_name';
    }
    if (in_array('size', $fields, true)) {
        $insertCols[] = 'size';
    }
    $priceCol = null;
    foreach (['unit_price', 'price', 'amount'] as $cand) {
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

    $placeholders = implode(', ', array_fill(0, count($insertCols), '?'));
    $colsList = implode(', ', $insertCols);
    $stmtItem = $pdo->prepare("INSERT INTO order_items ({$colsList}) VALUES ({$placeholders})");

    foreach ($orderItems as $orderItem) {
        $values = [];
        foreach ($insertCols as $col) {
            switch ($col) {
                case 'order_id': $values[] = $orderId; break;
                case 'product_id': $values[] = $orderItem['product_id']; break;
                case 'quantity': $values[] = $orderItem['quantity']; break;
                case 'product_name': $values[] = $orderItem['product_name']; break;
                case 'size': $values[] = $orderItem['size']; break;
                case 'subtotal': $values[] = $orderItem['subtotal']; break;
                default:
                    if ($col === $priceCol) {
                        $values[] = $orderItem['price'];
                    } else {
                        $values[] = null;
                    }
            }
        }
        $stmtItem->execute($values);

        $reduced = Inventory::reduceStock($pdo, (int)$orderItem['product_id'], (int)$nearestStore['id'], (int)$orderItem['quantity'], $orderItem['size']);
        if (!$reduced) {
            $pdo->rollBack();
            respond(400, ['error' => 'Insufficient stock for ' . $orderItem['product_name']]);
        }
    }

    $pdo->commit();
    $_SESSION['cart'] = [];
    respond(200, ['success' => true, 'orderId' => $orderNumber, 'total' => $grandTotal]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $logDir = __DIR__ . '/../../storage';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0755, true);
    }
    @file_put_contents($logDir . '/order_errors.log', date('c') . ' - ' . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n", FILE_APPEND);
    respond(500, ['error' => 'Could not place order. Please try again later.']);
}
