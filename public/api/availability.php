<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/security.php';
require_once __DIR__ . '/../../app/Inventory.php';

session_start();

// Security checks
setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

header('Content-Type: application/json; charset=utf-8');

try {
    $productId = getValidatedInt('product_id', 0);
    $size = getValidatedString('size', '', 10);
    
    if ($productId < 1) {
        jsonError('Invalid product_id', 400);
    }
    
    $stores = [];
    foreach (Inventory::getStores() as $sid => $sname) {
        $stock = Inventory::getStock($pdo, $productId, (int)$sid, $size !== '' ? $size : null);
        $stores[] = [
            'id' => (int)$sid,
            'name' => htmlspecialchars($sname, ENT_QUOTES, 'UTF-8'),
            'stock' => (int)$stock,
        ];
    }
    
    jsonResponse(['stores' => $stores]);
    
} catch (Exception $e) {
    error_log('Availability API Error: ' . $e->getMessage());
    jsonError('Failed to fetch availability', 500);
}
