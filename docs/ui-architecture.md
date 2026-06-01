# Shoebox UI Architecture

## Overview

Shoebox is a modern, premium yet approachable multi-store footwear retailer in Kerala. This UI architecture document defines a single source of truth for the frontend design system, reusable components, page templates, and responsive behavior.

Design Direction
- Premium but approachable
- Modern
- Clean
- Fast
- Mobile-first

Inspired by brands like Nike, Adidas, Foot Locker, Allbirds, and Zappos, Shoebox should feel polished and accessible without copying any existing website.

---

## Design System

### Typography

Font family
- Primary: `Inter` (or `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif`)
- Accent / display: `Clash Display` or a refined modern sans-serif for hero headings

Heading hierarchy
- `H1` – 48px / 42px on tablet / 36px on mobile – heavy, strong visual anchor for hero and page titles
- `H2` – 34px / 30px on tablet / 28px on mobile – section headings and major content divisions
- `H3` – 26px / 24px on tablet / 22px on mobile – card titles, subsection headers
- `H4` – 22px / 20px on tablet / 18px on mobile – detail labels, smaller section titles
- `H5` – 18px / 16px – tertiary headings, form labels, footer headings
- `H6` – 16px / 14px – micro headings, metadata, captions

Body text sizes
- Body Large: 18px / 16px on mobile – primary body copy, product descriptions
- Body Base: 16px / 15px on mobile – standard paragraph text, form text
- Body Small: 14px – supporting text, secondary details, disclaimers
- Caption: 12px – labels, badges, auxiliary text

### Color Palette

Primary
- `#1C2530` – deep blue-grey, main brand anchor
- `#2E7D9D` – supporting teal accent for primary interaction states

Secondary
- `#F2F2F5` – soft off-white background
- `#E6EBF2` – light neutral surface
- `#B0BEC5` – muted grey for secondary surfaces and borders

Accent
- `#F08C4A` – warm muted orange for CTA emphasis and highlight states
- `#4C9F70` – fresh green accent for premium signals and subtle emphasis

Success
- `#2E7D32` – strong green for confirmations
- `#C8E6C9` – soft green background for success containers

Warning
- `#F9A825` – amber for caution states
- `#FFF8E1` – warm yellow background for alerts

Error
- `#D32F2F` – vivid red for errors and destructive actions
- `#FFEBEE` – soft red background for validation messages

Neutral scale
- `Neutral 900` – `#111827`
- `Neutral 800` – `#1F2937`
- `Neutral 700` – `#374151`
- `Neutral 600` – `#4B5563`
- `Neutral 500` – `#6B7280`
- `Neutral 400` – `#9CA3AF`
- `Neutral 300` – `#D1D5DB`
- `Neutral 200` – `#E5E7EB`
- `Neutral 100` – `#F3F4F6`
- `Neutral 50` – `#F9FAFB`

### Spacing System

- `XS` – 8px
- `SM` – 16px
- `MD` – 24px
- `LG` – 32px
- `XL` – 48px

Use a modular spacing scale based on multiples of 8 for consistent padding, margins, and gaps.

### Border Radius

- `radius-sm` – 6px (inputs, pills, small buttons)
- `radius-md` – 12px (cards, overlays, modals)
- `radius-lg` – 20px (hero banners, large surface containers)

### Shadow System

- `shadow-sm` – `0 1px 4px rgba(17, 24, 39, 0.06)`
- `shadow-md` – `0 4px 12px rgba(17, 24, 39, 0.08)`
- `shadow-lg` – `0 8px 24px rgba(17, 24, 39, 0.12)`

Use subtle elevation for cards, modals, and floating actions to keep the interface clean and fast.

---

## Component Inventory

### Header

Structure
- Brand logo / home link
- Primary search field with quick results
- Main navigation links: Shop, Brands, Stores, Account
- Cart icon with badge count
- Mobile menu trigger visible on small screens

Behavior
- Sticky minimal header on scroll for desktop
- Condensed height on mobile
- Emphasize search on mobile-first experience

### Mobile Navigation

Structure
- Slide-in drawer or full-screen overlay
- Top section with logo and close action
- Navigation links grouped by category and utility
- Quick access: Shop, Categories, Brands, Stores, Account, Cart
- Bottom area with channels: Customer support, language/currency if applicable

Behavior
- Open from hamburger icon
- Use full-height overlay with clear tap targets
- Dismiss with outside tap or close button

### Footer

Structure
- Brand mark and short brand statement
- Quick links: Shop, Categories, Brands, Stores, Help
- Contact / support info and store hours
- Social icons and trust indicators
- Newsletter subscription field

Behavior
- Clean layout with clear hierarchy
- Use compact stacked layout on mobile

### Buttons

Primary
- Solid background in primary accent or deep brand color
- White text, strong call to action
- Example: `Add to Cart`, `Shop Now`

Secondary
- Neutral background with dark text or subtle border
- Use for secondary actions and soft CTAs
- Example: `View Details`, `Continue Shopping`

Outline
- Transparent background with border and primary color text
- Use for tertiary actions or alternate flows
- Example: `See Store Availability`, `Compare`

State styles
- Normal, hover, active, disabled
- Focus ring using accent or brand color for accessibility

### Forms

Inputs
- Single-line fields with clear labels and helper text
- Rounded corners and subtle border
- Input states: default, focus, error, disabled

Selects
- Modern dropdown with custom appearance
- Support for search inside select if needed for size, store, or filters
- Use center-aligned arrow and clear selected value

Checkboxes
- Square or rounded checkboxes with accessible touch area
- Clear checked / unchecked / disabled states
- Use indicator color for selected state

### Cards

Product Card
- Image or product tile
- Product title, brand, price, badge/status
- Add to cart or quick view action on hover / tap
- Secondary details: rating, color options

