<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../app/Inventory.php';
header('Content-Type: application/json; charset=utf-8');

$productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
$size = isset($_GET['size']) && $_GET['size'] !== '' ? $_GET['size'] : null;

if ($productId < 1) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid product_id']);
    exit;
}

$stores = [];
foreach (Inventory::getStores() as $sid => $sname) {
    $stock = Inventory::getStock($pdo, $productId, (int)$sid, $size);
    $stores[] = [
        'id' => (int)$sid,
        'name' => $sname,
        'stock' => $stock,
    ];
}

echo json_encode(['stores' => $stores], JSON_UNESCAPED_SLASHES);
