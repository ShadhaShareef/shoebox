# Shoebox E-Commerce Platform - Sitemap

## Site Structure Overview

```
SHOEBOX
│
├── PUBLIC PAGES
│   ├── Home Page
│   │   ├── Hero
│   │   ├── Featured Categories
│   │   ├── New Arrivals
│   │   ├── Best Sellers
│   │   ├── Popular Brands
│   │   ├── Store Locations
│   │   └── Customer Reviews
|   |
│   ├── Shop / Product Listing
│   │   ├── Category Pages
│   │   │   ├── Men
│   │   │   ├── Women
│   │   │   ├── Kids
│   │   │   ├── Sports
│   │   │   ├── Casual
│   │   │   └── Formal
│   │   │
│   │   └── Filters & Search
│   │       ├── By Price
│   │       ├── By Brand
│   │       ├── By Size
│   │       ├── By Color
│   │       └── Sort Options
│   │
│   ├── Product Detail Page
│   │   ├── Product Gallery
│   │   ├── Product Information
│   │   ├── Size & Quantity Selection
│   │   ├── Store Availability (Modal)
│   │   ├── Add to Cart / Buy Now
│   │   ├── Product Description
│   │   ├── Specifications
│   │   ├── Reviews & Ratings
│   │   └── Related Products
│   │
│   ├── Brands
│   │   ├── Brand Listing
│   │   └── Brand Detail Page
│   │
│   ├── Store Locator
│   │
│   ├── About Us
│   │
│   ├── Contact Us
│   │
│   ├── Shopping Cart
│   │   ├── Cart Items
│   │   ├── Update Quantity
│   │   ├── Remove Items
│   │   ├── Promo Code
│   │   └── Proceed to Checkout
│   │
│   ├── Checkout (Multi-Step)
│   │   ├── Step 1: Address
│   │   │   ├── Saved Addresses
│   │   │   ├── Add New Address
│   │   │   └── Select Address
│   │   │
│   │   ├── Step 2: Delivery Method
│   │   │   ├── Home Delivery
│   │   │   └── Store Pickup
│   │   │       ├── Thrissur
│   │   │       ├── Kochi
│   │   │       ├── Kozhikode
│   │   │
│   │   ├── Step 3: Payment
│   │   │   ├── UPI
│   │   │   ├── Credit Card
│   │   │   ├── Debit Card
│   │   │   ├── Net Banking
│   │   │   └── Cash on Delivery
│   │   │
│   │   ├── Order Review
│   │   └── Place Order
│   │
│   ├── Order Success
│   │   ├── Order Confirmation
│   │   ├── Order Number
│   │   └── Delivery Info
│   │
│   ├── Authentication
│   │   ├── Login Page
│   │   ├── Register Page
│   │   └── Forgot Password
│   │
│   └── Customer Account Area
│       ├── Dashboard / Home
│       ├── My Orders
│       │   └── Order Detail Page
|       |   ├── Track Order
│       │       ├── Pending
│       │       ├── Confirmed
|       |       ├── Shipped
│       │       ├── Ready for Pickup
│       │       ├── Delivered
│       │       └── Cancelled
│       │       
│       │
│       ├── Wishlist
│       │
│       ├── My Addresses
│       │   ├── Add Address
│       │   ├── Edit Address
│       │   └── Delete Address
│       │
│       ├── Profile & Settings
│       │   ├── Personal Information
│       │   ├── Email Preferences
│       │   └── Change Password
│       │
│       └── Logout
│
├── ADMIN PAGES (Admin Only)
│   ├── Admin Dashboard
│   │   ├── Sales Overview
│   │   ├── Top Products
│   │   ├── Recent Orders
│   │   └── Analytics
│   │
│   ├── Products Management
│   │   ├── Product List
│   │   ├── Add Product
│   │   ├── Edit Product
│   │   ├── Delete Product
│   │   ├── Product Images
│   │   └── Bulk Actions
│   │
│   ├── Categories Management
│   │   ├── Category List
│   │   ├── Add Category
│   │   ├── Edit Category
│   │   └── Delete Category
│   │
│   ├── Brands Management
│   │   ├── Brand List
│   │   ├── Add Brand
│   │   ├── Edit Brand
│   │   └── Delete Brand
│   │
│   ├── Inventory Management
│   │   ├── Stock Levels
│   │   │   ├── By Store
│   │   │   ├── By Product
│   │   │   ├── By Size
│   │   │   └── Low Stock Alerts
│   │   │
│   │   ├── Stock Transfers
│   │   │   ├── Between Stores
│   │   │   └── Import/Export
│   │   │
│   │   └── Inventory Reports
│   │
│   ├── Orders Management
│   │   ├── Order List
│   │   ├── Order Detail
│   │   ├── Order Status Updates
│   │   ├── Refund Management
│   │   └── Export Orders
│   │
│   ├── Customers Management
│   │   ├── Customer List
│   │   ├── Customer Detail
│   │   ├── Customer Activity
│   │   └── Customer Groups
│   │
│   ├── Banners & Marketing
│   │   ├── Homepage Banners
│   │   ├── Category Banners
│   │   └── Promotional Content
│   │
│   ├── Stores Management
│   │   ├── Store List
│   │   ├── Store Details
│   │   ├── Store Settings
│   │   ├── Store Manager Assignments
│   │   └── Store Performance
│   │
│   ├── Reports & Analytics
│   │   ├── Sales Reports
│   │   ├── Product Performance
│   │   ├── Customer Analytics
│   │   ├── Inventory Reports
│   │   └── Custom Reports
│   │
│   └── Settings
│       ├── General Settings
│       ├── Email Configuration
│       ├── Payment Gateway
│       ├── Shipping Settings
│       ├── Tax Configuration
│       └── User Management
│
└── STORE MANAGER PAGES (Store Manager Only)
    ├── Store Manager Dashboard
    │   ├── Store Overview
    │   ├── Local Sales
    │   ├── Local Inventory Status
    │   └── Recent Orders
    │
    ├── Inventory Management
    │   ├── Local Stock Levels
    │   ├── Stock Transfers (Out)
    │   ├── Inventory Adjustments
    │   └── Stock Reports
    │
    ├── Orders Management
    │   ├── Store Orders
    │   ├── Order Status Updates
    │   ├── Local Order Reports
    │   └── Pickup Orders
    │
    └── Customers
        ├── Local Customer List
        ├── Customer Activity
        └── Customer Preferences
```

