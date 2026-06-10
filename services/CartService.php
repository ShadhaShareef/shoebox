<?php
declare(strict_types=1);

if (!function_exists('shoebox_get_pdo')) {
    function shoebox_get_pdo(): PDO
    {
        static $pdo = null;

        if ($pdo instanceof PDO) {
            return $pdo;
        }

        $candidates = [
            __DIR__ . '/../config/database.php',
            __DIR__ . '/../config/db.php',
            __DIR__ . '/../config/connection.php',
            __DIR__ . '/../includes/database.php',
            __DIR__ . '/../includes/db.php',
            __DIR__ . '/../db.php',
            __DIR__ . '/../config.php',
            __DIR__ . '/../database.php',
        ];

        foreach ($candidates as $file) {
            if (!is_file($file)) {
                continue;
            }

            $result = (static function (string $path) {
                $pdo = null;
                $conn = null;
                $db = null;
                $database = null;
                $link = null;

                $returned = require $path;

                foreach ([$returned, $pdo, $conn, $db, $database, $link] as $candidate) {
                    if ($candidate instanceof PDO) {
                        return $candidate;
                    }
                }

                return null;
            })($file);

            if ($result instanceof PDO) {
                $result->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $result->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                $pdo = $result;
                return $pdo;
            }
        }

        throw new RuntimeException('Database connection not found.');
    }
}

if (!function_exists('shoebox_start_session')) {
    function shoebox_start_session(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
    }
}

