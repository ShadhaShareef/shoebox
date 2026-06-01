# Shoebox E-Commerce Platform - Wireframes

## Low-Fidelity Text Wireframes

This document contains text-based wireframes for all major pages in the Shoebox platform. These serve as the blueprint for frontend development.

---

## 1. HOME PAGE

### Purpose
Showcase brand, featured products, categories, seasonal promotions, and drive traffic to shop.

### Key User Actions
- Browse featured products
- Explore categories
- View promotions/banners
- Access search
- Navigate to shop

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
│  Logo | Search Bar | Account | Wishlist | Cart (Badge)         │
│                   Category Navigation                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    HERO BANNER / CAROUSEL                       │
│              (Large promotional image with CTA)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FEATURED CATEGORIES (Grid - 4 columns)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  Men     │ │  Women   │ │  Kids    │ │  Sports  │           │
│  │ (Image)  │ │ (Image)  │ │ (Image)  │ │ (Image)  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FEATURED PRODUCTS (6-8 products in 4-column grid)              │
│                                                                 │
│  Product Card    Product Card    Product Card    Product Card   │
│  Product Card    Product Card    Product Card    Product Card   │
│                                                                 │
│  [View All Products Button]                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      PROMOTIONAL BANNER                         │
│              (Seasonal offer or flash sale)                     │
│                      [Shop Now CTA]                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TOP BRANDS (6 brand logos in grid)                             │
│                                                                 │
│  [Brand Logo]  [Brand Logo]  [Brand Logo]  [Brand Logo]        │
│  [Brand Logo]  [Brand Logo]                                    │
│                                                                 │
│  [View All Brands]                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TESTIMONIALS & TRUST ELEMENTS                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐│
│  │ ⭐⭐⭐⭐⭐       │  │ ⭐⭐⭐⭐⭐       │  │ ⭐⭐⭐⭐⭐     ││
│  │ Customer Quote   │  │ Customer Quote   │  │ Customer Quote │
│  │ - Customer Name  │  │ - Customer Name  │  │ - Customer Name│
│  └──────────────────┘  └──────────────────┘  └────────────────┘
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STORE LOCATOR PREVIEW                                          │
│  [Store Locator Map]       [List of 3 Stores]                  │
│  [Visit Store Locator]                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  NEWSLETTER SIGNUP                                              │
│  "Subscribe for exclusive offers"                              │
│  [Email Input] [Subscribe Button]                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
│  [Shop Links]  [Company Info]  [Customer Service]  [Social]    │
│                      Copyright & Policies                       │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌───────────────────────┐
│      HEADER           │
│ Hamburger | Search    │
│ Account | Cart        │
└───────────────────────┘

┌───────────────────────┐
│  HERO BANNER (Full)   │
│    [Image + CTA]      │
└───────────────────────┘

┌───────────────────────┐
│  FEATURED CATEGORIES  │
│  (2-column grid)      │
│  Men  | Women         │
│  Kids | Sports        │
└───────────────────────┘

┌───────────────────────┐
│  FEATURED PRODUCTS    │
│  (Vertical scrollable)│
│  - Product Card       │
│  - Product Card       │
│  - Product Card       │
│  [Load More]          │
└───────────────────────┘

┌───────────────────────┐
│  PROMOTIONAL BANNER   │
│    [Image + CTA]      │
└───────────────────────┘

┌───────────────────────┐
│  TOP BRANDS           │
│  (Scrollable carousel)│
│  Logo Logo Logo       │
└───────────────────────┘

┌───────────────────────┐
│  TESTIMONIALS         │
│  (Scrollable)         │
│  [Quote Card]         │
│  [Quote Card]         │
└───────────────────────┘

┌───────────────────────┐
│  NEWSLETTER SIGNUP    │
│  [Email]              │
│  [Subscribe]          │
└───────────────────────┘

