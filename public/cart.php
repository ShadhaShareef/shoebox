<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../app/Product.php';
require_once __DIR__ . '/../app/Cart.php';

$cart = new Cart();

// Handle form actions: update quantity or remove item
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['update_qty'])) {
        $productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
        $quantity = isset($_POST['quantity']) ? max(1, (int)$_POST['quantity']) : 1;
        $size = isset($_POST['size']) ? $_POST['size'] : null;
        if ($productId > 0) {
            $cart->update($productId, $quantity, $size);
        }
    }

    if (isset($_POST['remove_item'])) {
        $productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
        $size = isset($_POST['size']) ? $_POST['size'] : null;
        if ($productId > 0) {
            $cart->remove($productId, $size);
        }
    }

    header('Location: cart.php');
    exit;
}

$items = $cart->structured();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Cart - Shoebox</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background:#f8f8f8; color:#333; }
        .container { max-width: 1000px; margin: 30px auto; padding: 20px; background:#fff; border:1px solid #e5e5e5; border-radius:6px; }
        h1 { font-size: 20px; margin-bottom: 16px; }
        table { width:100%; border-collapse: collapse; }
        th, td { text-align:left; padding: 12px; border-bottom:1px solid #eee; }
        th { font-size:13px; color:#666; }
        .qty-input { width:64px; padding:8px; border:1px solid #ddd; border-radius:4px; }
        .btn { padding:8px 12px; border-radius:4px; border:none; cursor:pointer; }
        .btn-update { background:#000; color:#fff; }
        .btn-remove { background:#fff; color:#000; border:1px solid #ddd; }
        .total-row td { font-weight:700; font-size:16px; }
        .actions { display:flex; gap:8px; }
        .empty { text-align:center; padding:40px 0; color:#999; }
        a.back { display:inline-block; margin-bottom:16px; color:#666; text-decoration:none; }
        a.back:hover { color:#000; }
    </style>
</head>
<body>
    <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <a href="shop.php" class="back">← Continue shopping</a>
            <a href="cart.php" style="text-decoration:none;color:#000;display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px">🛒</span>
                <span style="font-size:13px;color:#666">Cart</span>
            </a>
        </div>
        <?php if (isset($_SESSION['flash'])): ?>
            <div style="padding:12px 16px;background:#e6ffed;border:1px solid #b7f0c6;color:#0a5f2b;border-radius:6px;margin-bottom:12px;">
                <?= htmlspecialchars($_SESSION['flash']['message']) ?>
            </div>
            <?php unset($_SESSION['flash']); ?>
        <?php endif; ?>
        <h1>Your Shopping Cart</h1>

        <?php if (empty($items)): ?>
            <div class="empty">Your cart is empty. Add some great shoes from our shop.</div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php $grand = 0; foreach ($items as $it):
                        $product = Product::find($pdo, $it['product_id']);
                        if (!$product) continue;
                        $qty = $it['quantity'];
                        $size = $it['size'];
                        $price = isset($product['sale_price']) && $product['sale_price'] ? $product['sale_price'] : ($product['price'] ?? 0);
                        $subtotal = $price * $qty;
                        $grand += $subtotal;
                    ?>
                        <tr>
                            <td>
                                <div style="font-weight:600"><?= htmlspecialchars($product['name']) ?></div>
                                <div style="font-size:13px;color:#666"><?= htmlspecialchars($product['brand']) ?> &middot; <?= htmlspecialchars($product['category']) ?></div>
                            </td>
                            <td><?= $size ? htmlspecialchars($size) : '-' ?></td>
                            <td>₹<?= number_format($price, 0) ?></td>
                            <td>
                                <form method="post" style="display:inline-block;">
                                    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                                    <input type="hidden" name="size" value="<?= htmlspecialchars($size) ?>">
                                    <input type="number" name="quantity" class="qty-input" value="<?= $qty ?>" min="1">
                                    <button type="submit" name="update_qty" class="btn btn-update">Update</button>
                                </form>
                            </td>
                            <td>₹<?= number_format($subtotal, 0) ?></td>
                            <td>
                                <form method="post" style="display:inline-block;">
                                    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                                    <input type="hidden" name="size" value="<?= htmlspecialchars($size) ?>">
                                    <button type="submit" name="remove_item" class="btn btn-remove">Remove</button>
                                </form>
                            </td>
                        </tr>
                    <?php endforeach; ?>

                    <tr class="total-row">
                        <td colspan="4">Total</td>
                        <td>₹<?= number_format($grand, 0) ?></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <div style="display:flex;justify-content:flex-end;margin-top:16px;gap:12px;">
                <a href="checkout.php" class="btn" style="background:#111;color:#fff;text-decoration:none;padding:10px 14px;border-radius:4px;">Proceed to Checkout</a>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
