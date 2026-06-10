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
    $stmt = $pdo->prepare('SELECT id, name, slug, logo_url, description FROM brands ORDER BY name ASC');
    $stmt->execute();
    $brands = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $items = array_map(function ($brand) {
        return [
            'id' => (int)$brand['id'],
            'slug' => htmlspecialchars($brand['slug'], ENT_QUOTES, 'UTF-8'),
            'name' => htmlspecialchars($brand['name'], ENT_QUOTES, 'UTF-8'),
            'logo_url' => htmlspecialchars($brand['logo_url'] ?? 'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=200&q=80', ENT_QUOTES, 'UTF-8'),
            'description' => htmlspecialchars($brand['description'] ?? 'Premium footwear and lifestyle styles.', ENT_QUOTES, 'UTF-8'),
        ];
    }, $brands);
    
    jsonResponse(['brands' => $items]);
    
} catch (Exception $e) {
    error_log('Brands API Error: ' . $e->getMessage());
    jsonError('Failed to fetch brands', 500);
}
