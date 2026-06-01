<?php

require_once __DIR__ . '/Product.php';

class Cart
{
    public function __construct()
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }

        if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
    }

    private function keyFor(int $productId, $size = null): string
    {
        $s = ($size === null || $size === '') ? '' : (string)$size;
        return $productId . '|' . $s;
    }

    private function parseKey(string $key): array
    {
        $parts = explode('|', $key, 2);
        return ['product_id' => (int)$parts[0], 'size' => $parts[1] ?? ''];
    }

    public function add(int $productId, int $quantity = 1, $size = null): void
    {
        $productId = (int) $productId;
        $quantity = max(1, (int) $quantity);
        $key = $this->keyFor($productId, $size);

        if (isset($_SESSION['cart'][$key])) {
            $_SESSION['cart'][$key] += $quantity;
        } else {
            $_SESSION['cart'][$key] = $quantity;
        }
    }

    public function remove(int $productId, $size = null): void
    {
        $key = $this->keyFor($productId, $size);
        if (isset($_SESSION['cart'][$key])) {
            unset($_SESSION['cart'][$key]);
        }
    }

    public function update(int $productId, int $quantity, $size = null): void
    {
        $key = $this->keyFor($productId, $size);
        $quantity = (int) $quantity;

        if ($quantity < 1) {
            $this->remove($productId, $size);
            return;
        }

        $_SESSION['cart'][$key] = $quantity;
    }

    // Return raw session cart (keys like "productId|size" => qty)
    public function items(): array
    {
        return $_SESSION['cart'] ?? [];
    }

    // Return structured items: array of ['product_id', 'size', 'quantity']
    public function structured(): array
    {
        $out = [];
        foreach ($this->items() as $key => $qty) {
            $p = $this->parseKey($key);
            $out[] = ['product_id' => $p['product_id'], 'size' => $p['size'] === '' ? null : $p['size'], 'quantity' => (int)$qty];
        }
        return $out;
    }

    public function total(PDO $pdo): float
    {
        $total = 0.0;

        foreach ($this->structured() as $it) {
            $product = Product::find($pdo, $it['product_id']);
            if (!$product) continue;
            $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : ($product['price'] ?? 0);
            $total += $price * (int) $it['quantity'];
        }

        return $total;
    }
}
