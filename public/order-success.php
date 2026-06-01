<?php
session_start();
$orderNumber = $_SESSION['last_order_number'] ?? null;
// Remove it so refresh won't show again
if (isset($_SESSION['last_order_number'])) unset($_SESSION['last_order_number']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Order Confirmed - Shoebox</title>
    <style>
        body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;background:#f8f8f8;color:#333}
        .wrap{max-width:800px;margin:60px auto;padding:24px;background:#fff;border:1px solid #e5e5e5;border-radius:6px;text-align:center}
        .order-no{font-size:20px;font-weight:700;margin:12px 0}
        a.btn{display:inline-block;margin-top:16px;padding:12px 16px;background:#000;color:#fff;border-radius:4px;text-decoration:none}
    </style>
</head>
<body>
    <div class="wrap">
        <div style="display:flex;justify-content:flex-end;align-items:center;margin-bottom:12px;">
            <a href="cart.php" style="text-decoration:none;color:#000;display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px">🛒</span>
                <span style="font-size:13px;color:#666">Cart</span>
            </a>
        </div>
        <?php if ($orderNumber): ?>
            <h1>Thank you — your order is confirmed</h1>
            <div class="order-no">Order number: <?= htmlspecialchars($orderNumber) ?></div>
            <p>We have received your order and will contact you with shipping details shortly.</p>
            <a class="btn" href="shop.php">Continue shopping</a>
        <?php else: ?>
            <h1>Order not found</h1>
            <p>We couldn't find your order. If you just placed an order, try refreshing this page. Otherwise contact support.</p>
            <a class="btn" href="shop.php">Back to shop</a>
        <?php endif; ?>
    </div>
</body>
</html>