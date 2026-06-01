<?php

class Inventory
{
    // Simple store map (placeholder)
    public static $STORES = [
        1 => 'Thrissur',
        2 => 'Kochi',
        3 => 'Kozhikode',
    ];

    // Return list of stores
    public static function getStores(): array
    {
        return self::$STORES;
    }

    // Placeholder nearest store resolver
    public static function getNearestStore(): array
    {
        // For now, always return Thrissur
        return ['id' => 1, 'name' => self::$STORES[1]];
    }

    // Get stock quantity for product at a store (size optional)
    public static function getStock(PDO $pdo, int $productId, int $storeId, $size = null): int
    {
        try {
            if ($size !== null) {
                $stmt = $pdo->prepare('SELECT stock FROM inventory WHERE product_id = ? AND store_id = ? AND size = ? LIMIT 1');
                $stmt->execute([$productId, $storeId, $size]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if (!$row) return 0;
                return (int) $row['stock'];
            }

            $stmt = $pdo->prepare('SELECT SUM(stock) AS total_stock FROM inventory WHERE product_id = ? AND store_id = ?');
            $stmt->execute([$productId, $storeId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) return 0;
            return (int) ($row['total_stock'] ?? 0);
        } catch (Exception $e) {
            return 0;
        }
    }

    // Reduce stock when an order is placed. Returns true on success.
    public static function reduceStock(PDO $pdo, int $productId, int $storeId, int $quantity = 1, $size = null): bool
    {
        try {
            // Start a transaction for this update to avoid race conditions if we're not already in one
            $startedTransaction = false;
            if (!$pdo->inTransaction()) {
                $pdo->beginTransaction();
                $startedTransaction = true;
            }

            if ($size !== null) {
                $stmt = $pdo->prepare('SELECT stock FROM inventory WHERE product_id = ? AND store_id = ? AND size = ? FOR UPDATE');
                $stmt->execute([$productId, $storeId, $size]);
            } else {
                $stmt = $pdo->prepare('SELECT SUM(stock) AS total_stock FROM inventory WHERE product_id = ? AND store_id = ? FOR UPDATE');
                $stmt->execute([$productId, $storeId]);
            }

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                // No inventory row
                if ($startedTransaction) {
                    $pdo->rollBack();
                }
                return false;
            }

            $current = $size !== null ? (int) $row['stock'] : (int) ($row['total_stock'] ?? 0);
            if ($current < $quantity) {
                if ($startedTransaction) {
                    $pdo->rollBack();
                }
                return false;
            }

            // Perform update
            if ($size !== null) {
                $upd = $pdo->prepare('UPDATE inventory SET stock = stock - ? WHERE product_id = ? AND store_id = ? AND size = ?');
                $upd->execute([$quantity, $productId, $storeId, $size]);
            } else {
                $upd = $pdo->prepare('UPDATE inventory SET stock = stock - ? WHERE product_id = ? AND store_id = ?');
                $upd->execute([$quantity, $productId, $storeId]);
            }

            if ($startedTransaction) {
                $pdo->commit();
            }
            return true;
        } catch (Exception $e) {
            try { if ($pdo->inTransaction()) $pdo->rollBack(); } catch (Exception $ex) {}
            return false;
        }
    }
}
