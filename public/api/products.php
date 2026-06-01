<?php
require_once __DIR__ . '/../../config/db.php';
header('Content-Type: application/json; charset=utf-8');
function respond($data) { echo json_encode($data, JSON_UNESCAPED_SLASHES); exit; }
$search = trim($_GET['search'] ?? '');
$category = trim($_GET['category'] ?? '');
$brand = trim($_GET['brand'] ?? '');
$sort = trim($_GET['sort'] ?? 'best');
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(24, max(6, (int)($_GET['limit'] ?? 12)));
$offset = ($page - 1) * $limit;
$where = [];
$params = [];
if ($search !== '') {
    $where[] = '(name LIKE :search OR brand LIKE :search OR category LIKE :search)';
    $params[':search'] = "%{$search}%";
}
if ($category !== '' && $category !== 'all') {
    $where[] = "(category = :category OR LOWER(REPLACE(category, ' ', '-')) = :category)";
    $params[':category'] = $category;
}
if ($brand !== '' && $brand !== 'all') {
    $where[] = 'brand = :brand';
    $params[':brand'] = $brand;
}
$query = 'SELECT * FROM products';
if ($where) {
    $query .= ' WHERE ' . implode(' AND ', $where);
}
switch ($sort) {
    case 'price_asc':
        $query .= ' ORDER BY COALESCE(sale_price, price) ASC';
        break;
    case 'price_desc':
        $query .= ' ORDER BY COALESCE(sale_price, price) DESC';
        break;
    case 'newest':
        $query .= ' ORDER BY created_at DESC';
        break;
    default:
        $query .= ' ORDER BY id DESC';
        break;
}
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$allProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);
$total = count($allProducts);
$paginated = array_slice($allProducts, $offset, $limit);
function imageFor($product) {
    $query = rawurlencode($product['category'] ?: $product['brand'] ?: 'sneakers');
    return "https://images.unsplash.com/photo-1528701800489-20f2d5a38f7d?auto=format&fit=crop&w=900&q=80";
}
$items = array_map(function ($product) {
    return [
        'id' => (int)$product['id'],
        'name' => $product['name'],
        'slug' => $product['slug'],
        'description' => $product['description'],
        'price' => (float)$product['price'],
        'sale_price' => $product['sale_price'] !== null ? (float)$product['sale_price'] : null,
        'brand' => $product['brand'],
        'category' => $product['category'],
        'created_at' => $product['created_at'],
        'image_url' => imageFor($product),
        'rating' => 4.8,
        'review_count' => rand(34, 94),
    ];
}, $paginated);
respond(['items' => $items, 'total' => $total, 'page' => $page, 'pageSize' => $limit]);
