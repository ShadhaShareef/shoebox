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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    jsonError('Invalid JSON payload', 400);
}

$email = sanitizeString(trim((string)($payload['email'] ?? '')));
$password = trim((string)($payload['password'] ?? ''));

if ($email === '' || $password === '') {
    jsonError('Email and password are required.', 400);
}

try {
    $stmt = $pdo->prepare('SELECT id, email, password_hash, first_name, last_name, phone, created_at, updated_at FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password.', 401);
    }

    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $update = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $update->execute([$newHash, (int)$user['id']]);
    }

    $_SESSION['user_id'] = (int)$user['id'];

    jsonResponse([
        'success' => true,
        'user' => [
            'id' => (int)$user['id'],
            'email' => sanitizeString($user['email']),
            'firstName' => sanitizeString($user['first_name'] ?? ''),
            'lastName' => sanitizeString($user['last_name'] ?? ''),
            'phone' => $user['phone'] !== null ? sanitizeString($user['phone']) : null,
            'createdAt' => $user['created_at'],
            'updatedAt' => $user['updated_at'],
        ],
    ]);
} catch (Exception $e) {
    error_log('Login API Error: ' . $e->getMessage());
    jsonError('Unable to authenticate. Please try again later.', 500);
}