---

## Page Hierarchy by User Type

### Customer Journey Path
1. **Discovery** → Home → Shop → Category → Product Detail
2. **Selection** → Add to Cart → Review Cart
3. **Purchase** → Checkout (3 steps) → Order Success
4. **Post-Purchase** → Account Dashboard → Order History/Tracking

### Admin Access Path
- Admin Dashboard (entry point)
- Product/Inventory Management (content control)
- Orders/Customers (business operations)
- Reports/Settings (analytics & configuration)

### Store Manager Access Path
- Store Manager Dashboard (entry point)
- Local Inventory Control
- Local Orders Processing
- Customer Insights (local)

---

## Key Navigation Elements

### Main Navigation (All Pages)
- Logo → Home
- Shop (with category dropdown)
- Search
- Account/Login
- Wishlist
- Cart

### Footer Navigation
- Shop
- Brands
- Store Locator
- About Us
- Contact Us
- FAQs
- Policies (Privacy, T&C, Returns)
- Social Links

### Authentication Wall
- Required for: Checkout, Account Area, Wishlist, Orders
- Optional for: Browsing, Product Views

---

## Database Entity Relationships

```
Users (Customers)
├── Orders
│   └── Order Items
│       ├── Products
│       └── Inventory (Stock Tracking)
├── Addresses
└── Wishlist Items

Products
├── Categories
├── Brands
├── Inventory (per Store + Size)
├── Reviews
└── Related Products

Stores
├── Inventory
├── Managers
└── Orders (Local)

Orders
├── Order Items
├── Shipping Address
├── Payments
└── Store (fulfilled from)
```

---

## Responsive Breakpoints

- **Desktop**: 1400px+
- **Tablet**: 768px - 1399px
- **Mobile**: < 768px

All pages must be optimized for mobile-first responsive design.

---

## Performance Targets

- **Page Load**: < 3 seconds
- **Cart Addition**: Instant (AJAX)
- **Checkout**: < 2 seconds per step
- **Search**: < 500ms response
- **Product Gallery**: Lazy loading

---

## SEO & URL Structure

```
/                          → Home
/shop                      → Product Listing
/shop/men                  → Category Filter
/brand/nike                → Brand Filter
/product/[product]         → Product Detail
/brands                    → Brands Listing
/brand/[brand]             → Brand Detail
/stores                    → Store Locator
/about                     → About Us
/contact                   → Contact Us
/cart                      → Shopping Cart
/checkout                  → Checkout
/order/[id]                → Order Detail (Account Required)
/account/dashboard         → Account Dashboard
/account/orders            → Orders History
/account/wishlist          → Wishlist
/account/addresses         → Address Management
/account/profile           → Profile Settings
/login                     → Login
/register                  → Registration
/forgot-password           → Password Recovery

Admin URLs (/admin/):
/admin/dashboard           → Admin Dashboard
/admin/products            → Products Management
/admin/categories          → Categories Management
/admin/inventory           → Inventory Management
/admin/orders              → Orders Management
/admin/customers           → Customers Management
/admin/reports             → Reports & Analytics
```