┌───────────────────────┐
│      FOOTER           │
│   (Stacked sections)  │
└───────────────────────┘
```

### Reusable Components
- Product Card (image, name, price, rating, quick-add)
- Category Card (image with overlay)
- Brand Logo Grid
- Newsletter Signup Form
- Testimonial Card
- CTA Button

---

## 2. SHOP / PRODUCT LISTING PAGE

### Purpose
Display filtered/sorted product listings with category navigation, search refinement, and browsing capabilities.

### Key User Actions
- Browse products by category
- Apply filters (price, size, color, brand)
- Sort results (popularity, price, newest)
- Pagination through results
- Add to cart from listing
- View product details

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Home > Shop > [Category]                            │
│                                                                 │
│ PAGE TITLE: [Category Name] ([Count] products)                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────┐
│                  │                                             │
│   FILTERS        │          PRODUCT GRID                       │
│   SIDEBAR        │                                             │
│                  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ ✓ Category       │  │ Product  │ │ Product  │ │ Product  │    │
│   • Men          │  │   1      │ │   2      │ │   3      │    │
│   • Women        │  │          │ │          │ │          │    │
│   • Kids         │  └──────────┘ └──────────┘ └──────────┘    │
│                  │                                             │
│ ✓ Price          │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│   [Min - Max]    │  │ Product  │ │ Product  │ │ Product  │    │
│   [Slider]       │  │   4      │ │   5      │ │   6      │    │
│   [Apply]        │  │          │ │          │ │          │    │
│                  │  └──────────┘ └──────────┘ └──────────┘    │
│ ✓ Brand          │                                             │
│   ☐ Nike        │  [Previous]  [1] [2] [3]  [Next]            │
│   ☐ Adidas      │                                             │
│   ☐ Puma        │                                             │
│   ☐ Skechers    │                                             │
│                  │                                             │
│ ✓ Size           │  [SORT DROPDOWN]                            │
│   ☐ 6           │  Show: ☐ Grid ☐ List                        │
│   ☐ 7           │                                             │
│   ☐ 8           │                                             │
│   ☐ 9           │                                             │
│   ☐ 10          │                                             │
│                  │                                             │
│ ✓ Color          │                                             │
│   ☐ Black       │                                             │
│   ☐ White       │                                             │
│   ☐ Brown       │                                             │
│                  │                                             │
│ [Clear Filters] │                                             │
│                  │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│      HEADER          │
└──────────────────────┘

┌──────────────────────┐
│   BREADCRUMB         │
│   TITLE              │
│ [FILTER] [SORT]      │
└──────────────────────┘

┌──────────────────────┐
│  ACTIVE FILTERS TAG  │
│  [X Price] [X Size]  │
│  [Clear All]         │
└──────────────────────┘

┌──────────────────────┐
│  PRODUCTS (2-column) │
│  ┌────────┐ ┌──────┐ │
│  │Product │ │Prod  │ │
│  │   1    │ │  2   │ │
│  └────────┘ └──────┘ │
│  ┌────────┐ ┌──────┐ │
│  │Product │ │Prod  │ │
│  │   3    │ │  4   │ │
│  └────────┘ └──────┘ │
│  [Load More]         │
└──────────────────────┘

── FILTER PANEL (Collapsible/Drawer) ──
┌──────────────────────┐
│ FILTERS              │
│ Category / Price     │
│ Brand / Size / Color │
│ [Apply] [Reset]      │
└──────────────────────┘
```

### Reusable Components
- Product Card (grid/list view)
- Filter Sidebar (collapsible on mobile)
- Filter Chips (active filter tags)
- Sort Dropdown
- Pagination Controls

---

## 3. PRODUCT DETAIL PAGE

### Purpose
Display comprehensive product information, enable size/quantity selection, facilitate purchase decisions, and encourage checkout.

### Key User Actions
- View product gallery (main + thumbnails)
- Select size
- Select quantity
- Add to cart
- Check store availability
- Read description & reviews
- View related products
- Add to wishlist

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB: Home > Shop > Category > Product Name               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────────────────────┐
│                          │                                      │
│   PRODUCT GALLERY        │   PRODUCT INFORMATION                │
│                          │                                      │
│   ┌──────────────────┐   │  Brand (Uppercase)                  │
│   │                  │   │  Product Name (Large Bold)          │
│   │   Main Image     │   │  Category · Rating ⭐ (Count)      │
│   │   (Large)        │   │                                      │
│   │                  │   │  ┌────────────────────────────────┐ │
│   └──────────────────┘   │  │ Price Display                  │ │
│                          │  │ Current: ₹XXXX                 │ │
│   [Thumbnails Below]     │  │ Original: ₹XXXX (crossed out)  │ │
│   ┌─┐ ┌─┐ ┌─┐ ┌─┐       │  │ Discount: XX% OFF              │ │
│   │1│ │2│ │3│ │4│       │  │ Tax Inclusive                  │ │
│   └─┘ └─┘ └─┘ └─┘       │  └────────────────────────────────┘ │
│                          │                                      │
│   [Zoom] [Share]         │  SIZE SELECTION                      │
│                          │  ┌────────────────────────────────┐ │
│                          │  │ Select Size:                   │ │
│                          │  │ [6]  [7]  [8]  [9]  [10]  [11] │ │
│                          │  │ [12] [13]                      │ │
│                          │  └────────────────────────────────┘ │
│                          │                                      │
│                          │  QUANTITY                            │
│                          │  [−] [1] [+]                        │
│                          │                                      │
│                          │  ┌────────────────────────────────┐ │
│                          │  │ [Add to Cart] (Primary CTA)    │ │
│                          │  │ [Buy Now] (Secondary)          │ │
│                          │  │ [❤ Add to Wishlist]            │ │
│                          │  │ [Check Availability]           │ │
│                          │  └────────────────────────────────┘ │
│                          │                                      │
│                          │  TRUST ELEMENTS                      │
│                          │  ✓ Free shipping over ₹999          │
│                          │  ✓ 30-day easy returns              │
│                          │  ✓ Secure checkout                  │
│                          │                                      │
└──────────────────────────┴──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PRODUCT DESCRIPTION / DETAILS TABS                             │
│                                                                 │
│  [Description] [Specifications] [Reviews]                       │
│                                                                 │
│  Description Content:                                           │
│  - Product overview                                             │
│  - Key features                                                 │
│  - Material & care instructions                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  REVIEWS SECTION                                                │
│                                                                 │
│  [Write Review] Button                                          │
│  Average Rating: ⭐⭐⭐⭐☆ (4.2/5) · 128 Reviews              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⭐⭐⭐⭐⭐  "Excellent quality!"                           │   │
│  │ John Doe · Verified Purchase · 2 weeks ago            │   │
│  │ Lorem ipsum dolor sit amet...                         │   │
│  │ Helpful? [👍 Yes (5)]  [👎 No (0)]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⭐⭐⭐☆☆  "Good but expected more..."                  │   │
│  │ Jane Smith · Verified Purchase · 1 month ago           │   │
│  │ Lorem ipsum dolor sit amet...                         │   │
│  │ Helpful? [👍 Yes (3)]  [👎 No (1)]                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Load More Reviews]                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RELATED PRODUCTS (Carousel or Grid - 4 products)               │
│                                                                 │
│  Product Card    Product Card    Product Card    Product Card   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Store Availability Modal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                               X │
│                    STORE AVAILABILITY                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  THRISSUR                                                       │
│  ┌──────┬──────┬──────┬──────┐                                 │
│  │Size 6│Size 7│Size 8│Size 9│                                 │
│  │  3x  │  5x  │  Out │  2x  │                                 │
│  └──────┴──────┴──────┴──────┘                                 │
│                                                                 │
│  KOCHI                                                          │
│  ┌──────┬──────┬──────┬──────┐                                 │
│  │Size 6│Size 7│Size 8│Size 9│                                 │
│  │  2x  │  4x  │  3x  │  1x  │                                 │
│  └──────┴──────┴──────┴──────┘                                 │
│                                                                 │
│  KOZHIKODE                                                      │
│  ┌──────┬──────┬──────┬──────┐                                 │
│  │Size 6│Size 7│Size 8│Size 9│                                 │
│  │  1x  │  2x  │  Out │  2x  │                                 │
│  └──────┴──────┴──────┴──────┘                                 │
│                                                                 │
│  Legend:  [Green] = In Stock  [Gray] = Out of Stock            │
│                                                                 │
│                            [Close]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│      HEADER          │
└──────────────────────┘

