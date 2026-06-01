<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../app/Product.php';
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$cart_count = 0;
if (!empty($_SESSION['cart']) && is_array($_SESSION['cart'])) {
    $cart_count = array_sum($_SESSION['cart']);
}

$products = Product::all($pdo);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop - Shoebox | Premium Footwear</title>
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
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .logo {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #000;
            text-decoration: none;
        }

        .search-bar {
            flex: 1;
            max-width: 500px;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            background: #f5f5f5;
            transition: all 0.2s;
        }

        .search-input:focus {
            outline: none;
            background: #fff;
            border-color: #999;
        }

        /* Main Container */
        .shop-container {
            max-width: 1400px;
            margin: 30px auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 30px;
        }

        /* Sidebar */
        .sidebar {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            height: fit-content;
            border: 1px solid #e5e5e5;
        }

        .filter-section {
            margin-bottom: 28px;
        }

        .filter-section:last-child {
            margin-bottom: 0;
        }

        .filter-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            color: #000;
        }

        .filter-option {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            cursor: pointer;
        }

        .filter-checkbox {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            cursor: pointer;
            accent-color: #000;
        }

        .filter-label {
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }

        .price-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .price-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
            text-align: center;
        }

        .price-separator {
            text-align: center;
            font-size: 12px;
            color: #999;
            grid-column: 1 / -1;
        }

        /* Main Content */
        .main-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
        }

        .shop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e5e5;
        }

        .results-count {
            font-size: 14px;
            color: #666;
        }

        .sort-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sort-label {
            font-size: 14px;
            color: #666;
        }

        .sort-select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            background: #fff;
            cursor: pointer;
            min-width: 180px;
        }

        /* Product Grid */
        .products-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        /* Product Card */
        .product-card {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 6px;
            overflow: hidden;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }

        .product-card:hover {
            border-color: #999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .product-image {
            width: 100%;
            aspect-ratio: 1;
            background: linear-gradient(135deg, #f0f0f0 0%, #e5e5e5 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 48px;
            overflow: hidden;
            position: relative;
        }

        .product-image::after {
            content: '👟';
            font-size: 64px;
            opacity: 0.3;
        }

        .product-content {
            padding: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .product-brand {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #999;
            margin-bottom: 6px;
        }

        .product-name {
            font-size: 15px;
            font-weight: 600;
            color: #000;
            margin-bottom: 8px;
            line-height: 1.3;
            flex: 1;
        }

        .product-category {
            font-size: 12px;
            color: #999;
            margin-bottom: 12px;
        }

        .product-price {
            margin-bottom: 12px;
        }

        .price-current {
            font-size: 16px;
            font-weight: 700;
            color: #000;
        }

        .price-original {
            font-size: 13px;
            color: #999;
            text-decoration: line-through;
            margin-left: 6px;
        }

        .price-badge {
            display: inline-block;
            font-size: 11px;
            background: #f0f0f0;
            color: #666;
            padding: 4px 8px;
            border-radius: 3px;
            margin-left: 6px;
        }

        .product-rating {
            font-size: 12px;
            color: #999;
            margin-bottom: 12px;
        }

        .product-actions {
            display: flex;
            gap: 8px;
        }

        .btn-view {
            flex: 1;
            padding: 10px 12px;
            background: #000;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.2s;
            display: inline-block;
        }

        .btn-view:hover {
            background: #333;
        }

        .btn-favorite {
            width: 40px;
            height: 40px;
            padding: 0;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .btn-favorite:hover {
            background: #efefef;
        }

        /* No Products */
        .no-products {
            text-align: center;
            padding: 40px 20px;
            color: #999;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .shop-container {
                grid-template-columns: 200px 1fr;
                gap: 20px;
            }

            .products-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }

            .header-container {
                gap: 15px;
            }

            .search-bar {
                max-width: 300px;
            }
        }

        @media (max-width: 768px) {
            .shop-container {
                grid-template-columns: 1fr;
            }

            .sidebar {
                display: none;
            }

            .products-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .header-container {
                flex-wrap: wrap;
                gap: 12px;
            }

            .search-bar {
                flex-basis: 100%;
                max-width: 100%;
                order: 3;
            }

            .logo {
                font-size: 18px;
            }

            .search-input {
                padding: 10px 14px;
                font-size: 13px;
            }

            .sort-wrapper {
                font-size: 13px;
            }

            .sort-select {
                min-width: 140px;
                padding: 6px 10px;
                font-size: 13px;
            }
        }

        @media (max-width: 480px) {
            .products-grid {
                grid-template-columns: 1fr;
            }

            .header-container {
                padding: 0 12px;
                gap: 10px;
            }

            .logo {
                font-size: 16px;
            }

            .search-bar {
                max-width: 100%;
            }

            .shop-container {
                padding: 0 12px;
                margin: 15px auto;
            }

            .main-content {
                padding: 12px;
                border-radius: 4px;
            }

            .shop-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 16px;
            }

            .sort-wrapper {
                width: 100%;
            }

            .sort-select {
                width: 100%;
                min-width: unset;
            }
        }
    </style>
