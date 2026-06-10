<?php
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/security.php';

// Security checks
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
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $payload = json_decode(file_get_contents('php://input'), true);
        if (!is_array($payload)) {
            jsonError('Invalid request payload', 400);
        }

        $action = sanitizeString($payload['action'] ?? '');
        $addressId = isset($payload['id']) ? (int)$payload['id'] : 0;

        if ($action === 'delete') {
            if ($addressId < 1) {
                jsonError('Invalid address ID', 400);
            }
            $stmt = $pdo->prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?');
            $stmt->execute([$addressId, $userId]);
            jsonResponse(['success' => true, 'message' => 'Address deleted successfully']);
        }

        if ($action === 'set_default') {
            if ($addressId < 1) {
                jsonError('Invalid address ID', 400);
            }
            
            // Begin transaction
            $pdo->beginTransaction();
            
            // Set all user's addresses to not default
            $stmt = $pdo->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?');
            $stmt->execute([$userId]);
            
            // Set target address to default
            $stmt = $pdo->prepare('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?');
            $stmt->execute([$addressId, $userId]);
            
            $pdo->commit();
            jsonResponse(['success' => true, 'message' => 'Default address updated']);
        }

        // Add or Update address
        $label = sanitizeString(trim((string)($payload['label'] ?? '')));
        $addressLine1 = sanitizeString(trim((string)($payload['addressLine1'] ?? '')));
        $addressLine2 = sanitizeString(trim((string)($payload['addressLine2'] ?? '')));
        $city = sanitizeString(trim((string)($payload['city'] ?? '')));
        $state = sanitizeString(trim((string)($payload['state'] ?? '')));
        $pincode = sanitizeString(trim((string)($payload['pincode'] ?? '')));
        $phone = sanitizeString(trim((string)($payload['phone'] ?? '')));
        $isDefault = (bool)($payload['isDefault'] ?? false);

        if ($addressLine1 === '' || $city === '' || $state === '' || $pincode === '') {
            jsonError('Address line 1, city, state, and pincode are required.', 400);
        }

        $pdo->beginTransaction();

        if ($isDefault) {
            // Unset current default addresses
            $stmt = $pdo->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?');
            $stmt->execute([$userId]);
        }

        if ($addressId > 0) {
            // Update
            $stmt = $pdo->prepare('
                UPDATE addresses 
                SET label = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, pincode = ?, phone = ?, is_default = ?, updated_at = NOW() 
                WHERE id = ? AND user_id = ?
            ');
            $stmt->execute([
                $label !== '' ? $label : null,
                $addressLine1,
                $addressLine2 !== '' ? $addressLine2 : null,
                $city,
                $state,
                $pincode,
                $phone !== '' ? $phone : null,
                $isDefault ? 1 : 0,
                $addressId,
                $userId
            ]);
            $message = 'Address updated successfully';
        } else {
            // Insert
            // Check if this is the first address, if so, make it default anyway
            $check = $pdo->prepare('SELECT COUNT(*) FROM addresses WHERE user_id = ?');
            $check->execute([$userId]);
            $count = (int)$check->fetchColumn();
            if ($count === 0) {
                $isDefault = true;
            }

            $stmt = $pdo->prepare('
                INSERT INTO addresses (user_id, label, address_line1, address_line2, city, state, pincode, phone, is_default, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ');
            $stmt->execute([
                $userId,
                $label !== '' ? $label : null,
                $addressLine1,
                $addressLine2 !== '' ? $addressLine2 : null,
                $city,
                $state,
                $pincode,
                $phone !== '' ? $phone : null,
                $isDefault ? 1 : 0
            ]);
            $message = 'Address added successfully';
        }

        $pdo->commit();
        jsonResponse(['success' => true, 'message' => $message]);
    }

    // GET request (fetch addresses)
    $stmt = $pdo->prepare('SELECT id, label, address_line1, address_line2, city, state, pincode, phone, is_default FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC');
    $stmt->execute([$userId]);
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

    jsonResponse(['addresses' => $cleanAddresses]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Addresses API Error: ' . $e->getMessage());
    jsonError('Failed to process addresses request', 500);
}
