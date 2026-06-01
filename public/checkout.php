<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../app/Product.php';
require_once __DIR__ . '/../app/Cart.php';

$cart = new Cart();

$items = $cart->structured();

if (empty($items)) {
    $_SESSION['flash'] = ['type' => 'error', 'message' => 'Your cart is empty. Add items before checking out.'];
    header('Location: cart.php');
    exit;
}

// Calculate totals
$grand = 0;
$rows = [];
foreach ($items as $it) {
    $product = Product::find($pdo, $it['product_id']);
    if (!$product) continue;
    $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : ($product['price'] ?? 0);
    $subtotal = $price * $it['quantity'];
    $grand += $subtotal;
    $rows[] = ['product' => $product, 'qty' => $it['quantity'], 'price' => $price, 'subtotal' => $subtotal, 'size' => $it['size']];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Checkout - Shoebox</title>
    <style>
        body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;background:#f8f8f8;color:#333}
        .wrap{max-width:900px;margin:30px auto;padding:20px;background:#fff;border:1px solid #e5e5e5;border-radius:6px}
        h1{font-size:20px;margin-bottom:12px}
        .two-col{display:grid;grid-template-columns:1fr 360px;gap:24px}
        table{width:100%;border-collapse:collapse;margin-bottom:12px}
        th,td{padding:8px;border-bottom:1px solid #eee;text-align:left}
        .total{font-weight:700;font-size:18px}
        label{display:block;margin-bottom:8px;font-size:13px}
        input[type=text], input[type=tel], textarea, select{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;margin-bottom:12px}
        button.btn{padding:12px 16px;background:#000;color:#fff;border:none;border-radius:4px;cursor:pointer}
        a.back{display:inline-block;margin-bottom:12px;color:#666;text-decoration:none}
    </style>
</head>
<body>
    <div class="wrap">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <a href="cart.php" class="back">← Back to cart</a>
            <a href="cart.php" style="text-decoration:none;color:#000;display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px">🛒</span>
                <span style="font-size:13px;color:#666">Cart</span>
                <span style="background:#000;color:#fff;padding:4px 8px;border-radius:12px;font-size:12px;"> <?= isset($_SESSION['cart']) ? array_sum($_SESSION['cart']) : 0 ?> </span>
            </a>
        </div>
        <h1>Checkout</h1>
        <div class="two-col">
            <div>
                <form action="place-order.php" method="post">
                    <label for="name">Full name</label>
                    <input type="text" id="name" name="name" required>

                    <label for="phone">Phone number</label>
                    <input type="tel" id="phone" name="phone" required>

                    <label for="address">Delivery address</label>
                    <textarea id="address" name="address" rows="4" required></textarea>

                    <label for="payment">Payment method</label>
                    <select id="payment" name="payment" required>
                        <option value="cod">Cash on Delivery (COD)</option>
                    </select>

                    <button type="submit" class="btn">Place Order</button>
                </form>
            </div>

            <aside>
                <h2 style="font-size:16px;margin-bottom:8px">Order Summary</h2>
                <table>
                    <thead><tr><th>Product</th><th>Qty</th><th>Subtotal</th></tr></thead>
                    <tbody>
                        <?php foreach ($rows as $r): ?>
                            <tr>
                                <td style="width:70%"><?= htmlspecialchars($r['product']['name']) ?><?= isset($r['size']) && $r['size'] ? ' — Size: ' . htmlspecialchars($r['size']) : '' ?></td>
                                <td style="width:10%"><?= (int)$r['qty'] ?></td>
                                <td style="width:20%">₹<?= number_format($r['subtotal'], 0) ?></td>
                            </tr>
                        <?php endforeach; ?>
                        <tr>
                            <td colspan="2" class="total">Total</td>
                            <td class="total">₹<?= number_format($grand, 0) ?></td>
                        </tr>
                    </tbody>
                </table>
            </aside>
        </div>
    </div>
</body>
</html>