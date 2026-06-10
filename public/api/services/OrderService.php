<?php

class OrderService {
    private $pdo;
    private $inventoryService;
    private $cartService;

    public function __construct(PDO $pdo, InventoryService $inventoryService, CartService $cartService) {
        $this->pdo = $pdo;
        $this->inventoryService = $inventoryService;
        $this->cartService = $cartService;

        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * CREATE ORDER FROM CART
     */
    public function createOrder($user_id, $customerData, $payment_method = 'cod', $store_id = 1) {
        try {

            // 1. Get cart
            $cart = $this->cartService->getCart($user_id, null);

            if (!$cart['success'] || empty($cart['items'])) {
                return [
                    'success' => false,
                    'error' => 'Cart is empty'
                ];
            }

            $items = $cart['items'];

            $this->pdo->beginTransaction();

            // 2. Create order number
            $order_number = 'ORD-' . time() . rand(1000, 9999);

            $subtotal = 0;

            foreach ($items as $item) {
                $price = $item['sale_price'] ?? $item['price'];
                $subtotal += $price * $item['quantity'];
            }

            $shipping = 0;
            $tax = 0;
            $total = $subtotal + $shipping + $tax;

            // 3. Insert order
            $stmt = $this->pdo->prepare("
                INSERT INTO orders (
                    order_number,
                    user_id,
                    customer_name,
                    customer_email,
                    phone,
                    address_line1,
                    city,
                    state,
                    pincode,
                    payment_method,
                    subtotal,
                    shipping,
                    tax,
                    total_amount,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            ");

            $stmt->execute([
                $order_number,
                $user_id,
                $customerData['name'],
                $customerData['email'] ?? null,
                $customerData['phone'] ?? null,
                $customerData['address_line1'] ?? null,
                $customerData['city'] ?? null,
                $customerData['state'] ?? null,
                $customerData['pincode'] ?? null,
                $payment_method,
                $subtotal,
                $shipping,
                $tax,
                $total
            ]);

            $order_id = $this->pdo->lastInsertId();

            // 4. Insert order items + deduct stock
            foreach ($items as $item) {

                $price = $item['sale_price'] ?? $item['price'];

                // STOCK DEDUCTION (MVP SIMPLE RULE)
                $stockCheck = $this->inventoryService->deductStock(
                    $item['product_id'],
                    $store_id,
                    $item['size'],
                    $item['quantity']
                );

                if (!$stockCheck['success']) {
                    $this->pdo->rollBack();
                    return [
                        'success' => false,
                        'error' => 'Stock issue: ' . $stockCheck['error']
                    ];
                }

                // Insert order item
                $stmt = $this->pdo->prepare("
                    INSERT INTO order_items (
                        order_id,
                        product_id,
                        product_name,
                        size,
                        price,
                        quantity
                    ) VALUES (?, ?, ?, ?, ?, ?)
                ");

                $stmt->execute([
                    $order_id,
                    $item['product_id'],
                    $item['name'],
                    $item['size'],
                    $price,
                    $item['quantity']
                ]);
            }

            // 5. Clear cart
            $this->cartService->clearCart($user_id, null);

            $this->pdo->commit();

            return [
                'success' => true,
                'order_id' => $order_id,
                'order_number' => $order_number,
                'total' => $total
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
     * GET ORDER DETAILS
     */
    public function getOrder($order_id) {
        try {

            $stmt = $this->pdo->prepare("
                SELECT * FROM orders WHERE id = ?
            ");
            $stmt->execute([$order_id]);
            $order = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$order) {
                return [
                    'success' => false,
                    'error' => 'Order not found'
                ];
            }

            $stmt = $this->pdo->prepare("
                SELECT * FROM order_items WHERE order_id = ?
            ");
            $stmt->execute([$order_id]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'order' => $order,
                'items' => $items
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}