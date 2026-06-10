<?php

class InventoryService {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * CHECK stock availability (before cart / checkout)
     */
    public function checkStock($product_id, $store_id, $size, $quantity) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT stock
                FROM inventory
                WHERE product_id = ? AND store_id = ? AND size = ?
            ");
            $stmt->execute([$product_id, $store_id, $size]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return [
                    'success' => false,
                    'error' => 'Inventory not found'
                ];
            }

            if ($row['stock'] < $quantity) {
                return [
                    'success' => false,
                    'error' => 'Insufficient stock',
                    'available' => $row['stock']
                ];
            }

            return [
                'success' => true,
                'available' => $row['stock']
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * DEDUCT stock AFTER successful order/payment
     * (THIS IS YOUR ONLY WRITE OPERATION IN MVP)
     */
    public function deductStock($product_id, $store_id, $size, $quantity) {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                UPDATE inventory
                SET stock = stock - ?
                WHERE product_id = ?
                  AND store_id = ?
                  AND size = ?
                  AND stock >= ?
            ");

            $stmt->execute([
                $quantity,
                $product_id,
                $store_id,
                $size,
                $quantity
            ]);

            if ($stmt->rowCount() === 0) {
                $this->pdo->rollBack();

                return [
                    'success' => false,
                    'error' => 'Stock deduction failed (race condition or insufficient stock)'
                ];
            }

            $this->pdo->commit();

            return [
                'success' => true,
                'message' => 'Stock deducted successfully'
            ];

        } catch (Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * GET current stock (for UI display)
     */
    public function getStock($product_id, $store_id, $size) {
        try {
            $stmt = $this->pdo->prepare("
                SELECT stock
                FROM inventory
                WHERE product_id = ? AND store_id = ? AND size = ?
            ");
            $stmt->execute([$product_id, $store_id, $size]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return [
                    'success' => false,
                    'error' => 'Inventory not found'
                ];
            }

            return [
                'success' => true,
                'stock' => (int)$row['stock']
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}