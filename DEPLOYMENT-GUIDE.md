# Fjordhjem Production Deployment Guide

## Overview
Your Fjordhjem website consists of two parts that need to be deployed:
1. **Sanity Studio** (CMS interface) - Deploy to Sanity's hosting
2. **Frontend Website** - Auto-deploys via Cloudflare Pages

---

## Part 1: Deploy Sanity Studio

### Step 1: Login to Sanity CLI

From your project directory, run:

```bash
cd "/Users/chop/Software Dev/Repos/fjordhjem/studio"
npx sanity login
```

This will open an interactive prompt. Choose your preferred authentication method:
- **Google** (recommended for quick setup)
- **GitHub**
- **E-mail / password**

After selecting, your browser will open. Complete the authentication flow, then return to your terminal.

### Step 2: Deploy the Studio

Once logged in, deploy with:

```bash
npm run deploy
```

When prompted for a hostname, use: **`fjordhjem-studio`**

This will deploy your Sanity Studio to:
```
https://fjordhjem-studio.sanity.studio
```

### Step 3: Configure CORS for Production

After deployment, you need to allow your production website to access Sanity's API:

1. Go to https://www.sanity.io/manage
2. Select your "Fjordhjem" project
3. Click **API** in the left sidebar
4. Scroll to **CORS Origins**
5. Click **Add CORS origin**
6. Add your production domain (e.g., `https://fjordhjem.pages.dev` or your custom domain)
7. Check **Allow credentials**
8. Click **Save**

---

## Part 2: Frontend Deployment

### Automatic Deployment via Cloudflare Pages

Your frontend is configured to auto-deploy through Cloudflare Pages when you push to GitHub.

**✅ Latest changes already pushed!**
- Commit: `e53aab6` - "Add Sanity CLI configuration file for deployment"
- Previous commit: `394fcc5` - "Migrate CMS from Payload to Sanity and add gallery management"

### Check Deployment Status

1. Go to your Cloudflare dashboard
2. Navigate to **Pages** section
3. Find your **fjordhjem** project
4. You should see a deployment in progress or recently completed

### Your Production URLs

After deployment completes:
- **Website**: `https://fjordhjem.pages.dev` (or your custom domain if configured)
- **Sanity Studio**: `https://fjordhjem-studio.sanity.studio`

---

## Verification Checklist

Once both deployments are complete, verify:

- [ ] Sanity Studio loads at production URL
- [ ] You can log in to the Studio
- [ ] Frontend website loads at production URL
- [ ] Hero image displays correctly on both desktop and mobile
- [ ] Photo carousel works in About section
- [ ] Experience cards load with images
- [ ] Gallery section displays all photo collections
- [ ] All content changes in Sanity appear on the website (may take 30-60 seconds)

---

## Troubleshooting

### "Content not loading" on production website

**Problem**: Website loads but content from Sanity doesn't appear

**Fix**: Check CORS configuration
1. Verify you added your production domain to CORS origins in Sanity
2. Make sure "Allow credentials" is checked
3. Clear browser cache and reload

### "Failed to fetch" errors in browser console

**Problem**: Console shows fetch errors when loading from Sanity

**Fix**:
1. Verify `projectId: '6ae0om2j'` in script-sanity.js
2. Check CORS settings include your production domain
3. Ensure dataset is set to 'production'

### Studio deployment fails

**Problem**: `npm run deploy` fails with authentication error

**Fix**: Make sure you completed the login:
```bash
npx sanity login
```

Then try deploying again.

---

## Future Updates

To update your site after deployment:

1. **Content changes**: Just edit in Sanity Studio - changes appear automatically
2. **Code changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
   Cloudflare Pages will auto-deploy the new version

---

## Support

- Sanity documentation: https://www.sanity.io/docs
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/

Project Details:
- Sanity Project ID: `6ae0om2j`
- Dataset: `production`
- GitHub Repo: `BOOMCHOPALAKA/fjordhjem`
