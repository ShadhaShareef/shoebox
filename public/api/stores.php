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

    $stmt = $pdo->prepare('SELECT id, name, address, city, phone, email, opening_time, closing_time, is_active FROM stores WHERE is_active = TRUE ORDER BY city ASC, name ASC');
    $stmt->execute();
    $stores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $sanitizedStores = array_map(function ($store) {
        return [
            'id' => (int)$store['id'],
            'name' => htmlspecialchars($store['name'], ENT_QUOTES, 'UTF-8'),
            'address' => htmlspecialchars($store['address'], ENT_QUOTES, 'UTF-8'),
            'city' => htmlspecialchars($store['city'], ENT_QUOTES, 'UTF-8'),
            'phone' => htmlspecialchars($store['phone'] ?? '', ENT_QUOTES, 'UTF-8'),
            'email' => htmlspecialchars($store['email'] ?? '', ENT_QUOTES, 'UTF-8'),
            'hours' => htmlspecialchars(trim(($store['opening_time'] ?? '') . ' - ' . ($store['closing_time'] ?? '')), ENT_QUOTES, 'UTF-8'),
            'availability' => $store['is_active'] ? 'Open' : 'Closed',
        ];
    }, $stores);
    
    jsonResponse(['stores' => $sanitizedStores]);
    
} catch (Exception $e) {
    error_log('Stores API Error: ' . $e->getMessage());
    jsonError('Failed to fetch stores', 500);
}