┌──────────────────────┐
│   GALLERY            │
│  (Swipeable Images)  │
│  [Main Image]        │
│  [Thumb] [Thumb]     │
└──────────────────────┘

┌──────────────────────┐
│  PRODUCT INFO        │
│  Brand (Small)       │
│  Name (Bold)         │
│  Rating              │
│  Price Display       │
└──────────────────────┘

┌──────────────────────┐
│  SELECTION           │
│  Select Size:        │
│  [6] [7] [8] [9]    │
│  [10] [11] [12]     │
│                      │
│  Qty: [−] [1] [+]   │
└──────────────────────┘

┌──────────────────────┐
│  ACTIONS             │
│  [Add to Cart]       │
│  [Buy Now]           │
│  [Wishlist]          │
│  [Check Availability]│
└──────────────────────┘

┌──────────────────────┐
│  TRUST ELEMENTS      │
│  ✓ Free shipping     │
│  ✓ Easy returns      │
│  ✓ Secure            │
└──────────────────────┘

┌──────────────────────┐
│  DESCRIPTION TABS    │
│  [Desc] [Specs]      │
│  [Reviews]           │
│  Content scrollable  │
└──────────────────────┘

┌──────────────────────┐
│  RELATED PRODUCTS    │
│  (Carousel)          │
│  ← Product Product → │
└──────────────────────┘

