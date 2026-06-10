<?php

class CartService {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * ADD ITEM TO CART
     * - If item exists → increase quantity
     * - Else → insert new row
     */
    public function addToCart($user_id, $product_id, $size, $quantity = 1, $session_id = null) {
        try {

            if ($quantity <= 0) {
                return [
                    'success' => false,
                    'error' => 'Invalid quantity'
                ];
            }

            $this->pdo->beginTransaction();

            // Check if item already exists in cart
            $stmt = $this->pdo->prepare("
                SELECT id, quantity
                FROM cart
                WHERE product_id = ?
                AND size = ?
                AND (
                    (user_id IS NOT NULL AND user_id = ?)
                    OR
                    (session_id IS NOT NULL AND session_id = ?)
                )
                LIMIT 1
            ");

            $stmt->execute([
                $product_id,
                $size,
                $user_id,
                $session_id
            ]);

            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existing) {
                // Update quantity
                $stmt = $this->pdo->prepare("
                    UPDATE cart
                    SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");

                $stmt->execute([$quantity, $existing['id']]);

            } else {
                // Insert new item
                $stmt = $this->pdo->prepare("
                    INSERT INTO cart (user_id, session_id, product_id, size, quantity)
                    VALUES (?, ?, ?, ?, ?)
                ");

                $stmt->execute([
                    $user_id,
                    $session_id,
                    $product_id,
                    $size,
                    $quantity
                ]);
            }

            $this->pdo->commit();

            return [
                'success' => true,
                'message' => 'Item added to cart'
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
     * GET CART ITEMS
     */
    public function getCart($user_id = null, $session_id = null) {
        try {

            $stmt = $this->pdo->prepare("
                SELECT 
                    c.id,
                    c.product_id,
                    c.size,
                    c.quantity,
                    p.name,
                    p.price,
                    p.sale_price,
                    p.image_url
                FROM cart c
                JOIN products p ON p.id = c.product_id
                WHERE 
                    (c.user_id IS NOT NULL AND c.user_id = ?)
                    OR
                    (c.session_id IS NOT NULL AND c.session_id = ?)
            ");

            $stmt->execute([$user_id, $session_id]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $total = 0;

            foreach ($items as &$item) {
                $price = $item['sale_price'] ?? $item['price'];
                $item['line_total'] = $price * $item['quantity'];
                $total += $item['line_total'];
            }

            return [
                'success' => true,
                'items' => $items,
                'total' => $total
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * REMOVE ITEM FROM CART
     */
    public function removeFromCart($cart_id) {
        try {

            $stmt = $this->pdo->prepare("
                DELETE FROM cart WHERE id = ?
            ");

            $stmt->execute([$cart_id]);

            return [
                'success' => true,
                'message' => 'Item removed'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * CLEAR CART (after order placement)
     */
    public function clearCart($user_id = null, $session_id = null) {
        try {

            $stmt = $this->pdo->prepare("
                DELETE FROM cart
                WHERE 
                    (user_id IS NOT NULL AND user_id = ?)
                    OR
                    (session_id IS NOT NULL AND session_id = ?)
            ");

            $stmt->execute([$user_id, $session_id]);

            return [
                'success' => true,
                'message' => 'Cart cleared'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}