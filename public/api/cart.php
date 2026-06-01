<?php
require_once __DIR__ . '/../../app/Cart.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../app/Product.php';
header('Content-Type: application/json; charset=utf-8');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function formatCartTotals(array $items): array
{
    $subtotal = 0;
    foreach ($items as $item) {
        $product = Product::find($GLOBALS['pdo'], $item['product_id']);
        if (!$product) {
            continue;
        }
        $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : $product['price'];
        $subtotal += $price * $item['quantity'];
    }

    $shipping = $subtotal > 3000 ? 0 : 49;
    $tax = (int)round($subtotal * 0.05);
    $total = $subtotal + $shipping + $tax;
    return ['subtotal' => $subtotal, 'shipping' => $shipping, 'tax' => $tax, 'total' => $total];
}

$cart = new Cart();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload) || !isset($payload['action'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request']);
        exit;
    }
    if ($payload['action'] === 'add') {
        $productId = isset($payload['product_id']) ? (int)$payload['product_id'] : 0;
        $quantity = isset($payload['quantity']) ? max(1, (int)$payload['quantity']) : 1;
        $size = isset($payload['size']) ? $payload['size'] : null;
        if ($productId < 1) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid product id']);
            exit;
        }
        $cart->add($productId, $quantity, $size);
        // Build structured items for response
        $structured = $cart->structured();
        $itemsOut = [];
        foreach ($structured as $it) {
            $prod = Product::find($pdo, $it['product_id']);
            $itemsOut[] = [
                'product_id' => $it['product_id'],
                'size' => $it['size'],
                'quantity' => $it['quantity'],
                'product' => $prod ? [
                    'id' => (int)$prod['id'],
                    'name' => $prod['name'],
                    'price' => (float)$prod['price'],
                    'sale_price' => $prod['sale_price'] !== null ? (float)$prod['sale_price'] : null,
                    'brand' => $prod['brand'],
                    'category' => $prod['category'],
                ] : null,
            ];
        }

        echo json_encode(['success' => true, 'message' => 'Added to cart', 'itemCount' => array_sum($cart->items()), 'total' => $cart->total($pdo), 'items' => $itemsOut]);
        exit;
    }
}

$structured = $cart->structured();
$itemsOut = [];
foreach ($structured as $it) {
    $prod = Product::find($pdo, $it['product_id']);
    $itemsOut[] = [
        'product_id' => $it['product_id'],
        'size' => $it['size'],
        'quantity' => $it['quantity'],
        'product' => $prod ? [
            'id' => (int)$prod['id'],
            'name' => $prod['name'],
            'price' => (float)$prod['price'],
            'sale_price' => $prod['sale_price'] !== null ? (float)$prod['sale_price'] : null,
            'brand' => $prod['brand'],
            'category' => $prod['category'],
        ] : null,
    ];
}

$totals = formatCartTotals($structured);
echo json_encode(array_merge(['items' => $itemsOut], $totals));
