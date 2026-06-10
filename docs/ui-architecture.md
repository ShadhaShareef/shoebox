# Shoebox UI Architecture v2

## Overview

Shoebox is a modern footwear retailer built around a simple idea:

**Every great pair starts with a box.**

Rather than presenting products as a traditional ecommerce catalog, Shoebox uses the shoebox itself as a core visual and interaction element throughout the experience.

This document serves as the single source of truth for frontend design, component architecture, branding, page layouts, and responsive behavior.

---

# Brand Identity

## Core Concept

Shoebox is not simply a shoe store.

It is the experience of discovering what is inside the box.

The design language should consistently reinforce:

* Discovery
* Unboxing
* Anticipation
* Premium presentation
* Clean modern shopping

Users should repeatedly encounter subtle references to shoeboxes through visuals, layouts, micro-interactions, empty states, and navigation.

---

# Design Direction

### Brand Personality

* Premium
* Modern
* Confident
* Playful
* Memorable
* Mobile-first

### Inspiration

Inspired by:

* Nike
* Allbirds
* On Running
* Foot Locker

However, Shoebox should establish its own identity through its "Open The Box" experience.

---

# Visual Language

## Core Design Motif

The shoebox becomes a recurring UI element.

Applications:

* Hero sections
* Category cards
* Empty states
* Cart page
* Order tracking
* Loading animations
* Promotional sections

---

# Color System

## Primary

* #111827

Primary dark surface and brand anchor.

## Secondary

* #F8F7F3

Warm off-white background.

## Accent

* #FF7A45

Primary call-to-action color.

## Success

* #4C9F70

Stock indicators and confirmations.

## Neutral Scale

Use Tailwind neutral palette for text hierarchy and surfaces.

---

# Typography

## Primary Font

Inter

## Display Font

Clash Display

Used for:

* Hero headings
* Promotional banners
* Collection highlights

---

# Motion Principles

Animations should feel premium and subtle.

Avoid:

* Bouncy effects
* Excessive motion
* Cartoon transitions

Preferred:

* Smooth fades
* Slight scaling
* Floating cards
* Soft parallax
* Shoebox opening interactions

---

# Homepage

## Hero Section

### Goal

Immediately explain the brand.

### Layout

Large shoebox visual.

Initial state:

Closed shoebox.

Interaction:

Shoebox opens and reveals featured collection.

Headline:

"What's Inside Your Next Pair?"

or

"Every Great Pair Starts With A Box."

CTA:

* Open The Box
* Shop Collection

---

## Why Shoebox

Three value cards:

### Curated Brands

Premium footwear collections.

### Fast Delivery

Quick shipping across Kerala.

### Store Pickup

Reserve and collect from nearby stores.

---

## Fresh Out Of The Box

Featured product section.

Purpose:

Replace generic "Featured Products".

Visual behavior:

Products appear elevated from subtle box-inspired containers.

---

## Shop By Box

Category exploration.

Categories become premium box cards:

* Running
* Sneakers
* Casual
* Formal
* Lifestyle

Hover interaction:

Subtle lid-opening animation.

---

## Top Brands

Brand showcase carousel.

Supported brands:

* Nike
* Adidas
* Puma
* Skechers
* New Balance

---

## Store Locator Preview

Headline:

"Find A Shoebox Near You"

Quick access to store locations.

---

# Shop Page

## Structure

Top:

* Search
* Sort
* Active filters

Desktop:

* Sticky filter sidebar

Mobile:

* Full-screen filter drawer

Product grid:

* 4 columns desktop
* 2 columns tablet
* 2 columns mobile

---

# Product Page

## Layout

Two-column layout.

Left:

* Product gallery
* Image zoom

Right:

* Product title
* Brand
* Rating
* Price
* Size selector
* Quantity selector

Actions:

* Add To Cart
* Buy Now
* Wishlist

---

## Store Availability

Modal showing:

* Store inventory
* Available sizes
* Pickup options

Live inventory pulled from backend API.

---

## Product Tabs

* Description
* Specifications
* Reviews

---

# Cart Page

## Naming

Use Shoebox terminology.

Page title:

"Your Shoebox"

instead of

"Shopping Cart"

---

## Layout

Left:

Cart items

Right:

Order summary

* Subtotal
* Shipping
* Discount
* Total

CTA:

"Proceed To Checkout"

Optional secondary copy:

"Seal The Box"

---

# Checkout Page

## Sections

### Delivery Details

* First Name
* Last Name
* Phone
* Address Line 1
* Address Line 2
* City
* State
* Pincode

### Delivery Method

* Home Delivery
* Store Pickup
* Express Delivery

### Payment Method

* Cash On Delivery
* UPI
* Card

### Order Summary

Persistent summary card.

Desktop:

Sticky sidebar.

Mobile:

Bottom summary drawer.

---

# Order Success

Replace generic success screen.

Headline:

"Your Shoebox Is On The Way"

Visual:

📦 → 🚚 → 🏠

Display:

* Order number
* Estimated delivery
* Track order button

---

# Empty States

## Cart Empty

Illustrated shoebox.

Message:

"This box feels a little empty."

CTA:

"Discover New Arrivals"

## Wishlist Empty

Message:

"Save your favorite pairs here."

---

# Components

## Existing Components

* Header
* Footer
* Button
* Input
* Select
* Checkbox
* Modal
* Tabs
* Pagination

## Cards

* Product Card
* Category Card
* Brand Card
* Store Card
* Review Card

## Product Components

* Product Gallery
* Price Block
* Size Selector
* Quantity Selector

---

# Responsive Strategy

## Desktop

1200px+

* Expanded navigation
* Sticky filters
* Multi-column layouts

## Tablet

768px–1199px

* Condensed navigation
* Collapsible filters

## Mobile

Below 768px

* Drawer navigation
* Bottom sheet filters
* Optimized touch targets
* Simplified layouts

---

# Goal

Create a footwear shopping experience that users remember.

Shoebox should feel less like a generic ecommerce website and more like an interactive brand built around the excitement of opening a new box and discovering the perfect pair inside.