┌──────────────────────┐
│      FOOTER          │
└──────────────────────┘
```

### Reusable Components
- Product Gallery (main + thumbnail carousel)
- Product Card (details section)
- Size Selector (button grid)
- Quantity Selector (+/−)
- CTA Buttons (Add to Cart, Buy Now)
- Review Card (with rating, text, helpfulness)
- Modal Overlay (availability)
- Related Products Carousel

---

## 4. SHOPPING CART PAGE

### Purpose
Display cart contents, allow quantity/item management, apply promotions, and facilitate checkout.

### Key User Actions
- View all items in cart
- Update quantities
- Remove items
- View item prices
- Apply coupon/promo code
- View order summary
- Proceed to checkout
- Continue shopping

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ ← Continue Shopping                           Your Shopping Cart │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  CART ITEMS (if not empty)   │   ORDER SUMMARY                 │
│                              │                                 │
│  ┌────────────────────────┐  │   Subtotal:  ₹XXXX              │
│  │ Product Image (small)  │  │   Discount:  -₹XXX              │
│  │                        │  │   Shipping:  ₹XX (Free)         │
│  │ Product Name           │  │   Tax:       ₹XXX               │
│  │ Brand · Category · Size│  │   ────────────────────          │
│  │ Color · SKU            │  │   TOTAL:     ₹XXXX              │
│  │                        │  │                                 │
│  │ Price: ₹XXX            │  │   PROMO CODE:                   │
│  │ Qty: [−] [1] [+]      │  │   [Enter Code]  [Apply]         │
│  │ Subtotal: ₹XXX         │  │                                 │
│  │                        │  │   ┌─────────────────────────┐   │
│  │ [Remove Item]          │  │   │[Proceed to Checkout]    │   │
│  │ [Move to Wishlist]     │  │   │ (Primary Button)        │   │
│  │ [Save for Later]       │  │   │ Continue Shopping →     │   │
│  │                        │  │   └─────────────────────────┘   │
│  └────────────────────────┘  │                                 │
│                              │   PAYMENT OPTIONS:              │
│  ┌────────────────────────┐  │   ☐ Credit/Debit Card          │
│  │ Product Image (small)  │  │   ☐ UPI                        │
│  │                        │  │   ☐ Wallet                     │
│  │ Product Name           │  │   ☐ Net Banking                │
│  │ Size · Qty [−][1][+]  │  │   ☐ COD                         │
│  │ Price: ₹XXX            │  │                                 │
│  │ [Remove] [Wishlist]    │  │   LOGIN TO UNLOCK:              │
│  └────────────────────────┘  │   ☐ Saved Addresses            │
│                              │   ☐ Faster Checkout            │
│  [Continue Shopping]         │   ☐ Order Tracking             │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RECOMMENDATIONS / RELATED PRODUCTS                             │
│  "Customers also bought..."                                    │
│  Product Card   Product Card   Product Card   Product Card     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EMPTY CART STATE (if applicable)                               │
│  🛒 Your cart is empty                                          │
│  Start shopping to add items to your cart                      │
│  [Continue Shopping]                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│      HEADER          │
│ ← Back | Cart        │
└──────────────────────┘

┌──────────────────────┐
│  ORDER SUMMARY       │
│  Subtotal: ₹XXXX     │
│  Discount: -₹XXX     │
│  Shipping: Free      │
│  Tax: ₹XXX           │
│  ─────────────────   │
│  TOTAL: ₹XXXX        │
│  ─────────────────   │
│  [Checkout]          │
└──────────────────────┘

┌──────────────────────┐
│  PROMO CODE          │
│  [Enter Code]        │
│  [Apply]             │
└──────────────────────┘

┌──────────────────────┐
│  CART ITEMS          │
│  ┌────────────────┐  │
│  │ Img │ Name     │  │
│  │     │ Size Qty │  │
│  │     │ Price    │  │
│  │     │ ✕ Remove │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Img │ Name     │  │
│  │     │ Size Qty │  │
│  │     │ Price    │  │
│  │     │ ✕ Remove │  │
│  └────────────────┘  │
│  [Add More Items]    │
└──────────────────────┘

┌──────────────────────┐
│  RECOMMENDATIONS     │
│  (Carousel)          │
│  ← Prod | Prod →     │
└──────────────────────┘

┌──────────────────────┐
│      FOOTER          │
└──────────────────────┘
```

### Reusable Components
- Cart Item Row (product info, quantity, price, actions)
- Order Summary Box
- Promo Code Input
- CTA Buttons
- Product Recommendation Carousel
- Empty State Illustration

---

## 5. CHECKOUT PAGE (Multi-Step)

### Purpose
Collect shipping, delivery, and payment information in a streamlined, secure process.

### Key User Actions
- Enter/select shipping address
- Choose delivery method
- Select payment method
- Review order summary
- Place order

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PROGRESS INDICATOR:                                             │
│ [1. Address] ──→ [2. Delivery] ──→ [3. Payment] ──→ [Review]   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  STEP 1: SHIPPING ADDRESS    │   ORDER SUMMARY (Sticky Right) │
│                              │                                 │
│  ☐ Use Saved Address         │   Items:                        │
│    ┌───────────────────────┐ │   1. Product Name    ₹XXX       │
│    │ Address 1 (Default)   │ │      Size S | Qty 1             │
│    │ [Edit] [Use This]     │ │                                 │
│    │                       │ │   2. Product Name    ₹XXX       │
│    │ Address 2             │ │      Size M | Qty 2             │
│    │ [Edit] [Use This]     │ │                                 │
│    └───────────────────────┘ │   Subtotal:         ₹XXXX       │
│                              │   Shipping:         Free         │
│  ☑ Add New Address           │   Tax:              ₹XXX        │
│  ┌───────────────────────┐   │   ────────────────────         │
│  │ First Name *          │   │   Total:            ₹XXXX       │
│  │ [________________]    │   │                                 │
│  │                       │   │                                 │
│  │ Phone *               │   │                                 │
│  │ [________________]    │   │                                 │
│  │                       │   │                                 │
│  │ Address Line 1 *      │   │                                 │
│  │ [________________]    │   │                                 │
│  │                       │   │                                 │
│  │ Address Line 2        │   │                                 │
│  │ [________________]    │   │                                 │
│  │                       │   │                                 │
│  │ City * [_____]        │   │                                 │
│  │ State * [_____]       │   │                                 │
│  │ Pincode * [_____]     │   │                                 │
│  │                       │   │                                 │
│  │ ☐ Set as Default     │   │                                 │
│  │                       │   │                                 │
│  │ [Save Address]        │   │                                 │
│  └───────────────────────┘   │                                 │
│                              │   [Continue to Delivery]        │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

