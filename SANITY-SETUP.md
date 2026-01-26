# Sanity CMS Setup Guide

This guide will walk you through setting up Sanity CMS for your Fjordhjem website. Sanity provides a completely free tier (100,000 API requests/month, 10GB bandwidth, 500GB assets) which is perfect for a vacation rental site.

## Step 1: Create Sanity Account

1. Go to [sanity.io](https://sanity.io)
2. Click "Get started" and sign up with Google, GitHub, or email
3. Once logged in, you'll be taken to your dashboard

## Step 2: Create a New Project

1. In the Sanity dashboard, click "Create new project"
2. Name your project: **Fjordhjem**
3. Choose the dataset name: **production** (this is the default)
4. Note your **Project ID** - you'll need this in the next steps

## Step 3: Configure Sanity Studio

1. Open `studio/sanity.config.ts`
2. Replace `'your-project-id'` with your actual project ID from Step 2:
   ```typescript
   projectId: 'abc123xyz', // Your actual project ID
   ```

## Step 4: Configure Frontend

1. Open `script-sanity.js` in the main directory
2. Replace `'your-project-id'` with your actual project ID:
   ```javascript
   const SANITY_CONFIG = {
       projectId: 'abc123xyz', // Your actual project ID
       dataset: 'production',
       ...
   }
   ```

## Step 5: Authenticate Sanity CLI

Open a terminal in the `studio` directory and run:

```bash
cd studio
npx sanity login
```

This will open a browser window to authenticate. Follow the prompts to log in.

## Step 6: Get a Sanity Token for Migration

To migrate your existing content from Payload to Sanity, you need an API token:

1. Go to [https://sanity.io/manage/personal/tokens](https://sanity.io/manage/personal/tokens)
2. Click "Add new token"
3. Name it: "Migration Token"
4. Select permissions: **Editor**
5. Click "Create"
6. Copy the token (you won't see it again!)

## Step 7: Set Up Environment Variables

1. In the `studio` directory, create a `.env` file:
   ```bash
   cd studio
   cp .env.example .env
   ```

2. Edit `.env` and add your values:
   ```env
   SANITY_STUDIO_PROJECT_ID=abc123xyz
   SANITY_STUDIO_DATASET=production
   SANITY_TOKEN=your-token-from-step-6
   PAYLOAD_API_URL=http://localhost:3001/api
   ```

## Step 8: Start Payload CMS (for migration)

Make sure your Payload CMS is running so we can migrate the content:

```bash
# In a separate terminal window
cd ../fjordhjem-cms
npm run dev
```

This should start Payload at http://localhost:3001

## Step 9: Run the Migration

Now migrate your content from Payload to Sanity:

```bash
cd studio
npm run migrate
```

You should see output like:
```
🚀 Starting migration from Payload to Sanity...
📄 Migrating Hero Section...
✅ Hero section migrated
📄 Migrating About Section...
✅ About section migrated
...
✅ Migration completed successfully!
```

## Step 10: Start Sanity Studio

Start the Sanity Studio development server:

```bash
npm run dev
```

The studio will open at http://localhost:3333

## Step 11: Explore Your Content

1. Open http://localhost:3333 in your browser
2. You should see all your migrated content in the studio:
   - Hero Section
   - About Section
   - Experience Section & Cards
   - Location Section & Points
   - Booking Section

3. Try editing some content to see the interface!

## Step 12: Test the Frontend

1. Start a local server for your frontend (if not already running):
   ```bash
   # In the main fjordhjem directory
   python3 -m http.server 8080
   # or use Live Server in VS Code
   ```

2. Open http://localhost:8080 in your browser
3. The site should now load content from Sanity!

**Note:** If you see "your-project-id" errors in the console, make sure you updated both `studio/sanity.config.ts` and `script-sanity.js` with your actual project ID.

## Step 13: Deploy Sanity Studio (Free Hosting)

Once you're happy with the content, deploy your studio for free:

```bash
cd studio
npm run deploy
```

This will:
1. Build your studio for production
2. Deploy it to Sanity's hosting
3. Give you a URL like: `fjordhjem.sanity.studio`

You can now access your CMS from anywhere at that URL!

## Step 14: Deploy Frontend to Cloudflare Pages

Your frontend can stay on Cloudflare Pages (free tier). Just push your changes to GitHub:

```bash
git add .
git commit -m "Migrate to Sanity CMS"
git push origin main
```

Cloudflare Pages will automatically deploy the updated site.

## Step 15: Configure CORS (Production)

Once your site is live, you'll need to add your domain to Sanity's CORS origins:

1. Go to https://sanity.io/manage
2. Select your Fjordhjem project
3. Go to "API" settings
4. Under "CORS origins", add:
   - `http://localhost:8080` (for local dev)
   - Your production domain (e.g., `https://fjordhjem.com`)

## Costs & Limits

Sanity's **free tier** includes:
- 100,000 API requests/month
- 10GB bandwidth/month
- 500GB asset storage
- Unlimited collaborators
- Unlimited projects

For a vacation rental site with moderate traffic, you should stay well within these limits.

## Shutting Down Payload CMS

Once you've confirmed everything works with Sanity:

1. You can stop the Payload server
2. The MongoDB database can be shut down
3. The Railway/Render hosting is no longer needed

You've successfully eliminated all hosting costs! 🎉

## Need Help?

- **Sanity Docs**: https://www.sanity.io/docs
- **Sanity Community**: https://slack.sanity.io
- **Studio location**: `fjordhjem/studio/`
- **Frontend script**: `fjordhjem/script-sanity.js`

## File Structure

```
fjordhjem/
├── studio/                    # Sanity Studio CMS
│   ├── sanity.config.ts      # Sanity configuration (SET PROJECT ID HERE)
│   ├── schemaTypes/          # Content schemas
│   ├── scripts/migrate.ts    # Migration script
│   └── package.json
├── script-sanity.js          # Frontend Sanity client (SET PROJECT ID HERE)
├── index.html                # Website (updated to use Sanity)
└── images/                   # Static images

fjordhjem-cms/                # Old Payload CMS (can be archived)
```
