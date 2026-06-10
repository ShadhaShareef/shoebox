<?php
require_once __DIR__ . '/../../app/Cart.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../app/Product.php';
require_once __DIR__ . '/security.php';

// Security checks
setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

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

function buildCartResponse(Cart $cart, PDO $pdo): array
{
    $structured = $cart->structured();
    $itemsOut = [];
    foreach ($structured as $it) {
        $prod = Product::find($pdo, $it['product_id']);
        $itemsOut[] = [
            'product_id' => $it['product_id'],
            'size' => htmlspecialchars($it['size'] ?? '', ENT_QUOTES, 'UTF-8'),
            'quantity' => (int)$it['quantity'],
            'product' => $prod ? [
                'id' => (int)$prod['id'],
                'name' => htmlspecialchars($prod['name'], ENT_QUOTES, 'UTF-8'),
                'price' => (float)$prod['price'],
                'sale_price' => $prod['sale_price'] !== null ? (float)$prod['sale_price'] : null,
                'brand' => htmlspecialchars($prod['brand'] ?? '', ENT_QUOTES, 'UTF-8'),
                'category' => htmlspecialchars($prod['category'] ?? '', ENT_QUOTES, 'UTF-8'),
                'image_url' => htmlspecialchars($prod['image_url'] ?? '', ENT_QUOTES, 'UTF-8'),
            ] : null,
        ];
    }

    return array_merge(['items' => $itemsOut], formatCartTotals($structured));
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload) || !isset($payload['action'])) {
            jsonError('Invalid request', 400);
        }

        $action = $payload['action'];
        $productId = isset($payload['product_id']) ? (int)$payload['product_id'] : 0;
        $size = isset($payload['size']) ? sanitizeString($payload['size']) : null;

        if (in_array($action, ['add', 'update', 'remove'], true) && $productId < 1) {
            jsonError('Invalid product id', 400);
        }

        if ($action === 'add') {
            $quantity = isset($payload['quantity']) ? max(1, (int)$payload['quantity']) : 1;
            $cart->add($productId, $quantity, $size);
            jsonResponse(array_merge(['success' => true, 'message' => 'Added to cart'], buildCartResponse($cart, $pdo)));
        }

        if ($action === 'update') {
            $quantity = isset($payload['quantity']) ? (int)$payload['quantity'] : 1;
            $cart->update($productId, $quantity, $size);
            jsonResponse(array_merge(['success' => true, 'message' => 'Cart updated'], buildCartResponse($cart, $pdo)));
        }

        if ($action === 'remove') {
            $cart->remove($productId, $size);
            jsonResponse(array_merge(['success' => true, 'message' => 'Item removed'], buildCartResponse($cart, $pdo)));
        }

        if ($action === 'clear') {
            $_SESSION['cart'] = [];
            jsonResponse(['success' => true, 'message' => 'Cart cleared', 'items' => [], 'subtotal' => 0, 'shipping' => 0, 'tax' => 0, 'total' => 0]);
        }
    }

    jsonResponse(buildCartResponse($cart, $pdo));
    
} catch (Exception $e) {
    error_log('Cart API Error: ' . $e->getMessage());
    jsonError('Failed to process cart request', 500);
}