─ STEP 2: DELIVERY METHOD ─

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  DELIVERY OPTIONS            │   ORDER SUMMARY                 │
│                              │   (same as above)               │
│  ☐ Home Delivery             │                                 │
│    Estimated: 3-5 Days      │                                 │
│    Shipping: Free            │                                 │
│                              │                                 │
│  ☐ Store Pickup              │                                 │
│    Select Store:             │                                 │
│    [Dropdown: Thrissur...]   │                                 │
│    Available: 1-2 Days       │                                 │
│                              │                                 │
│  ☐ Express Delivery          │                                 │
│    Next Day Delivery         │                                 │
│    Shipping: ₹299            │                                 │
│                              │                                 │
│  [Back] [Continue to Payment]│                                 │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

─ STEP 3: PAYMENT METHOD ─

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  PAYMENT OPTIONS             │   ORDER SUMMARY                 │
│                              │   (same as above)               │
│  ☐ Credit Card               │                                 │
│    [Card Number Input]       │                                 │
│    [Expiry] [CVV]            │                                 │
│    ☐ Save Card               │                                 │
│                              │                                 │
│  ☐ Debit Card                │                                 │
│    [Card Number Input]       │                                 │
│    [Expiry] [CVV]            │                                 │
│                              │                                 │
│  ☐ Net Banking               │                                 │
│    Select Bank: [Dropdown]   │                                 │
│                              │                                 │
│  ☐ UPI                       │                                 │
│    UPI ID: [_____________]   │                                 │
│                              │                                 │
│  ☑ Cash on Delivery (COD)    │                                 │
│    Pay when order arrives    │                                 │
│                              │                                 │
│  ☐ Wallet / Store Credit     │                                 │
│    Balance: ₹XXX             │                                 │
│                              │                                 │
│  BILLING ADDRESS:            │                                 │
│  ☐ Same as Shipping          │                                 │
│  ☐ Different Address         │                                 │
│                              │                                 │
│  [Back] [Review Order]       │                                 │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

─ STEP 4: ORDER REVIEW ─

┌──────────────────────────────┬─────────────────────────────────┐
│ Shipping Address:            │                                 │
│ Name                         │   ORDER SUMMARY                 │
│ Phone                        │                                 │
│ Full Address                 │   Items (as before)             │
│ [Change]                     │                                 │
│                              │                                 │
│ Delivery: Home Delivery      │   Address: [Show Address]       │
│ Estimated: 3-5 Days         │   Delivery: Home Delivery       │
│ [Change]                     │   Payment: COD                  │
│                              │                                 │
│ Payment: Cash on Delivery    │   Total:            ₹XXXX       │
│ [Change]                     │                                 │
│                              │   ☐ I agree to Terms           │
│ ☐ I accept Terms & Conditions│                                 │
│   [Link to T&C]              │   [Edit] [Place Order]          │
│                              │                                 │
│ [Back] [Place Order]         │                                 │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│      HEADER          │
│ Checkout            │
└──────────────────────┘

STEP 1: ADDRESS

┌──────────────────────┐
│ Progress: [■■□□]    │
│ Step 1 of 4          │
└──────────────────────┘

┌──────────────────────┐
│ ADDRESSES            │
│ ☐ Saved Address 1    │
│   [Use] [Edit]       │
│                      │
│ ☐ Saved Address 2    │
│   [Use] [Edit]       │
│                      │
│ ☑ Add New Address    │
│ [Form with Fields]   │
│ [Save Address]       │
│                      │
│ [Next]               │
└──────────────────────┘

STEP 2: DELIVERY

┌──────────────────────┐
│ Progress: [■■■□]    │
│ Step 2 of 4          │
│                      │
│ ☑ Home Delivery      │
│   (3-5 Days, Free)   │
│                      │
│ ☐ Store Pickup       │
│   [Select Store ▼]   │
│                      │
│ ☐ Express (₹299)     │
│                      │
│ [Back] [Next]        │
└──────────────────────┘

STEP 3: PAYMENT

┌──────────────────────┐
│ Progress: [■■■■]    │
│ Step 3 of 4          │
│                      │
│ ☐ Credit Card        │
│ ☐ Debit Card         │
│ ☐ Net Banking        │
│ ☐ UPI                │
│ ☑ Cash on Delivery   │
│ ☐ Wallet             │
│                      │
│ [Back] [Next]        │
└──────────────────────┘

STEP 4: REVIEW

