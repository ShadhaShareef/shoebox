<?php
// Ensure session and cart POST handling occur before any output to avoid headers already sent errors
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../app/Product.php';
require_once __DIR__ . '/../app/Cart.php';
require_once __DIR__ . '/../app/Inventory.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Handle Add to Cart POST early to allow redirect without sending output
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_to_cart'])) {
    $post_id = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;
    $quantity = isset($_POST['quantity']) ? max(1, (int)$_POST['quantity']) : 1;
    $size = isset($_POST['size']) && $_POST['size'] !== '' ? $_POST['size'] : null;
    if ($post_id > 0) {
        $cart = new Cart();
        $cart->add($post_id, $quantity, $size);

        $p = Product::find($pdo, $post_id);
        $pname = $p ? $p['name'] : 'Product';
        $msg = "Added {$quantity} × {$pname}";
        if ($size) $msg .= " (Size: " . htmlspecialchars($size) . ")";
        $_SESSION['flash'] = [
            'type' => 'success',
            'message' => $msg . ' to your cart.'
        ];
    }

    header('Location: product.php?id=' . $post_id);
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product - Shoebox | Premium Footwear</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background-color: #f8f8f8;
            color: #333;
        }

        /* Header */
        header {
            background: #fff;
            border-bottom: 1px solid #e5e5e5;
            padding: 16px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #000;
            text-decoration: none;
        }

        .header-right {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .back-link {
            font-size: 14px;
            color: #666;
            text-decoration: none;
            transition: color 0.2s;
        }

        .back-link:hover {
            color: #000;
        }

        /* Breadcrumb */
        .breadcrumb {
            max-width: 1400px;
            margin: 0 auto;
            padding: 12px 20px;
            font-size: 13px;
            color: #999;
        }

        .breadcrumb a {
            color: #666;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            color: #000;
        }

        /* Main Container */
        .product-container {
            max-width: 1400px;
            margin: 30px auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        /* Product Image Section */
        .product-image-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .product-image-main {
            width: 100%;
            aspect-ratio: 1;
            background: linear-gradient(135deg, #f0f0f0 0%, #e5e5e5 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 120px;
            color: #e5e5e5;
            position: relative;
            overflow: hidden;
        }

        .product-image-main::after {
            content: '👟';
            font-size: 140px;
            opacity: 0.2;
        }

        .product-thumbnails {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }

        .thumbnail {
            aspect-ratio: 1;
            background: linear-gradient(135deg, #e8e8e8 0%, #ddd 100%);
            border-radius: 4px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .thumbnail:hover,
        .thumbnail.active {
            border-color: #000;
        }

        /* Product Details Section */
        .product-details {
            display: flex;
            flex-direction: column;
        }

        .product-header {
            margin-bottom: 20px;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 20px;
        }

        .product-brand {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #999;
            margin-bottom: 8px;
        }

        .product-name {
            font-size: 28px;
            font-weight: 700;
            color: #000;
            margin-bottom: 12px;
            line-height: 1.2;
        }

        .product-category {
            font-size: 13px;
            color: #666;
        }

        /* Pricing Section */
        .pricing-section {
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e5e5;
        }

        .price-display {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .price-current {
            font-size: 32px;
            font-weight: 700;
            color: #000;
        }

        .price-original {
            font-size: 18px;
            color: #999;
            text-decoration: line-through;
        }

        .discount-badge {
            background: #f0f0f0;
            color: #666;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .price-note {
            font-size: 13px;
            color: #666;
        }

        /* Rating & Reviews */
        .rating-section {
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .rating-stars {
            font-size: 16px;
            letter-spacing: 2px;
        }

        .rating-text {
            font-size: 13px;
            color: #666;
        }

        .rating-link {
            color: #000;
            text-decoration: none;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }

        .rating-link:hover {
            color: #666;
            border-bottom-color: #666;
        }

        /* Description */
        .description-section {
            margin-bottom: 28px;
            padding-bottom: 28px;
            border-bottom: 1px solid #e5e5e5;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #000;
            margin-bottom: 12px;
        }

        .description-text {
            font-size: 14px;
            line-height: 1.6;
            color: #666;
        }

        .features-list {
            list-style: none;
            margin-top: 12px;
        }

        .features-list li {
            font-size: 13px;
            color: #666;
            padding: 8px 0;
            padding-left: 24px;
            position: relative;
        }

        .features-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #000;
            font-weight: 600;
        }

        /* Size Selection (Placeholder) */
        .size-section {
            margin-bottom: 28px;
            padding-bottom: 28px;
            border-bottom: 1px solid #e5e5e5;
        }

        .size-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 12px;
        }

        .size-option {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            background: #fff;
        }

        .size-option:hover {
            border-color: #000;
        }

        .size-option.active {
            background: #000;
            color: #fff;
            border-color: #000;
        }

        /* Actions Section */
        .actions-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 28px;
        }

        .btn-primary {
            padding: 14px 20px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            text-align: center;
            width: 100%;
        }

        .btn-primary:hover {
            background: #333;
        }

        .btn-secondary {
            padding: 14px 20px;
            background: #fff;
            color: #000;
            border: 1px solid #000;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            text-align: center;
            width: 100%;
        }

        .btn-secondary:hover {
            background: #f5f5f5;
        }

        .btn-wishlist {
            padding: 12px 20px;
            background: #f5f5f5;
            color: #000;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            width: 100%;
        }

        .btn-wishlist:hover {
            background: #efefef;
        }

        /* Trust Elements */
        .trust-section {
            background: #f8f8f8;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .trust-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 13px;
            color: #666;
        }

        .trust-item:last-child {
            margin-bottom: 0;
        }

        .trust-icon {
            font-size: 16px;
            min-width: 20px;
        }

        /* Error State */
        .error-container {
            max-width: 600px;
            margin: 60px auto;
            padding: 40px 20px;
            text-align: center;
        }

        .error-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #000;
        }

        .error-message {
            font-size: 14px;
            color: #666;
            margin-bottom: 24px;
        }

        .back-button {
            display: inline-block;
            padding: 12px 24px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .back-button:hover {
            background: #333;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .product-container {
                grid-template-columns: 1fr;
                gap: 30px;
            }

            .product-name {
                font-size: 24px;
            }

            .price-current {
                font-size: 28px;
            }
        }

        @media (max-width: 768px) {
            .breadcrumb {
                padding: 8px 12px;
                font-size: 12px;
            }

            .product-name {
                font-size: 20px;
            }

            .price-current {
                font-size: 24px;
            }

            .section-title {
                font-size: 13px;
            }

            .size-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .actions-section {
                gap: 10px;
            }

            .btn-primary,
            .btn-secondary,
            .btn-wishlist {
                padding: 12px 16px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .header-right {
                gap: 12px;
            }

            .product-container {
                padding: 0 12px;
                margin: 15px auto;
            }

            .product-name {
                font-size: 18px;
            }

            .price-current {
                font-size: 22px;
            }

            .price-original {
                font-size: 16px;
            }

            .size-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }

            .size-option {
                padding: 10px;
                font-size: 12px;
            }

            .product-thumbnails {
                grid-template-columns: repeat(3, 1fr);
            }

            .trust-section {
                padding: 12px;
            }

            .trust-item {
                gap: 8px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
            <div class="header-container">
                <a href="#" class="logo">Shoebox</a>
                <div class="header-right">
                    <a href="shop.php" class="back-link">← Back to Shop</a>
                    <a href="cart.php" style="text-decoration:none;color:#000;margin-left:12px;display:flex;align-items:center;gap:8px;">
                        <span style="font-size:18px">🛒</span>
                        <span style="font-size:13px;color:#666">Cart</span>
                        <span style="background:#000;color:#fff;padding:4px 8px;border-radius:12px;font-size:12px;">
                            <?= isset($_SESSION['cart']) ? array_sum($_SESSION['cart']) : 0 ?>
                        </span>
                    </a>
                </div>
            </div>
    </header>

    <?php
    require_once __DIR__ . '/../config/db.php';
    require_once __DIR__ . '/../app/Product.php';

    // Start session and cart handling
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    require_once __DIR__ . '/../app/Cart.php';

    // Get product ID from URL
    $product_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (!$product_id) {
        ?>
        <div class="error-container">
            <div class="error-title">Product Not Found</div>
            <div class="error-message">The product you're looking for doesn't exist or the link is broken.</div>
            <a href="shop.php" class="back-button">Browse All Products</a>
        </div>
        <?php
        exit;
    }

    // Fetch product
    $product = Product::find($pdo, $product_id);

    if (!$product) {
        ?>
        <div class="error-container">
            <div class="error-title">Product Not Found</div>
            <div class="error-message">We couldn't find the product you're looking for. It might have been removed or is no longer available.</div>
            <a href="shop.php" class="back-button">Browse All Products</a>
        </div>
        <?php
        exit;
    }

    // Prepare product data
    $price = $product['price'] ?? 0;
    $sale_price = $product['sale_price'] ?? null;
    $display_price = $sale_price ? $sale_price : $price;
    $discount = $sale_price ? round((1 - $sale_price / $price) * 100) : 0;
    ?>

    <!-- Breadcrumb -->
    <div class="breadcrumb">
        <a href="shop.php">Shop</a> / 
        <a href="shop.php"><?= htmlspecialchars($product['category']) ?></a> / 
        <span><?= htmlspecialchars($product['name']) ?></span>
    </div>

    <?php if (isset($_SESSION['flash'])): ?>
        <div style="max-width:1400px;margin:16px auto;padding:12px 20px;background:#e6ffed;border:1px solid #b7f0c6;color:#0a5f2b;border-radius:6px;">
            <?= htmlspecialchars($_SESSION['flash']['message']) ?>
        </div>
        <?php unset($_SESSION['flash']); ?>
    <?php endif; ?>

    <!-- Product Container -->
    <div class="product-container">
        <!-- Left: Product Image -->
        <div class="product-image-section">
            <div class="product-image-main"></div>
            <div class="product-thumbnails">
                <div class="thumbnail active"></div>
                <div class="thumbnail"></div>
                <div class="thumbnail"></div>
                <div class="thumbnail"></div>
            </div>
        </div>

        <!-- Right: Product Details -->
        <div class="product-details">
            <!-- Header -->
            <div class="product-header">
                <div class="product-brand"><?= htmlspecialchars($product['brand']) ?></div>
                <h1 class="product-name"><?= htmlspecialchars($product['name']) ?></h1>
                <div class="product-category"><?= htmlspecialchars($product['category']) ?></div>
            </div>

            <!-- Pricing -->
            <div class="pricing-section">
                <div class="price-display">
                    <span class="price-current">₹<?= number_format($display_price, 0) ?></span>
                    <?php if ($sale_price): ?>
                        <span class="price-original">₹<?= number_format($price, 0) ?></span>
                        <span class="discount-badge"><?= $discount ?>% OFF</span>
                    <?php endif; ?>
                </div>
                <div class="price-note">Inclusive of all taxes</div>
            </div>

            <!-- Rating -->
            <div class="rating-section">
                <div class="rating-stars">★★★★☆</div>
                <div class="rating-text">
                    <?= rand(128, 520) ?> reviews | 
                    <a href="#" class="rating-link">Be the first to review</a>
                </div>
            </div>

            <!-- Size Selection -->
            <div class="size-section">
                <div class="section-title">Select Size</div>
                <div class="size-grid">
                    <button class="size-option active">6</button>
                    <button class="size-option">7</button>
                    <button class="size-option">8</button>
                    <button class="size-option">9</button>
                    <button class="size-option">10</button>
                    <button class="size-option">11</button>
                    <button class="size-option">12</button>
                    <button class="size-option">13</button>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="actions-section">
                <form method="post" style="margin:0; display:flex; gap:8px; align-items:center;">
                    <input type="hidden" name="product_id" value="<?= $product['id'] ?>">
                    <input type="hidden" name="size" id="selected_size" value="">
                    <label style="font-size:13px;color:#666;display:flex;align-items:center;gap:8px;">
                        Qty
                        <input type="number" name="quantity" value="1" min="1" style="width:72px;padding:8px;border:1px solid #ddd;border-radius:4px;">
                    </label>
                    <button type="submit" name="add_to_cart" class="btn-primary">Add to Cart</button>
                </form>
                <button id="availBtn" class="btn-secondary" type="button">Check Store Availability</button>
                <button class="btn-wishlist">♡ Add to Wishlist</button>
            </div>

            <!-- Trust Elements -->
            <div class="trust-section">
                <div class="trust-item">
                    <span class="trust-icon">✓</span>
                    <span>Free shipping on orders over ₹999</span>
                </div>
                <div class="trust-item">
                    <span class="trust-icon">↩</span>
                    <span>Easy 30-day returns</span>
                </div>
                <div class="trust-item">
                    <span class="trust-icon">🔒</span>
                    <span>Secure checkout</span>
                </div>
            </div>

            <!-- Description -->
            <div class="description-section">
                <div class="section-title">About This Product</div>
                <p class="description-text">
                    <?php 
                    if (isset($product['description']) && !empty($product['description'])) {
                        echo htmlspecialchars($product['description']);
                    } else {
                        echo "Premium quality footwear crafted with attention to detail. Designed for comfort and style, this product combines durability with modern aesthetics. Perfect for everyday wear, work, or special occasions.";
                    }
                    ?>
                </p>
                <ul class="features-list">
                    <li>Premium quality materials</li>
                    <li>Comfortable fit for all-day wear</li>
                    <li>Durable construction</li>
                    <li>Easy to clean and maintain</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Store Availability Modal -->
    <div id="availabilityModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
        <div style="background:#fff;border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <h2 style="font-size:20px;font-weight:700;margin:0;">Store Availability</h2>
                <button id="closeAvailBtn" type="button" style="background:none;border:none;font-size:24px;cursor:pointer;color:#999;">&times;</button>
            </div>
            <div style="display:flex;gap:16px;flex-direction:column;">
                <?php foreach (Inventory::getStores() as $sid => $sname):
                    // Get all available sizes for this product/store combo
                    $stmtSizes = $pdo->prepare('SELECT size, stock FROM inventory WHERE product_id = ? AND store_id = ? ORDER BY CAST(size AS UNSIGNED)');
                    $stmtSizes->execute([$product['id'], $sid]);
                    $sizes = $stmtSizes->fetchAll(PDO::FETCH_ASSOC);
                ?>
                    <div style="border:1px solid #e5e5e5;padding:14px;border-radius:6px;">
                        <div style="font-weight:700;font-size:15px;margin-bottom:10px;"><?= htmlspecialchars($sname) ?></div>
                        <?php if (!empty($sizes)): ?>
                            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:13px;">
                                <?php foreach ($sizes as $sz): ?>
                                    <div style="padding:8px;background:#f5f5f5;border-radius:4px;text-align:center;border-left:3px solid <?= $sz['stock'] > 0 ? '#4caf50' : '#ddd' ?>">
                                        <div style="font-weight:600;">Size <?= htmlspecialchars($sz['size']) ?></div>
                                        <div style="color:<?= $sz['stock'] > 0 ? '#4caf50' : '#999' ?>;font-weight:500;margin-top:4px;"><?= $sz['stock'] > 0 ? $sz['stock'] . ' in stock' : 'Out of stock' ?></div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <div style="color:#999;font-size:13px;">No inventory data</div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</body>
<script>
    (function(){
        var sizeButtons = document.querySelectorAll('.size-option');
        var sizeInput = document.getElementById('selected_size');
        if (!sizeInput) return;

        // Initialize selected size from the active button or first button
        var initial = document.querySelector('.size-option.active') || sizeButtons[0];
        if (initial) {
            sizeInput.value = initial.textContent.trim();
        }

        sizeButtons.forEach(function(btn){
            btn.addEventListener('click', function(e){
                e.preventDefault();
                sizeButtons.forEach(function(b){ b.classList.remove('active'); });
                btn.classList.add('active');
                sizeInput.value = btn.textContent.trim();
            });
        });
    })();

    // Modal handler
    (function(){
        var modal = document.getElementById('availabilityModal');
        var btn = document.getElementById('availBtn');
        var closeBtn = document.getElementById('closeAvailBtn');
        if (!modal || !btn) return;

        btn.addEventListener('click', function(e){
            e.preventDefault();
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', function(){
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function(e){
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    })();
</script>
</html>