<?php
require_once __DIR__ . '/security.php';

session_start();

// Security checks
setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../../config/db.php';

    $productId = getValidatedInt('product_id', 0);
    if ($productId < 1) {
        jsonResponse(['reviews' => []]);
    }
    
    $stmt = $pdo->prepare('SELECT id, author_name, rating, headline, body, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 20');
    $stmt->execute([$productId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $items = array_map(function ($review) {
        return [
            'id' => (int)$review['id'],
            'author' => htmlspecialchars($review['author_name'] ?? 'Guest', ENT_QUOTES, 'UTF-8'),
            'rating' => (int)$review['rating'],
            'headline' => htmlspecialchars($review['headline'] ?? '', ENT_QUOTES, 'UTF-8'),
            'body' => htmlspecialchars($review['body'] ?? '', ENT_QUOTES, 'UTF-8'),
            'created_at' => htmlspecialchars($review['created_at'], ENT_QUOTES, 'UTF-8'),
        ];
    }, $reviews);
    
    jsonResponse(['reviews' => $items]);
    
} catch (Exception $e) {
    error_log('Reviews API Error: ' . $e->getMessage());
    jsonError('Failed to fetch reviews', 500);
}
