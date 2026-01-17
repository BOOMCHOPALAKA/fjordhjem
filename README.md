# Fjordhjem - Hood Canal Vacation Rental Website

A modern, responsive landing page for your Hood Canal vacation rental property built with clean HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Modern Aesthetic**: Clean Scandinavian-inspired design with elegant typography
- **Smooth Animations**: Scroll-triggered animations and smooth transitions
- **Image Gallery**: Full-screen lightbox gallery for photo viewing
- **Fast Loading**: Optimized images and lazy loading
- **SEO Friendly**: Semantic HTML with proper meta tags

## Project Structure

```
fjordhjem/
├── index.html          # Main HTML file
├── styles.css          # All CSS styling
├── script.js           # JavaScript for interactions
├── images/             # All property photos
│   ├── hero.jpg
│   ├── cabin-view.jpg
│   ├── mountains-sunset.jpg
│   └── ... (other images)
└── README.md           # This file
```

## Deployment Instructions

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it `fjordhjem` (or whatever you prefer)
4. Keep it Public or Private (your choice)
5. Don't initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Upload Your Files to GitHub

**Option A: Using GitHub's Web Interface (Easiest)**

1. On your new repository page, click "uploading an existing file"
2. Drag and drop ALL files from the fjordhjem folder (index.html, styles.css, script.js, and the entire images folder)
3. Write a commit message like "Initial site upload"
4. Click "Commit changes"

**Option B: Using Git Command Line**

```bash
cd fjordhjem
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/fjordhjem.git
git push -u origin main
```

### Step 3: Deploy to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Sign in or create a Cloudflare account
3. Click "Create a project"
4. Click "Connect to Git"
5. Authorize Cloudflare to access your GitHub account
6. Select the `fjordhjem` repository
7. Configure build settings:
   - **Project name**: fjordhjem (or your preferred subdomain)
   - **Production branch**: main
   - **Build command**: (leave empty)
   - **Build output directory**: / (or leave empty)
8. Click "Save and Deploy"

Your site will be live in about 1-2 minutes at: `https://fjordhjem.pages.dev`

### Step 4: Connect Your Custom Domain

1. In Cloudflare Pages, go to your project
2. Click the "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter `fjordhjem.com`
5. Follow the DNS instructions:
   - If your domain is NOT on Cloudflare:
     - Add a CNAME record pointing to `fjordhjem.pages.dev`
   - If your domain IS on Cloudflare:
     - The DNS will be configured automatically
6. Wait for DNS propagation (can take a few minutes to 24 hours)

## Customization Guide

### Adding Your Booking Links

Edit `index.html` and find the booking section (around line 200). Replace the `#` in the href attributes with your actual Airbnb and VRBO URLs:

```html
<a href="YOUR_AIRBNB_URL" class="btn-booking airbnb" target="_blank" rel="noopener">
    View on Airbnb
</a>

<a href="YOUR_VRBO_URL" class="btn-booking vrbo" target="_blank" rel="noopener">
    View on VRBO
</a>
```

### Updating Contact Email

Replace `hello@fjordhjem.com` with your actual email address (line ~210 in index.html):

```html
<a href="mailto:your-email@example.com" class="contact-link">your-email@example.com</a>
```

### Changing Text Content

All text is in `index.html`. Simply find the section you want to update and modify the text between the HTML tags. The structure is:

- **Hero Section**: Lines 30-50
- **About Section**: Lines 60-95
- **Experience Section**: Lines 100-145
- **Gallery Section**: Lines 150-170
- **Location Section**: Lines 175-200
- **Booking Section**: Lines 205-230

### Replacing Images

To replace any image:

1. Add your new image to the `images/` folder
2. Update the `src` attribute in `index.html` to point to your new image
3. Keep the same filename for easy replacement, or update the HTML reference

Example:
```html
<img src="images/your-new-photo.jpg" alt="Descriptive text" loading="lazy">
```

### Adjusting Colors

Colors are defined as CSS variables in `styles.css` (lines 1-15). Change these values to update the entire site's color scheme:

```css
:root {
    --color-dark: #1a2332;      /* Main dark color */
    --color-blue: #4a6fa5;      /* Accent blue */
    --color-warm: #f5f1e8;      /* Background warm tone */
    /* ... other colors ... */
}
```

## Making Updates

After your initial deployment, any changes you push to GitHub will automatically trigger a new deployment on Cloudflare Pages.

**Using GitHub Web Interface:**
1. Navigate to the file you want to edit
2. Click the pencil icon
3. Make your changes
4. Commit the changes
5. Wait ~1 minute for Cloudflare to redeploy

**Using Git:**
```bash
# Make your changes to files
git add .
git commit -m "Updated booking links"
git push
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images
- Lazy loading for below-the-fold images
- Minimal JavaScript
- Fast CDN delivery via Cloudflare

## Support

If you run into issues deploying:
- Check [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Check [GitHub docs](https://docs.github.com/)
- Verify all files uploaded correctly to your repository

## License

This is your website - use it however you'd like!

---

Built with ❤️ for your Hood Canal retreat.