┌──────────────────────┐
│ REVIEW ORDER         │
│                      │
│ Address:             │
│ [Show Address]       │
│ [Change]             │
│                      │
│ Items: 2 products    │
│ Product 1   ₹XXX     │
│ Product 2   ₹XXX     │
│                      │
│ Subtotal: ₹XXXX      │
│ Tax: ₹XXX            │
│ Total: ₹XXXX         │
│                      │
│ ☐ Terms Agreed       │
│                      │
│ [Back] [Place Order] │
└──────────────────────┘
```

### Reusable Components
- Progress Indicator (steps)
- Address Input Form
- Address Selection Card
- Delivery Option Radio Button
- Payment Method Radio Button
- Order Summary Card (sticky)
- CTA Buttons (Continue, Place Order)

---

## 6. ACCOUNT DASHBOARD

### Purpose
Provide customer with centralized access to orders, profile, addresses, and preferences.

### Key User Actions
- View order history
- Track orders
- Manage addresses
- Update profile
- Manage wishlist
- View notifications

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Welcome back, [Name]! | [Logout]                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┬─────────────────────────────────────────┐
│                      │                                         │
│  ACCOUNT MENU        │  DASHBOARD CONTENT AREA                │
│  (Left Sidebar)      │                                         │
│                      │  QUICK STATS (4 boxes in row):          │
│  ✓ Dashboard         │  ┌─────────┐ ┌─────────┐              │
│  • Orders            │  │  Total  │ │ Pending │              │
│  • Wishlist          │  │  Orders │ │ Orders  │              │
│  • Addresses         │  │    12   │ │    2    │              │
│  • Profile           │  └─────────┘ └─────────┘              │
│  • Preferences       │  ┌─────────┐ ┌─────────┐              │
│  • Loyalty Points    │  │ Wishlist│ │  Points │              │
│  • Notifications     │  │  Items  │ │ Balance │              │
│  • Support           │  │    5    │ │  2400   │              │
│  [Logout]            │  └─────────┘ └─────────┘              │
│                      │                                         │
│                      │  RECENT ORDERS:                         │
│                      │  Order #12345 | ₹2,499 | Delivered     │
│                      │  Order #12344 | ₹1,299 | In Transit    │
│                      │  Order #12343 | ₹3,599 | Processing    │
│                      │  [View All Orders]                      │
│                      │                                         │
│                      │  RECOMMENDATIONS:                       │
│                      │  "Based on your recent purchases"       │
│                      │  Product Card  Product Card  Prod Card │
│                      │                                         │
└──────────────────────┴─────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│  Welcome, [Name]     │
│  Account Dashboard   │
│  [Logout]            │
└──────────────────────┘

┌──────────────────────┐
│  ACCOUNT MENU        │
│  (Horizontal tabs)   │
│  [Orders] [Wishlist] │
│  [Addresses]         │
│  [Profile]           │
│  [Logout]            │
└──────────────────────┘

┌──────────────────────┐
│  QUICK STATS         │
│  ┌────────┬────────┐ │
│  │ Orders │Wishlist│ │
│  │   12   │   5    │ │
│  └────────┴────────┘ │
│  ┌────────┬────────┐ │
│  │ Points │Pending │ │
│  │ 2400   │   2    │ │
│  └────────┴────────┘ │
└──────────────────────┘

┌──────────────────────┐
│  RECENT ORDERS       │
│  Order #12345        │
│  ₹2,499 · Delivered  │
│  [Track]             │
│                      │
│  Order #12344        │
│  ₹1,299 · In Transit │
│  [Track]             │
│                      │
│  [View All]          │
└──────────────────────┘

┌──────────────────────┐
│  RECOMMENDATIONS     │
│  (Carousel)          │
│  ← Prod | Prod →     │
└──────────────────────┘
```

### Reusable Components
- Left Sidebar Menu
- Stat Card (quick info)
- Order Card (with status)
- Wishlist Item Card
- Address Card (edit/delete)
- Profile Form
- Notification Badge

---

## 7. STORE LOCATOR

### Purpose
Help customers find and visit physical stores with detailed information.

