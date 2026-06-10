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

$firstName = sanitizeString(trim((string)($payload['firstName'] ?? '')));
$lastName = sanitizeString(trim((string)($payload['lastName'] ?? '')));
$fullName = sanitizeString(trim((string)($payload['fullName'] ?? '')));
$email = filter_var(trim((string)($payload['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$password = trim((string)($payload['password'] ?? ''));
$phone = sanitizeString(trim((string)($payload['phone'] ?? '')));

if ($firstName === '' && $fullName !== '') {
    $names = preg_split('/\s+/', $fullName, -1, PREG_SPLIT_NO_EMPTY);
    $firstName = sanitizeString($names[0] ?? '');
    $lastName = sanitizeString(implode(' ', array_slice($names, 1)));
}

if ($firstName === '' || $lastName === '' || !$email || $password === '') {
    jsonError('First name, last name, email, and password are required.', 400);
}

if (strlen($password) < 8) {
    jsonError('Password must be at least 8 characters.', 400);
}

try {
    $check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonError('An account with that email already exists.', 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, first_name, last_name, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([$email, $passwordHash, $firstName, $lastName, $phone !== '' ? $phone : null]);
    $userId = (int)$pdo->lastInsertId();

    $_SESSION['user_id'] = $userId;

    jsonResponse([
        'success' => true,
        'user' => [
            'id' => $userId,
            'email' => sanitizeString($email),
            'firstName' => $firstName,
            'lastName' => $lastName,
            'phone' => $phone !== '' ? $phone : null,
            'createdAt' => date('Y-m-d H:i:s'),
            'updatedAt' => date('Y-m-d H:i:s'),
        ],
    ]);
} catch (Exception $e) {
    error_log('Register API Error: ' . $e->getMessage());
    jsonError('Unable to register your account. Please try again later.', 500);
}
