<?php
/**
 * Security utilities for Shoebox API
 * Provides input validation, sanitization, and security functions
 */

// Rate limiting configuration
define('RATE_LIMIT_REQUESTS', 100);
define('RATE_LIMIT_WINDOW', 3600); // 1 hour in seconds

/**
 * Check rate limiting by IP address
 */
function checkRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $timestamp = time();
    
    if (!isset($_SESSION['rate_limits'])) {
        $_SESSION['rate_limits'] = [];
    }
    
    if (!isset($_SESSION['rate_limits'][$ip])) {
        $_SESSION['rate_limits'][$ip] = ['requests' => 0, 'window_start' => $timestamp];
    }
    
    $limit_data = &$_SESSION['rate_limits'][$ip];
    
    // Reset window if expired
    if ($timestamp - $limit_data['window_start'] > RATE_LIMIT_WINDOW) {
        $limit_data = ['requests' => 0, 'window_start' => $timestamp];
    }
    
    if ($limit_data['requests'] >= RATE_LIMIT_REQUESTS) {
        http_response_code(429);
        echo json_encode(['error' => 'Rate limit exceeded. Please try again later.']);
        exit;
    }
    
    $limit_data['requests']++;
}

/**
 * Sanitize string input
 */
function sanitizeString($input) {
    if (!is_string($input)) {
        return '';
    }
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate integer
 */
function validateInteger($value) {
    return filter_var($value, FILTER_VALIDATE_INT) !== false;
}

/**
 * Validate decimal
 */
function validateDecimal($value) {
    return is_numeric($value) && (float)$value >= 0;
}

/**
 * Get validated integer from GET/POST
 */
function getValidatedInt($key, $default = null) {
    $value = $_GET[$key] ?? $_POST[$key] ?? $default;
    if ($value === null) return null;
    if (!validateInteger($value)) {
        throw new Exception("Invalid value for $key");
    }
    return (int)$value;
}

/**
 * Get validated string from GET/POST with length limit
 */
function getValidatedString($key, $default = '', $maxLength = 255) {
    $value = $_GET[$key] ?? $_POST[$key] ?? $default;
    if (strlen($value) > $maxLength) {
        throw new Exception("$key exceeds maximum length");
    }
    return sanitizeString($value);
}

/**
 * Verify CSRF token (for POST requests)
 */
function verifyCsrfToken() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'])) {
            http_response_code(403);
            echo json_encode(['error' => 'CSRF token validation failed']);
            exit;
        }
    }
}

/**
 * Generate CSRF token
 */
function generateCsrfToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Log API request for security auditing
 */
function logApiRequest($action, $entityType, $entityId = null, $details = null) {
    global $pdo;
    
    try {
        $userId = $_SESSION['user_id'] ?? null;
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        
        $stmt = $pdo->prepare('
            INSERT INTO activity_logs (user_id, action, entity_type, entity_id, ip_address, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        ');
        
        $stmt->execute([$userId, $action, $entityType, $entityId, $ipAddress]);
    } catch (Exception $e) {
        error_log('Failed to log API request: ' . $e->getMessage());
    }
}

/**
 * Set security headers
 */
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'');
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

/**
 * Handle CORS preflight
 */
function handleCorsPreFlight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setSecurityHeaders();
        http_response_code(200);
        exit;
    }
}

/**
 * JSON response helper
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Error response
 */
function jsonError($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}

/**
 * Validate pagination parameters
 */
function getPaginationParams() {
    $page = getValidatedInt('page', 1);
    $limit = getValidatedInt('limit', 12);
    
    // Ensure reasonable limits
    if ($page < 1) $page = 1;
    if ($limit < 1) $limit = 12;
    if ($limit > 100) $limit = 100;
    
    return [
        'page' => $page,
        'limit' => $limit,
        'offset' => ($page - 1) * $limit
    ];
}
