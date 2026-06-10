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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        jsonError('Invalid JSON payload', 400);
    }
    
    $firstName = sanitizeString(trim((string)($payload['firstName'] ?? '')));
    $lastName = sanitizeString(trim((string)($payload['lastName'] ?? '')));
    $phone = sanitizeString(trim((string)($payload['phone'] ?? '')));
    
    if ($firstName === '' || $lastName === '') {
        jsonError('First name and last name are required.', 400);
    }
    
    try {
        $stmt = $pdo->prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = NOW() WHERE id = ?');
        $stmt->execute([$firstName, $lastName, $phone !== '' ? $phone : null, (int)$userId]);
        
        $stmt = $pdo->prepare('SELECT id, email, first_name, last_name, phone, created_at, updated_at FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([(int)$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        jsonResponse([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => (int)$user['id'],
                'email' => sanitizeString($user['email']),
                'firstName' => sanitizeString($user['first_name'] ?? ''),
                'lastName' => sanitizeString($user['last_name'] ?? ''),
                'phone' => $user['phone'] !== null ? sanitizeString($user['phone']) : null,
                'createdAt' => $user['created_at'],
                'updatedAt' => $user['updated_at'],
            ]
        ]);
    } catch (Exception $e) {
        error_log('Account Update API Error: ' . $e->getMessage());
        jsonError('Failed to update account information', 500);
    }
}

try {
    $stmt = $pdo->prepare('SELECT id, email, first_name, last_name, phone, created_at, updated_at FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int)$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        jsonError('User not found', 404);
    }

    $stmt = $pdo->prepare('SELECT id, label, address_line1, address_line2, city, state, pincode, phone, is_default FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC');
    $stmt->execute([(int)$userId]);
    $addresses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $cleanAddresses = array_map(function ($address) {
        return [
            'id' => (int)$address['id'],
            'label' => $address['label'] !== null ? sanitizeString($address['label']) : null,
            'addressLine1' => sanitizeString($address['address_line1']),
            'addressLine2' => $address['address_line2'] !== null ? sanitizeString($address['address_line2']) : null,
            'city' => $address['city'] !== null ? sanitizeString($address['city']) : null,
            'state' => $address['state'] !== null ? sanitizeString($address['state']) : null,
            'pincode' => $address['pincode'] !== null ? sanitizeString($address['pincode']) : null,
            'phone' => $address['phone'] !== null ? sanitizeString($address['phone']) : null,
            'isDefault' => (bool)$address['is_default'],
        ];
    }, $addresses);

    $userResponse = [
        'id' => (int)$user['id'],
        'email' => sanitizeString($user['email']),
        'firstName' => sanitizeString($user['first_name'] ?? ''),
        'lastName' => sanitizeString($user['last_name'] ?? ''),
        'phone' => $user['phone'] !== null ? sanitizeString($user['phone']) : null,
        'createdAt' => $user['created_at'],
        'updatedAt' => $user['updated_at'],
    ];

    jsonResponse([
        'user' => $userResponse,
        'addresses' => $cleanAddresses,
    ]);
} catch (Exception $e) {
    error_log('Account API Error: ' . $e->getMessage());
    jsonError('Failed to load account information', 500);
}
