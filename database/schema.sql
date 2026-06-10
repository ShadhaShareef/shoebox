  -- Shoebox Database Schema v2 Refactor
  -- Compatible with MySQL 8 and phpMyAdmin

  -- 1. PRODUCTS IMPROVEMENTS
  -- Add brand_id and category_id to products table
  ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `brand_id` INT NULL AFTER `id`,
  ADD COLUMN IF NOT EXISTS `category_id` INT NULL AFTER `brand_id`;

  -- Add foreign keys for products
  ALTER TABLE `products`
  ADD CONSTRAINT IF NOT EXISTS `fk_products_brand`
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE SET NULL;

  ALTER TABLE `products`
  ADD CONSTRAINT IF NOT EXISTS `fk_products_category`
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

  -- 2. PRODUCT IMAGES TABLE
  CREATE TABLE IF NOT EXISTS `product_images` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `product_id` INT NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `sort_order` INT DEFAULT 0,
    `is_primary` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    INDEX `idx_product_images_product_id` (`product_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  -- 3. NESTED CATEGORIES
  -- Add parent_id to categories table
  ALTER TABLE `categories`
  ADD COLUMN IF NOT EXISTS `parent_id` INT NULL AFTER `id`;

  -- Add self-referencing foreign key
  ALTER TABLE `categories`
  ADD CONSTRAINT IF NOT EXISTS `fk_categories_parent`
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

  -- 4. INVENTORY ENHANCEMENT
  -- Add reserved_stock column to inventory table
  ALTER TABLE `inventory`
  ADD COLUMN IF NOT EXISTS `reserved_stock` INT DEFAULT 0 AFTER `stock`;

  -- 5. ORDERS ENHANCEMENT
  -- Add payment_status column to orders table
  ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `payment_status` ENUM('pending', 'paid', 'failed',
  'refunded') DEFAULT 'pending' AFTER `status`;

  -- 6. ORDER STATUS HISTORY TABLE
  CREATE TABLE IF NOT EXISTS `order_status_history` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    INDEX `idx_order_status_history_order_id` (`order_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  -- 7. PAYMENTS TABLE
  CREATE TABLE IF NOT EXISTS `payments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `order_id` INT NOT NULL,
    `payment_method` ENUM('COD', 'UPI', 'Card') NOT NULL,
    `transaction_reference` VARCHAR(255),
    `amount` DECIMAL(10,2) NOT NULL,
    `status` ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    INDEX `idx_payments_order_id` (`order_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  -- 8. REVIEWS CONSTRAINT
  -- Check for duplicates before adding unique constraint
  -- This query should be run manually to check for duplicates:
  -- SELECT user_id, product_id, COUNT(*) as count FROM reviews GROUP BY user_id,
  product_id HAVING count > 1;

  -- Only add the constraint if no duplicates exist:
  -- ALTER TABLE `reviews` ADD UNIQUE KEY `uk_reviews_user_product` (`user_id`,
  `product_id`);

  -- 9. INDEX REVIEW
  -- Remove duplicate indexes (examples - adjust based on actual schema)
  -- These commands should be run after checking existing indexes:
  -- SHOW INDEX FROM products;
  -- SHOW INDEX FROM categories;
  -- SHOW INDEX FROM orders;

  -- Example commands to drop duplicate indexes (adjust names as needed):
  -- ALTER TABLE `products` DROP INDEX IF EXISTS `duplicate_index_name`;
  -- ALTER TABLE `products` DROP INDEX IF EXISTS `duplicate_fulltext_index`;

  -- Optimize indexes for performance
  ALTER TABLE `products`
  ADD INDEX IF NOT EXISTS `idx_products_brand_category` (`brand_id`,
  `category_id`);

  ALTER TABLE `orders`
  ADD INDEX IF NOT EXISTS `idx_orders_user_status` (`user_id`, `status`);

  -- 10. MIGRATION NOTES
  -- After running this script, you should:
  -- 1. Populate product_images table with existing product images
  -- 2. Update products.brand_id and products.category_id with appropriate values
  -- 3. Populate order_status_history with existing order status data
  -- 4. Check for duplicate reviews before adding unique constraint
  -- 5. Audit and remove duplicate indexes
  -- 6. Update application code to use new columns and tables