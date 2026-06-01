<?php
require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');
function respond($data, $status = 200) { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_SLASHES); exit; }
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id < 1) {
    respond(['error' => 'Invalid product id'], 400);
}
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$product) {
    respond(['error' => 'Product not found'], 404);
}
function imageFor($product) {
    return "https://images.unsplash.com/photo-1519741491745-1d2de7b77158?auto=format&fit=crop&w=1000&q=80";
}
function relatedImages($index) {
    $images = [
        'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1600185365370-0c8d1e8e51d3?auto=format&fit=crop&w=900&q=80',
    ];
    return $images[$index % count($images)];
}
$relatedStmt = $pdo->prepare('SELECT * FROM products WHERE category = ? AND id != ? ORDER BY id DESC LIMIT 4');
$relatedStmt->execute([$product['category'], $id]);
$relatedProducts = $relatedStmt->fetchAll(PDO::FETCH_ASSOC);
$transform = function ($item, $index = 0) {
    return [
        'id' => (int)$item['id'],
        'name' => $item['name'],
        'slug' => $item['slug'],
        'description' => $item['description'],
        'price' => (float)$item['price'],
        'sale_price' => $item['sale_price'] !== null ? (float)$item['sale_price'] : null,
        'brand' => $item['brand'],
        'category' => $item['category'],
        'created_at' => $item['created_at'],
        'image_url' => $index === 0 ? imageFor($item) : relatedImages($index),
        'rating' => 4.8,
        'review_count' => rand(20, 85),
        'sizes' => ['6', '7', '8', '9', '10', '11'],
        'colors' => ['Black', 'White', 'Sand'],
        'features' => ['Breathable knit upper', 'Responsive midsole', 'Durable rubber outsole'],
    ];
};
$productPayload = $transform($product, 0);
$relatedPayload = array_map(fn($item, $index) => $transform($item, $index + 1), $relatedProducts, array_keys($relatedProducts));
respond(['product' => $productPayload, 'related' => $relatedPayload]);
