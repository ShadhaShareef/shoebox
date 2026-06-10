<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/security.php';

// Security checks
setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

header('Content-Type: application/json; charset=utf-8');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    jsonError('Authentication required', 401);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload) || !isset($payload['action'])) {
            jsonError('Invalid request payload', 400);
        }

        $productId = isset($payload['product_id']) ? (int)$payload['product_id'] : 0;
        if ($productId < 1) {
            jsonError('Invalid product ID', 400);
        }

        if ($payload['action'] === 'add') {
            // Check if already in wishlist
            $check = $pdo->prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?');
            $check->execute([$userId, $productId]);
            if (!$check->fetch()) {
                $stmt = $pdo->prepare('INSERT INTO wishlists (user_id, product_id, created_at) VALUES (?, ?, NOW())');
                $stmt->execute([$userId, $productId]);
            }
            jsonResponse(['success' => true, 'message' => 'Product added to wishlist']);
        } elseif ($payload['action'] === 'remove') {
            $stmt = $pdo->prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?');
            $stmt->execute([$userId, $productId]);
            jsonResponse(['success' => true, 'message' => 'Product removed from wishlist']);
        } elseif ($payload['action'] === 'toggle') {
            $check = $pdo->prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?');
            $check->execute([$userId, $productId]);
            if ($check->fetch()) {
                $stmt = $pdo->prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?');
                $stmt->execute([$userId, $productId]);
                jsonResponse(['success' => true, 'action' => 'removed', 'message' => 'Product removed from wishlist']);
            } else {
                $stmt = $pdo->prepare('INSERT INTO wishlists (user_id, product_id, created_at) VALUES (?, ?, NOW())');
                $stmt->execute([$userId, $productId]);
                jsonResponse(['success' => true, 'action' => 'added', 'message' => 'Product added to wishlist']);
            }
        } else {
            jsonError('Invalid action', 400);
        }
    }

    // GET request
    $stmt = $pdo->prepare('
        SELECT p.id, p.name, p.slug, p.price, p.sale_price, p.image_url, p.brand, p.category 
        FROM wishlists w 
        JOIN products p ON w.product_id = p.id 
        WHERE w.user_id = ? 
        ORDER BY w.created_at DESC
    ');
    $stmt->execute([$userId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cleanItems = array_map(function ($item) {
        return [
            'id' => (int)$item['id'],
            'name' => htmlspecialchars($item['name'], ENT_QUOTES, 'UTF-8'),
            'slug' => htmlspecialchars($item['slug'], ENT_QUOTES, 'UTF-8'),
            'price' => (float)$item['price'],
            'sale_price' => $item['sale_price'] !== null ? (float)$item['sale_price'] : null,
            'image_url' => htmlspecialchars($item['image_url'] ?? '', ENT_QUOTES, 'UTF-8'),
            'brand' => htmlspecialchars($item['brand'] ?? '', ENT_QUOTES, 'UTF-8'),
            'category' => htmlspecialchars($item['category'] ?? '', ENT_QUOTES, 'UTF-8'),
        ];
    }, $items);

    jsonResponse(['items' => $cleanItems]);

} catch (Exception $e) {
    error_log('Wishlist API Error: ' . $e->getMessage());
    jsonError('Failed to process wishlist request', 500);
}