</head>
<body>
    <!-- Header with Search -->
    <header>
        <div class="header-container">
            <a href="#" class="logo">Shoebox</a>
            <div class="search-bar">
                <input type="text" class="search-input" placeholder="Search products, brands, styles...">
            </div>
            <div style="margin-left:12px;">
                <a href="cart.php" style="text-decoration:none;color:#000;font-weight:600;display:flex;align-items:center;gap:8px;">
                    <span style="font-size:18px">🛒</span>
                    <span style="font-size:13px;color:#666">Cart</span>
                    <span style="background:#000;color:#fff;padding:4px 8px;border-radius:12px;font-size:12px;"><?= $cart_count ?></span>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Shop Layout -->
    <div class="shop-container">
        <!-- Sidebar Filters -->
        <aside class="sidebar">
            <!-- Category Filter -->
            <div class="filter-section">
                <div class="filter-title">Category</div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="cat-running">
                    <label for="cat-running" class="filter-label">Running Shoes</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="cat-casual">
                    <label for="cat-casual" class="filter-label">Casual Shoes</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="cat-sports">
                    <label for="cat-sports" class="filter-label">Sports Shoes</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="cat-formal">
                    <label for="cat-formal" class="filter-label">Formal Shoes</label>
                </div>
            </div>

            <!-- Brand Filter -->
            <div class="filter-section">
                <div class="filter-title">Brand</div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="brand-nike">
                    <label for="brand-nike" class="filter-label">Nike</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="brand-adidas">
                    <label for="brand-adidas" class="filter-label">Adidas</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="brand-puma">
                    <label for="brand-puma" class="filter-label">Puma</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="brand-nbalance">
                    <label for="brand-nbalance" class="filter-label">New Balance</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="brand-clarks">
                    <label for="brand-clarks" class="filter-label">Clarks</label>
                </div>
            </div>

            <!-- Price Filter -->
            <div class="filter-section">
                <div class="filter-title">Price Range</div>
                <div class="price-inputs">
                    <input type="number" class="price-input" placeholder="Min" value="0">
                    <input type="number" class="price-input" placeholder="Max" value="50000">
                </div>
            </div>

            <!-- Size Filter -->
            <div class="filter-section">
                <div class="filter-title">Size</div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-6">
                    <label for="size-6" class="filter-label">6 US</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-7">
                    <label for="size-7" class="filter-label">7 US</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-8">
                    <label for="size-8" class="filter-label">8 US</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-9">
                    <label for="size-9" class="filter-label">9 US</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-10">
                    <label for="size-10" class="filter-label">10 US</label>
                </div>
                <div class="filter-option">
                    <input type="checkbox" class="filter-checkbox" id="size-11">
                    <label for="size-11" class="filter-label">11 US</label>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Shop Header with Sort -->
            <div class="shop-header">
                <div class="results-count">
                    <?php
                    require_once __DIR__ . '/../config/db.php';
                    require_once __DIR__ . '/../app/Product.php';
                    $products = Product::all($pdo);
                    echo count($products) . ' Products';
                    ?>
                </div>
                <div class="sort-wrapper">
                    <label for="sort" class="sort-label">Sort by:</label>
                    <select id="sort" class="sort-select">
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>

            <!-- Products Grid -->
            <?php if (count($products) > 0): ?>
                <div class="products-grid">
                    <?php foreach ($products as $product): 
                        $price = $product['price'] ?? 0;
                        $sale_price = $product['sale_price'] ?? null;
                        $discount = $sale_price ? round((1 - $sale_price / $price) * 100) : 0;
                    ?>
                        <div class="product-card">
                            <div class="product-image"></div>
                            <div class="product-content">
                                <div class="product-brand"><?= htmlspecialchars($product['brand']) ?></div>
                                <h3 class="product-name"><?= htmlspecialchars($product['name']) ?></h3>
                                <div class="product-category"><?= htmlspecialchars($product['category']) ?></div>
                                
                                <div class="product-price">
                                    <span class="price-current">₹<?= $sale_price ? number_format($sale_price, 0) : number_format($price, 0) ?></span>
                                    <?php if ($sale_price): ?>
                                        <span class="price-original">₹<?= number_format($price, 0) ?></span>
                                        <span class="price-badge"><?= $discount ?>% OFF</span>
                                    <?php endif; ?>
                                </div>

                                <div class="product-rating">★★★★☆ (<?= rand(128, 520) ?> reviews)</div>

                                <div class="product-actions">
                                    <a href="product.php?id=<?= $product['id'] ?>" class="btn-view">View Details</a>
                                    <button class="btn-favorite" title="Add to wishlist">♡</button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div class="no-products">
                    <p>No products available at the moment.</p>
                </div>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>