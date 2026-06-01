<?php
require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');
$stmt = $pdo->query('SELECT DISTINCT brand FROM products ORDER BY brand ASC');
$brands = $stmt->fetchAll(PDO::FETCH_COLUMN);
$logoMap = [
    'Nike' => 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    'Adidas' => 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    'Puma' => 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Puma_logo.svg',
    'Reebok' => 'https://upload.wikimedia.org/wikipedia/commons/0/07/Reebok_logo.svg',
];
$items = array_map(function ($brand) use ($logoMap) {
    return [
        'slug' => strtolower(str_replace(' ', '-', $brand)),
        'name' => $brand,
        'logo_url' => $logoMap[$brand] ?? 'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=200&q=80',
        'description' => 'Premium footwear and lifestyle styles.',
    ];
}, $brands);
echo json_encode(['brands' => $items], JSON_UNESCAPED_SLASHES);
