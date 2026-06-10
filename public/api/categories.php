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
    $stmt = $pdo->prepare('SELECT id, name, slug, description, image_url FROM categories ORDER BY name ASC');
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $items = array_map(function ($category) {
        return [
            'id' => (int)$category['id'],
            'slug' => htmlspecialchars($category['slug'], ENT_QUOTES, 'UTF-8'),
            'name' => htmlspecialchars($category['name'], ENT_QUOTES, 'UTF-8'),
            'description' => htmlspecialchars($category['description'] ?? 'Explore our curated collection.', ENT_QUOTES, 'UTF-8'),
            'image_url' => htmlspecialchars($category['image_url'] ?? 'https://images.unsplash.com/photo-1519741491745-1d2de7b77158?auto=format&fit=crop&w=900&q=80', ENT_QUOTES, 'UTF-8'),
        ];
    }, $categories);
    
    jsonResponse(['categories' => $items]);
    
} catch (Exception $e) {
    error_log('Categories API Error: ' . $e->getMessage());
    jsonError('Failed to fetch categories', 500);
}
