# Content Management Guide

This guide shows you where to edit different sections of your website in Sanity Studio.

**Studio URL:** https://fjordhjem-studio.sanity.studio

---

## About Section

### Editable Fields:
- **Label** - Section label (default: "Your Retreat")
- **Heading** - Main heading (default: "Your Hygge Escape on Hood Canal")
- **Description** - Main paragraph text
- **Photo Carousel** - Images that rotate in the carousel
- **Features Grid** - The 2x2 grid showing:
  - Sleeps 6
  - 2 Full Baths
  - Mountain & Water Views
  - Beach Access

**How to edit:**
1. Go to Studio → About Section
2. Scroll down to "Features Grid"
3. Click "+ Add item" to add a feature, or click existing items to edit
4. Each feature has:
   - **Feature Title** (e.g., "Sleeps 6")
   - **Feature Description** (e.g., "The more the cozier")

---

## Location Section

### Main Section Fields:
- **Label** - Section label (default: "Location")
- **Heading** - Main heading (default: "Tucked Away, But Not Too Far")
- **Intro** - Opening paragraph

### Location Points:
These are the detailed attraction descriptions that appear below the intro paragraph.

**How to edit:**
1. Go to Studio → Location Section to edit the main heading and intro
2. Go to Studio → Location Points to edit individual attractions
3. Each Location Point has:
   - **Location Name** (e.g., "Twanoh Falls State Park")
   - **Distance** (e.g., "5 min")
   - **Description** (full paragraph about the location)
   - **Display Order** (number to control order)

**Current Location Points:**
1. Twanoh Falls State Park (5 min)
2. Union & Alderbrook Resort (10 min south)
3. Belfair (10 min north)
4. Lake Cushman (20 min)
5. Mt. Ellinor Trail (30 min)
6. Olympic National Park (45-60 min)

---

## All Content Sections

| Section | Where to Edit | What You Can Change |
|---------|--------------|---------------------|
| **Hero** | Hero Section | Title, subtitle, background image |
| **About** | About Section | Label, heading, description, photos, features grid |
| **Experience** | Experience Section + Experience Cards | Section heading + individual experience cards |
| **Location** | Location Section + Location Points | Intro text + individual location details |
| **Gallery** | Gallery Section | Photo collections with different sizes |
| **Booking** | Booking Section | Label, heading, description, button text & URL |

---

## Making Changes

### To Update Content:
1. Log into https://fjordhjem-studio.sanity.studio
2. Navigate to the section you want to edit
3. Make your changes
4. Click **Publish** in the top right
5. Changes appear on your website within 30-60 seconds

### To Add Photos:
1. Go to **Media** tab in the left sidebar
2. Drag and drop multiple photos to upload
3. Go back to the section where you want to add them
4. Click "+ Add item" and select from your uploaded media

### To Reorder Items:
- **Location Points**: Edit the "Display Order" number (lower = appears first)
- **Experience Cards**: Edit the "Order" number
- **Gallery Photos**: Drag and drop to reorder within the collection

---

## Troubleshooting

### Changes not appearing on website?
1. Make sure you clicked **Publish** (not just Save as draft)
2. Wait 30-60 seconds for cache to clear
3. Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
4. Check browser console for errors

### Can't find a field?
- Some content sections are split between the main section and individual items (like Location Section + Location Points)
- Check both the main section document and the related collection

---

## Recent Fixes (2026-01-26)

✅ **Added Features Grid to About Section**
- You can now edit "Sleeps 6", "2 Full Baths", etc.
- Located in About Section → Features Grid

✅ **Added Descriptions to Location Points**
- You can now edit the full descriptions for each attraction
- Located in Location Points → individual documents

✅ **Migrated Existing Content**
- All hardcoded HTML content has been migrated to Sanity
- Everything is now editable through the Studio
