<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/security.php';

setSecurityHeaders();
handleCorsPreFlight();
checkRateLimit();

header('Content-Type: application/json; charset=utf-8');

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    jsonError('Authentication required', 401);
}

try {
    $stmt = $pdo->prepare(
        'SELECT o.id, o.order_number, o.status, o.total_amount, o.payment_method, o.delivery_method, o.created_at, COUNT(i.id) AS items
         FROM orders o
         LEFT JOIN order_items i ON i.order_id = o.id
         WHERE o.user_id = ?
         GROUP BY o.id
         ORDER BY o.created_at DESC'
    );
    $stmt->execute([(int)$userId]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cleanOrders = array_map(function ($order) {
        return [
            'id' => (int)$order['id'],
            'orderNumber' => sanitizeString($order['order_number']),
            'status' => sanitizeString($order['status']),
            'totalAmount' => (float)$order['total_amount'],
            'items' => (int)$order['items'],
            'paymentMethod' => sanitizeString($order['payment_method'] ?? ''),
            'deliveryMethod' => sanitizeString($order['delivery_method'] ?? ''),
            'createdAt' => $order['created_at'],
        ];
    }, $orders);

    jsonResponse(['orders' => $cleanOrders]);
} catch (Exception $e) {
    error_log('Account Orders API Error: ' . $e->getMessage());
    jsonError('Failed to load order history', 500);
}