Category Card
- Category image, name, short tagline
- Clear CTA to shop category

Brand Card
- Brand logo centered on neutral surface
- Optional brand descriptor: premium, sport, lifestyle

Store Card
- Store name, location, hours, distance
- Store pickup availability and CTA

Review Card
- Star rating, review headline, reviewer name
- Body text summary, date, optional image or pros list

### Badges

Sale
- Bold label with accent red or orange
- Example: `SALE`, `-20%`

New Arrival
- Soft highlight with accent green or orange
- Example: `NEW`, `New Arrival`

Out of Stock
- Desaturated neutral background with strong text
- Example: `Sold Out`, `Out of Stock`

Badge behavior
- Use badges sparingly to maintain premium feel
- Combine with product cards and quick promotions

### Modals

Store Availability
- Show nearby store inventory and pickup options
- Include store address, availability status, and CTA to reserve or check stock
- Close with clear action and overlay

Quick View
- Lightweight product preview with image, price, size selector, and add to cart
- Use simplified product details and fast interactions
- Dismiss with close action or outside tap

### Product Components

Product Gallery
- Primary product image with thumbnail strip or dot navigation
- Support zoom on desktop and swipe gestures on mobile
- Use a clean borderless frame and minimal controls

Size Selector
- Grid or pill buttons with size labels
- Clear selected / unavailable states
- Show guidance for fit and size notes when available

Quantity Selector
- Compact stepper with minus / plus controls and manual entry
- Validate min / max stock

Price Block
- Primary price, sale price, and discount label
- Supporting text: inclusive of taxes, EMI preview, limited-time offer

---

## Page Templates

### Home

Structure
- Hero banner with strong product and lifestyle imagery
- Featured categories and curated collections
- Promotional deck highlighting fast delivery, store pickup, and trusted service
- Featured products and supported brands
- Testimonials or trust signals
- Store locator preview and CTA
- Footer with quick links and support

Focus
- Convert browsers into shoppers
- Show premium product range without visual clutter
- Highlight local presence and store convenience

### Shop

Structure
- Top filters bar with search, sort, and active filter chips
- Product listing grid with responsive card arrangement
- Sidebars on desktop for category and brand filters
- Sticky filter summary and clear actions

Focus
- Fast browsing and discovery
- Help customers refine results quickly with minimal friction

### Category Page

Structure
- Category hero banner or breadcrumb path
- Category description and top subcategories
- Product grid under category header
- Filters for size, brand, price, color, availability
- Related category quick-links

Focus
- Guide shoppers to product sets that match their intent
- Keep product tiles and filters visible on scroll

### Product Page

Structure
- Product gallery and main image area
- Product title, brand, rating, price block
- Size selector, quantity selector, add to cart, buy now
- Delivery / store pickup details, promotions, and stock badges
- Product details, specifications, reviews, and related products
- Quick access to store availability modal

Focus
- Clear purchase path and confidence-building details
- Fast, mobile-friendly ordering process

### Cart

Structure
- Cart item list with product card preview, size, quantity controls, price
- Order summary panel with subtotal, discounts, shipping estimate, totals
- Promo code input and continue shopping link
- CTA to proceed to checkout

Focus
- Easy item management and clear totals
- Keep actions visible for update and checkout

### Checkout

Structure
- Multi-step or single-page progress with address, delivery, and payment
- Clear section headings and compact form layout
- Order summary visible on larger screens
- Validation feedback and secure payment reassurance

Focus
- Reduce friction and maintain trust through checkout
- Use concise fields and persistent summary information

### Account Dashboard

Structure
- Welcome header with account summary
- Order history cards and quick actions
- Saved addresses and payment methods
- Wishlist / saved items and account settings

Focus
- Provide customers fast access to order status and repeat purchase flows
- Keep account controls simple and scannable

### Store Locator

Structure
- Search by city or area with result cards
- Map view and list view toggle on desktop
- Store card details including pickup availability and hours

Focus
- Support local store discovery and pickup options
- Make store selection fast on mobile and desktop

### Brands

Structure
- Brand grid with logo cards and category tags
- Featured brand stories or collections
- Filters to browse brands by category or style

Focus
- Showcase brand partnerships and allow customers to shop by label
- Keep the interface premium and product-forward

---

## Responsive Rules

Breakpoints
- Desktop: `1200px+`
- Tablet: `768px–1199px`
- Mobile: `< 768px`

### Navigation behavior

Desktop
- Horizontal top navigation with visible links and search
- Sticky header and compact user actions

Tablet
- Simplified header with condensed links and persistent search icon
- Use dropdowns, offcanvas categories, or a compact menu

Mobile
- Primary navigation inside a slide-in drawer or bottom sheet
- Search accessible from top bar or full-screen overlay
- Minimize header height and keep cart/account actions easy to tap

### Grid behavior

Desktop
- Product grid: 4 or 5 columns depending on content density
- Cards aligned with gutter spacing from the spacing system

Tablet
- Product grid: 2 or 3 columns for balanced readability
- Stack non-grid content sections where necessary

Mobile
- Product grid: 1 or 2 columns
- Use full-width cards for product hierarchy and easy tapping

### Filter behavior

Desktop
- Side panel filters with sticky or fixed position within the shop flow
- Active filter chips visible above the grid

Tablet
- Collapsible filter panel or top filter drawer
- Keep key filters visible and easy to update

Mobile
- Full-screen filter drawer or bottom sheet
- Use groups and clear apply/reset actions
- Preserve selected filters as chips in the product header

---

## Goal

This UI architecture document is the single source of truth for Shoebox frontend design and development. It captures the core design system, component library, layout patterns, and responsive rules needed to build a premium, modern footwear shopping experience that is clean, fast, and mobile-first.