### Key User Actions
- View store locations on map
- Get store address & contact
- View store hours
- Check store inventory
- Get directions

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STORE LOCATOR                                                   │
│ "Visit our stores across Kerala"                               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  MAP SECTION (Left)          │  STORES LIST (Right)            │
│                              │                                 │
│  ┌──────────────────────┐   │  Filter by:                     │
│  │                      │   │  [City ▼]                       │
│  │    Google Map        │   │                                 │
│  │                      │   │  THRISSUR                       │
│  │  [Pin] [Pin] [Pin]   │   │  ┌───────────────────────────┐ │
│  │                      │   │  │ 📍 Shoebox Thrissur       │ │
│  │ [Current Location]   │   │  │ MG Road, Thrissur         │ │
│  │ [Zoom Controls]      │   │  │ Ph: +91 9876543210        │ │
│  │                      │   │  │                            │ │
│  │                      │   │  │ Hours: 10AM - 8PM         │ │
│  └──────────────────────┘   │  │ Today: Open               │ │
│                              │  │                            │ │
│                              │  │ [View Details] [Navigate] │ │
│                              │  └───────────────────────────┘ │
│                              │                                 │
│                              │  KOCHI                          │
│                              │  ┌───────────────────────────┐ │
│                              │  │ 📍 Shoebox Kochi          │ │
│                              │  │ Cochin Road, Kochi        │ │
│                              │  │ Ph: +91 9876543210        │ │
│                              │  │ Hours: 10AM - 8PM         │ │
│                              │  │ Today: Open               │ │
│                              │  │ [View Details] [Navigate] │ │
│                              │  └───────────────────────────┘ │
│                              │                                 │
│                              │  KOZHIKODE                      │
│                              │  ┌───────────────────────────┐ │
│                              │  │ 📍 Shoebox Kozhikode      │ │
│                              │  │ Calicut Road, Kozhikode   │ │
│                              │  │ Ph: +91 9876543210        │ │
│                              │  │ Hours: 10AM - 8PM         │ │
│                              │  │ Today: Closed             │ │
│                              │  │ [View Details] [Navigate] │ │
│                              │  └───────────────────────────┘ │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STORE DETAIL MODAL (When Clicked)                              │
│                                                                 │
│  Shoebox Thrissur                                              │
│                                                                 │
│  Address: MG Road, Thrissur 680001                             │
│  Phone: +91 9876543210                                         │
│  Email: thrissur@shoebox.com                                   │
│                                                                 │
│  Hours:                                                         │
│  Monday - Friday: 10 AM - 8 PM                                 │
│  Saturday - Sunday: 10 AM - 9 PM                               │
│                                                                 │
│  Available Inventory:                                          │
│  [Browse Store Inventory]                                      │
│                                                                 │
│  [Get Directions] [Call] [Email] [Close]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│ Store Locator        │
└──────────────────────┘

┌──────────────────────┐
│ [City Filter ▼]      │
└──────────────────────┘

┌──────────────────────┐
│ THRISSUR             │
│ ┌────────────────┐   │
│ │📍 Shoebox      │   │
│ │MG Road         │   │
│ │Ph: 987654...   │   │
│ │Hours: 10-8 PM  │   │
│ │Status: Open    │   │
│ │[Details][Nav]  │   │
│ └────────────────┘   │
│                      │
│ KOCHI                │
│ ┌────────────────┐   │
│ │📍 Shoebox      │   │
│ │Cochin Road     │   │
│ │Ph: 987654...   │   │
│ │Hours: 10-8 PM  │   │
│ │Status: Open    │   │
│ │[Details][Nav]  │   │
│ └────────────────┘   │
│                      │
│ KOZHIKODE            │
│ ┌────────────────┐   │
│ │📍 Shoebox      │   │
│ │Calicut Road    │   │
│ │Ph: 987654...   │   │
│ │Hours: 10-8 PM  │   │
│ │Status: Closed  │   │
│ │[Details][Nav]  │   │
│ └────────────────┘   │
└──────────────────────┘

┌──────────────────────┐
│ MAP (Click to expand)│
│ [Show Full Map]      │
└──────────────────────┘
```

### Reusable Components
- Google Map Embed
- Store Card (with info)
- Store Detail Modal
- Address Card
- Hours Display
- Contact Actions (Call, Email, Navigate)

---

## 8. BRANDS PAGE

### Purpose
Display all available brands and allow browsing/filtering by brand.

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                          HEADER                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ OUR BRANDS                                                      │
│ "Discover our curated collection of premium footwear brands"   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BRANDS GRID (6 per row)                                        │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ NIKE     │ │ ADIDAS   │ │ PUMA     │ │ SKECHERS │           │
│  │ Logo     │ │ Logo     │ │ Logo     │ │ Logo     │           │
│  │ (Image)  │ │ (Image)  │ │ (Image)  │ │ (Image)  │           │
│  │ 250+ items│ │ 180 items│ │ 95 items │ │ 150 items│          │
│  │ [Browse] │ │ [Browse] │ │ [Browse] │ │ [Browse] │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ NEW      │ │ BATA     │ │ FILA     │ │ REEBOK   │           │
│  │ BALANCE  │ │          │ │          │ │          │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│  [More Brands]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────┐
│ Our Brands           │
│ Browse all brands    │
└──────────────────────┘

┌──────────────────────┐
│ BRANDS (3 per row)   │
│ ┌────┬────┬────┐    │
│ │NIKE│ADI │PUMA│    │
│ │    │DAS │    │    │
│ │Logo│Logo│Logo│    │
│ │[B] │[B] │[B] │    │
│ └────┴────┴────┘    │
│ ┌────┬────┬────┐    │
│ │SKE │NB  │BATA│    │
│ │CHE │    │    │    │
│ │RES │    │    │    │
│ │[B] │[B] │[B] │    │
│ └────┴────┴────┘    │
│ [Load More]          │
└──────────────────────┘
```

---

## 9. ABOUT US PAGE

