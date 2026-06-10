<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/security.php';

session_start();

// Security checks
setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

header('Content-Type: application/json; charset=utf-8');

try {
    $id = getValidatedInt('id', 0);
    
    if ($id < 1) {
        jsonError('Invalid product id', 400);
    }
    
    $stmt = $pdo->prepare('SELECT p.*, b.name AS brand, c.name AS category FROM products p LEFT JOIN brands b ON p.brand_id = b.id LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.is_active = TRUE');
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        jsonError('Product not found', 404);
    }
    
    $relatedStmt = $pdo->prepare('SELECT * FROM products WHERE category = ? AND id != ? AND is_active = TRUE ORDER BY id DESC LIMIT 4');
    $relatedStmt->execute([$product['category'], $id]);
    $relatedProducts = $relatedStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $transform = function ($item, $index = 0) {
        return [
            'id' => (int)$item['id'],
            'name' => htmlspecialchars($item['name'], ENT_QUOTES, 'UTF-8'),
            'slug' => htmlspecialchars($item['slug'], ENT_QUOTES, 'UTF-8'),
            'description' => htmlspecialchars($item['description'] ?? '', ENT_QUOTES, 'UTF-8'),
            'price' => (float)$item['price'],
            'sale_price' => $item['sale_price'] !== null ? (float)$item['sale_price'] : null,
            'brand' => htmlspecialchars($item['brand'] ?? '', ENT_QUOTES, 'UTF-8'),
            'category' => htmlspecialchars($item['category'] ?? '', ENT_QUOTES, 'UTF-8'),
            'created_at' => $item['created_at'],
            'image_url' => 'https://images.unsplash.com/photo-1519741491745-1d2de7b77158?auto=format&fit=crop&w=1000&q=80',
            'rating' => 4.8,
            'review_count' => rand(20, 85),
            'sizes' => ['6', '7', '8', '9', '10', '11'],
            'colors' => ['Black', 'White', 'Sand'],
            'features' => ['Breathable knit upper', 'Responsive midsole', 'Durable rubber outsole'],
        ];
    };
    
    $productPayload = $transform($product, 0);
    $relatedPayload = array_map(fn($item, $index) => $transform($item, $index + 1), $relatedProducts, array_keys($relatedProducts));
    
    jsonResponse(['product' => $productPayload, 'related' => $relatedPayload]);
    
} catch (Exception $e) {
    error_log('Product API Error: ' . $e->getMessage());
    jsonError('Failed to fetch product', 500);
}