if (!function_exists('shoebox_current_user_id')) {
    function shoebox_current_user_id(): ?int
    {
        shoebox_start_session();

        $candidates = [
            $_SESSION['user_id'] ?? null,
            $_SESSION['user']['id'] ?? null,
            $_SESSION['auth']['user_id'] ?? null,
            $_SESSION['account']['id'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            if (is_numeric($candidate) && (int) $candidate > 0) {
                return (int) $candidate;
            }
        }

        return null;
    }
}

if (!function_exists('shoebox_request_data')) {
    function shoebox_request_data(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';

        if (stripos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input');
            $decoded = json_decode((string) $raw, true);

            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return $_POST;
    }
}

if (!function_exists('shoebox_json_response')) {
    function shoebox_json_response(array $payload, int $statusCode = 200): void
    {
        if (!headers_sent()) {
            http_response_code($statusCode);
            header('Content-Type: application/json; charset=utf-8');
        }

        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

class CartService
{
    private PDO $pdo;

    /** @var array<string, array<int, string>> */
    private array $columnCache = [];

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    }

    public function addItem(int $productId, string $size, int $quantity, ?int $userId = null, ?string $sessionId = null): array
    {
        $size = trim($size);

        if ($productId <= 0) {
            return ['success' => false, 'message' => 'Invalid product'];
        }

        if ($size === '') {
            return ['success' => false, 'message' => 'Size is required'];
        }

        if ($quantity <= 0) {
            return ['success' => false, 'message' => 'Quantity must be at least 1'];
        }

        $product = $this->findProduct($productId);
        if ($product === null) {
            return ['success' => false, 'message' => 'Product not found'];
        }

        $stock = $this->getInventoryStock($productId);
        if ($stock <= 0) {
            return ['success' => false, 'message' => 'Product is out of stock'];
        }

        $existing = $this->findCartItem($productId, $size, $userId, $sessionId);
        $currentQuantity = $existing ? (int) $existing['quantity'] : 0;
        $newQuantity = $currentQuantity + $quantity;

        if ($newQuantity > $stock) {
            return ['success' => false, 'message' => 'Requested quantity exceeds available stock'];
        }

        if ($existing) {
            $sql = 'UPDATE cart SET quantity = :quantity';
            $params = [':quantity' => $newQuantity, ':cart_id' => (int) $existing['id']];
            $updatedAtColumn = $this->findColumn('cart', ['updated_at', 'modified_at']);
            if ($updatedAtColumn !== null) {
                $sql .= ', ' . $updatedAtColumn . ' = NOW()';
            }
            $sql .= ' WHERE ' . $this->getCartIdColumn() . ' = :cart_id';

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            return [
                'success' => true,
                'message' => 'Cart updated',
                'cart_item_id' => (int) $existing['id'],
                'quantity' => $newQuantity,
            ];
        }

        $cartColumns = $this->getCartColumns();
        $fields = [];
        $placeholders = [];
        $params = [];

        $fieldMap = [
            'user_id' => $userId,
            'session_id' => $sessionId,
            'product_id' => $productId,
            'size' => $size,
            'quantity' => $quantity,
        ];

        foreach ($fieldMap as $logical => $value) {
            $column = $this->findColumn('cart', [$logical, $logical === 'quantity' ? 'qty' : $logical]);
            if ($column !== null && in_array($column, $cartColumns, true) && $value !== null) {
                $fields[] = $column;
                $placeholder = ':' . $column;
                $placeholders[] = $placeholder;
                $params[$placeholder] = $value;
            }
        }

        $createdAtColumn = $this->findColumn('cart', ['created_at', 'date_created']);
        if ($createdAtColumn !== null && in_array($createdAtColumn, $cartColumns, true)) {
            $fields[] = $createdAtColumn;
            $placeholders[] = 'NOW()';
        }

        if ($userId !== null && $this->findColumn('cart', ['user_id', 'customer_id']) === null) {
            return ['success' => false, 'message' => 'Cart schema is missing user ownership columns'];
        }

        if ($sessionId !== null && $this->findColumn('cart', ['session_id']) === null) {
            return ['success' => false, 'message' => 'Cart schema is missing session ownership columns'];
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'Cart schema is not supported'];
        }

        $sql = 'INSERT INTO cart (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $placeholders) . ')';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);

        return [
            'success' => true,
            'message' => 'Added to cart',
            'cart_item_id' => (int) $this->pdo->lastInsertId(),
            'quantity' => $quantity,
        ];
    }

    public function getCart(?int $userId = null, ?string $sessionId = null): array
    {
        $owner = $this->buildOwnerWhereClause($userId, $sessionId);

        $cartIdColumn = $this->getCartIdColumn();
        $cartProductIdColumn = $this->getCartColumn('product_id', ['product_id']);
        $cartSizeColumn = $this->getCartColumn('size', ['size', 'product_size']);
        $cartQuantityColumn = $this->getCartColumn('quantity', ['quantity', 'qty']);
        $cartUserColumn = $this->getCartColumn('user_id', ['user_id', 'customer_id']);
        $cartSessionColumn = $this->getCartColumn('session_id', ['session_id']);
        $cartCreatedAtColumn = $this->findColumn('cart', ['created_at', 'date_created']);

        $productNameColumn = $this->getProductColumn('name', ['name', 'title', 'product_name']);
        $productImageColumn = $this->getProductColumn('image', ['image', 'image_url', 'thumbnail', 'photo']);
        $productPriceColumn = $this->getProductColumn('price', ['price', 'sale_price', 'regular_price']);

        $select = [
            'c.' . $cartIdColumn . ' AS cart_item_id',
            'c.' . $cartProductIdColumn . ' AS product_id',
            'c.' . $cartSizeColumn . ' AS size',
            'c.' . $cartQuantityColumn . ' AS quantity',
        ];

        if ($cartUserColumn !== null) {
            $select[] = 'c.' . $cartUserColumn . ' AS user_id';
        }

        if ($cartSessionColumn !== null) {
            $select[] = 'c.' . $cartSessionColumn . ' AS session_id';
        }

        if ($cartCreatedAtColumn !== null) {
            $select[] = 'c.' . $cartCreatedAtColumn . ' AS created_at';
        }

        $select[] = 'p.' . $productNameColumn . ' AS product_name';
        $select[] = 'p.' . $productImageColumn . ' AS product_image';
        $select[] = 'p.' . $productPriceColumn . ' AS unit_price';

        $sql = 'SELECT ' . implode(', ', $select) . '
                FROM cart c
                INNER JOIN products p ON p.id = c.' . $cartProductIdColumn . '
                WHERE ' . $owner['sql'] . '
                ORDER BY c.' . $cartIdColumn . ' DESC';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($owner['params']);
        $rows = $stmt->fetchAll();

        $items = [];
        $subtotal = 0.0;
        $itemCount = 0;

        foreach ($rows as $row) {
            $unitPrice = (float) $row['unit_price'];
            $quantity = (int) $row['quantity'];
            $lineTotal = $unitPrice * $quantity;

            $subtotal += $lineTotal;
            $itemCount += $quantity;

            $items[] = [
                'cart_item_id' => (int) $row['cart_item_id'],
                'product_id' => (int) $row['product_id'],
                'product_name' => (string) $row['product_name'],
                'product_image' => $row['product_image'] ?? '',
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'size' => (string) ($row['size'] ?? ''),
                'subtotal' => $lineTotal,
                'created_at' => $row['created_at'] ?? null,
            ];
        }

        return [
            'success' => true,
            'message' => 'Cart retrieved',
            'items' => $items,
            'subtotal' => $subtotal,
            'item_count' => $itemCount,
        ];
    }

    public function removeItem(int $cartItemId, ?int $userId = null, ?string $sessionId = null): array
    {
        if ($cartItemId <= 0) {
            return ['success' => false, 'message' => 'Invalid cart item'];
        }

        $item = $this->findCartItemById($cartItemId, $userId, $sessionId);
        if ($item === null) {
            return ['success' => false, 'message' => 'Cart item not found'];
        }

        $stmt = $this->pdo->prepare(
            'DELETE FROM cart WHERE ' . $this->getCartIdColumn() . ' = :cart_id'
        );
        $stmt->execute([':cart_id' => $cartItemId]);

        return ['success' => true, 'message' => 'Item removed from cart'];
    }

    public function updateQuantity(int $cartItemId, int $quantity, ?int $userId = null, ?string $sessionId = null): array
    {
        if ($cartItemId <= 0) {
            return ['success' => false, 'message' => 'Invalid cart item'];
        }

        $item = $this->findCartItemById($cartItemId, $userId, $sessionId);
        if ($item === null) {
            return ['success' => false, 'message' => 'Cart item not found'];
        }

        if ($quantity <= 0) {
            return $this->removeItem($cartItemId, $userId, $sessionId);
        }

        $stock = $this->getInventoryStock((int) $item['product_id']);
        if ($quantity > $stock) {
            return ['success' => false, 'message' => 'Requested quantity exceeds available stock'];
        }

        $sql = 'UPDATE cart SET ' . $this->getCartQuantityColumn() . ' = :quantity';
        $updatedAtColumn = $this->findColumn('cart', ['updated_at', 'modified_at']);
        if ($updatedAtColumn !== null) {
            $sql .= ', ' . $updatedAtColumn . ' = NOW()';
        }
        $sql .= ' WHERE ' . $this->getCartIdColumn() . ' = :cart_id';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':quantity' => $quantity,
            ':cart_id' => $cartItemId,
        ]);

        return [
            'success' => true,
            'message' => 'Cart updated',
            'quantity' => $quantity,
        ];
    }

    public function clearCart(?int $userId = null, ?string $sessionId = null): array
    {
        $owner = $this->buildOwnerWhereClause($userId, $sessionId);

        $stmt = $this->pdo->prepare('DELETE FROM cart WHERE ' . $owner['sql']);
        $stmt->execute($owner['params']);

        return ['success' => true, 'message' => 'Cart cleared'];
    }

    private function findProduct(int $productId): ?array
    {
        $nameColumn = $this->getProductColumn('name', ['name', 'title', 'product_name']);
        $imageColumn = $this->getProductColumn('image', ['image', 'image_url', 'thumbnail', 'photo']);
        $priceColumn = $this->getProductColumn('price', ['price', 'sale_price', 'regular_price']);

        $sql = 'SELECT id, ' . $nameColumn . ' AS product_name, ' . $imageColumn . ' AS product_image, ' . $priceColumn . ' AS unit_price
                FROM products
                WHERE id = :product_id
                LIMIT 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':product_id' => $productId]);
        $product = $stmt->fetch();

        return $product ?: null;
    }

    private function getInventoryStock(int $productId): int
    {
        $stockColumn = $this->findColumn('inventory', [
            'stock',
            'quantity',
            'qty',
            'available_quantity',
            'available_stock',
            'inventory_qty',
            'on_hand',
        ]);

        if ($stockColumn === null) {
            return 0;
        }

        $stmt = $this->pdo->prepare(
            'SELECT ' . $stockColumn . ' AS stock_value
             FROM inventory
             WHERE product_id = :product_id AND store_id = 1
             LIMIT 1'
        );
        $stmt->execute([':product_id' => $productId]);
        $row = $stmt->fetch();

        if (!$row) {
            return 0;
        }

        return (int) $row['stock_value'];
    }

    private function findCartItem(int $productId, string $size, ?int $userId, ?string $sessionId): ?array
    {
        $owner = $this->buildOwnerWhereClause($userId, $sessionId);
        $productColumn = $this->getCartProductColumn();
        $sizeColumn = $this->getCartSizeColumn();

        $sql = 'SELECT * FROM cart
                WHERE ' . $owner['sql'] . '
                AND ' . $productColumn . ' = :product_id
                AND ' . $sizeColumn . ' = :size
                LIMIT 1';

        $params = $owner['params'] + [
            ':product_id' => $productId,
            ':size' => $size,
        ];

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    private function findCartItemById(int $cartItemId, ?int $userId, ?string $sessionId): ?array
    {
        $owner = $this->buildOwnerWhereClause($userId, $sessionId);
        $sql = 'SELECT * FROM cart WHERE ' . $this->getCartIdColumn() . ' = :cart_id AND ' . $owner['sql'] . ' LIMIT 1';

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($owner['params'] + [':cart_id' => $cartItemId]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    private function buildOwnerWhereClause(?int $userId, ?string $sessionId): array
    {
        $userColumn = $this->findColumn('cart', ['user_id', 'customer_id']);
        $sessionColumn = $this->findColumn('cart', ['session_id']);

        if ($userId !== null && $userColumn !== null) {
            return [
                'sql' => 'c_owner.' . $userColumn . ' = :user_id',
                'params' => [':user_id' => $userId],
            ];
        }

        if ($userId !== null && $userColumn !== null) {
            return [
                'sql' => $userColumn . ' = :user_id',
                'params' => [':user_id' => $userId],
            ];
        }

        $sessionId = $sessionId ?? session_id();
        if ($sessionColumn !== null) {
            return [
                'sql' => $sessionColumn . ' = :session_id',
                'params' => [':session_id' => $sessionId],
            ];
        }

        throw new RuntimeException('Cart schema does not contain a supported ownership column.');
    }

    private function getCartColumns(): array
    {
        return $this->getTableColumns('cart');
    }

    private function getCartIdColumn(): string
    {
        return $this->getCartColumn('id', ['id', 'cart_id']);
    }

    private function getCartProductColumn(): string
    {
        return $this->getCartColumn('product_id', ['product_id']);
    }

    private function getCartSizeColumn(): string
    {
        return $this->getCartColumn('size', ['size', 'product_size']);
    }

    private function getCartQuantityColumn(): string
    {
        return $this->getCartColumn('quantity', ['quantity', 'qty']);
    }

    private function getCartColumn(string $logicalName, array $candidates): string
    {
        $column = $this->findColumn('cart', $candidates);

        if ($column === null) {
            throw new RuntimeException('Cart schema is missing required column: ' . $logicalName);
        }

        return $column;
    }

    private function getProductColumn(string $logicalName, array $candidates): string
    {
        $column = $this->findColumn('products', $candidates);

        if ($column === null) {
            throw new RuntimeException('Products schema is missing required column: ' . $logicalName);
        }

        return $column;
    }

    private function findColumn(string $table, array $candidates): ?string
    {
        $columns = $this->getTableColumns($table);
        $lowerMap = [];

        foreach ($columns as $column) {
            $lowerMap[strtolower($column)] = $column;
        }

        foreach ($candidates as $candidate) {
            $key = strtolower($candidate);
            if (isset($lowerMap[$key])) {
                return $lowerMap[$key];
            }
        }

        return null;
    }

    /**
     * @return array<int, string>
     */
    private function getTableColumns(string $table): array
    {
        if (isset($this->columnCache[$table])) {
            return $this->columnCache[$table];
        }

        $stmt = $this->pdo->query('SHOW COLUMNS FROM ' . $table);
        $columns = [];

        foreach ($stmt->fetchAll() as $row) {
            if (isset($row['Field'])) {
                $columns[] = $row['Field'];
            }
        }

        $this->columnCache[$table] = $columns;

        return $columns;
    }
}
