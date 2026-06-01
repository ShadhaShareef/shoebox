<?php
require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');
$stmt = $pdo->query('SELECT DISTINCT category FROM products ORDER BY category ASC');
$categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
$imageMap = [
    'Running Shoes' => 'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=900&q=80',
    'Casual Shoes' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    'Sports Shoes' => 'https://images.unsplash.com/photo-1600185365370-0c8d1e8e51d3?auto=format&fit=crop&w=900&q=80',
    'Formal Shoes' => 'https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=900&q=80',
];
$items = array_map(function ($category) use ($imageMap) {
    return [
        'slug' => strtolower(str_replace(' ', '-', $category)),
        'name' => $category,
        'description' => "Explore our curated {$category} collection.",
        'image_url' => $imageMap[$category] ?? 'https://images.unsplash.com/photo-1519741491745-1d2de7b77158?auto=format&fit=crop&w=900&q=80',
    ];
}, $categories);
echo json_encode(['categories' => $items], JSON_UNESCAPED_SLASHES);