### Purpose
Build trust and convey brand story, values, and mission.

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    ABOUT SHOEBOX                                │
│              "Walk in Comfort, Step in Style"                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  OUR STORY                                                      │
│  [Hero Image - Company/Store Photo]                             │
│                                                                 │
│  Founded in 2015, Shoebox has been Kerala's trusted footwear    │
│  retailer with a mission to provide premium quality shoes...    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  OUR VALUES (3-column grid)                                     │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ QUALITY          │  │ CUSTOMER FIRST   │  │ INNOVATION   │  │
│  │ We hand-pick...  │  │ Your satisfaction│  │ Always ahead │  │
│  │                  │  │ is our priority..│  │ of trends... │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BY THE NUMBERS                                                 │
│                                                                 │
│  10,000+        50,000+        8+          100%                 │
│  Happy Customers Products     Years        Authentic            │
│  Nationwide      Sold          Experience  Products             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  OUR TEAM                                                       │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Photo    │  │ Photo    │  │ Photo    │  │ Photo    │        │
│  │ Name     │  │ Name     │  │ Name     │  │ Name     │        │
│  │ Title    │  │ Title    │  │ Title    │  │ Title    │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  AWARDS & RECOGNITION                                           │
│  [Award Logo] [Award Logo] [Award Logo]                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. CONTACT US PAGE

### Purpose
Provide multiple ways for customers to get in touch.

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                       CONTACT US                                │
│                  "We'd love to hear from you"                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────────────────────┐
│                              │                                 │
│  CONTACT FORM (Left)         │  CONTACT INFO (Right)           │
│                              │                                 │
│  Your Name *                 │  HEADQUARTERS                   │
│  [_______________________]   │  MG Road, Thrissur 680001       │
│                              │  Kerala, India                  │
│  Email *                     │                                 │
│  [_______________________]   │  GENERAL INQUIRIES              │
│                              │  Email: info@shoebox.com        │
│  Phone *                     │  Phone: +91 9876543210          │
│  [_______________________]   │                                 │
│                              │  SUPPORT                        │
│  Subject *                   │  Email: support@shoebox.com     │
│  [_______________________]   │  Hours: 10 AM - 6 PM IST        │
│                              │  (Monday - Saturday)            │
│  Message *                   │                                 │
│  [_______________________    │  FOLLOW US                      │
│   _______________________    │  f t i @ w                      │
│   _______________________]   │                                 │
│                              │  STORES                         │
│  ☐ I agree to Privacy Policy │  [View All Stores]              │
│                              │                                 │
│  [Send Message]              │                                 │
│                              │                                 │
│  Response Time: 24-48 hours  │                                 │
│                              │                                 │
└──────────────────────────────┴─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FAQ / HELP SECTION                                             │
│  [View FAQs] [Chat with Support] [Knowledge Base]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## COMMON REUSABLE COMPONENTS

### Navigation & Layout
- **Header** (Logo, Search, Account, Cart)
- **Footer** (Links, Copyright, Social)
- **Breadcrumb Navigation**
- **Sidebar Menu** (Collapsible on mobile)
- **Mobile Hamburger Menu**

### Product Display
- **Product Card** (with image, name, price, rating, quick-add)
- **Product Gallery** (main image + thumbnails)
- **Size Selector** (button grid)
- **Quantity Selector** (+/− buttons)
- **Price Display** (current, original, discount%)
- **Rating & Reviews Display**

### Forms & Input
- **Text Input** (first name, email, search)
- **Select Dropdown** (categories, cities, payment methods)
- **Radio Button Group** (address selection, delivery method)
- **Checkbox Group** (filters, terms)
- **Date Picker** (if needed)
- **Address Form**

### CTA & Actions
- **Primary Button** (Add to Cart, Proceed, Place Order)
- **Secondary Button** (Save, Learn More, Back)
- **Tertiary Button** (Cancel, Skip)
- **Icon Buttons** (Wishlist, Share, Remove)

### Informational
- **Alert / Toast** (success, error, warning)
- **Modal Popup** (availability, confirmation)
- **Badge** (New, Sale, Count)
- **Progress Indicator** (checkout steps)
- **Status Badge** (In Stock, Out of Stock, Delivered)

### Cards & Containers
- **Product Card**
- **Store Card**
- **Order Card**
- **Address Card**
- **Review Card**
- **Testimonial Card**
- **Category Card**
- **Brand Card**

---

## DESIGN SYSTEM STANDARDS

### Typography
- **Headings**: Bold, Large (H1: 28px+, H2: 24px, H3: 18px)
- **Body**: Regular, Readable (14px-16px)
- **Captions**: Small, Secondary (12px-13px)

### Color Palette
- **Primary**: Black (#000) for emphasis
- **Secondary**: Gray (#666) for secondary text
- **Accent**: Green (#4CAF50) for in-stock / success
- **Background**: Light Gray (#F8F8F8)
- **Border**: Light Gray (#DDD, #EEE)

### Spacing
- **Margin**: 8px, 12px, 16px, 24px, 32px
- **Padding**: 8px, 12px, 16px, 20px, 24px

### Responsive Breakpoints
- **Desktop**: 1400px+
- **Tablet**: 768px - 1399px
- **Mobile**: < 768px

---

**End of Wireframes Documentation**

All wireframes follow mobile-first responsive design principles and are optimized for accessibility.
