# Hardcoded Content Audit

This document lists all hardcoded content found in index.html that is NOT editable through Sanity CMS.

---

## ❌ Hardcoded Content (Needs Sanity Fields)

### 1. Hero Section
**Location:** Lines 51-72

**Hardcoded:**
- ✅ Hero title (editable)
- ✅ Hero subtitle (editable)
- ✅ Background image (editable)
- ❌ Primary button text: "Check Availability"
- ❌ Primary button URL: "#book"
- ❌ Secondary button text: "Come explore"
- ❌ Secondary button URL: "#about"
- ❌ Scroll indicator text: "Scroll to explore"

---

### 2. Banner Carousel
**Location:** Lines 74-107

**Hardcoded:**
- ❌ All carousel images (hardcoded paths)
- ❌ No Sanity schema exists for this section

**Current images:**
- `images/exterior/house-front-redfin.jpg`
- `images/exterior/house-back.jpg`
- `images/exterior/porch-swing-leaves.jpg`
- `images/interior/desk.jpg`

---

### 3. Booking Section
**Location:** Lines 320-351

**Current Sanity schema has:**
- ✅ Label
- ✅ Heading
- ✅ Description
- ✅ Button text (single)
- ✅ Button URL (single)

**Hardcoded:**
- ❌ Airbnb button text: "View on Airbnb"
- ❌ Airbnb URL: "#"
- ❌ VRBO button text: "View on VRBO"
- ❌ VRBO URL: "#"
- ❌ Contact question text: "Questions about your stay?"
- ❌ Contact email: (currently obfuscated by Cloudflare)

**Note:** Current schema only supports ONE button, but HTML has TWO (Airbnb + VRBO)

---

### 4. Footer
**Location:** Lines 354-375

**Hardcoded:**
- ❌ Brand name: "Fjordhjem"
- ❌ Location text: "Hood Canal, Washington"
- ❌ Footer navigation links (duplicates main nav)
- ❌ Copyright text: "© 2025 Fjordhjem. All rights reserved."

---

### 5. Navigation
**Location:** Lines 33-49

**Hardcoded:**
- ❌ Logo text: "Fjordhjem"
- ❌ Nav link labels: "About", "Experience", "Location", "Gallery", "Book Now"
- ❌ Nav link URLs: "#about", "#experience", "#location", "#gallery", "#book"

**Note:** These could be made editable, but since they're structural navigation, it might be reasonable to keep them hardcoded unless you need flexibility to change section names/order.

---

## Summary by Priority

### HIGH Priority (User-facing content that should be editable):
1. **Hero buttons** - Primary/secondary CTA buttons with text & URLs
2. **Banner carousel** - Image carousel needs full Sanity management
3. **Booking buttons** - Airbnb & VRBO buttons need separate fields
4. **Contact info** - Email address should be editable

### MEDIUM Priority (Site metadata):
5. **Footer content** - Brand name, location, copyright
6. **Scroll indicator** - "Scroll to explore" text

### LOW Priority (Structural elements):
7. **Navigation** - Could make editable for flexibility, but may not be necessary

---

## Recommended Fixes

### 1. Update Hero Schema
Add fields for:
- Primary button text & URL
- Secondary button text & URL
- Scroll indicator text (optional)

### 2. Create Banner Carousel Schema
New schema for managing the banner carousel images

### 3. Update Booking Schema
Replace single button with:
- Airbnb button text & URL
- VRBO button text & URL
- Contact question text
- Contact email

### 4. Create Site Settings Schema (optional)
For global site settings:
- Site name
- Footer location text
- Footer copyright text
- Nav logo text
