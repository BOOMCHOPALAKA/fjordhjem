# Fjordhjem Sanity Studio

This is the Sanity Studio for managing content on the Fjordhjem vacation rental website.

## Setup Instructions

### 1. Create Sanity Account and Project

1. Go to [sanity.io](https://sanity.io) and sign up for a free account
2. Once logged in, create a new project:
   - Click "Create new project"
   - Name it "Fjordhjem"
   - Choose "Production" as your dataset name
   - Note your **Project ID** (you'll need this next)

### 2. Configure the Studio

1. Open `sanity.config.ts` in this directory
2. Replace `'your-project-id'` with your actual project ID from step 1

### 3. Authenticate Sanity CLI

```bash
npx sanity login
```

This will open a browser window to authenticate.

### 4. Import Initial Content

After authenticating, run the migration script to import your existing content:

```bash
npm run migrate
```

### 5. Start the Studio

Run the development server:

```bash
npm run dev
```

The studio will open at [http://localhost:3333](http://localhost:3333)

## Available Scripts

- `npm run dev` - Start development server on port 3333
- `npm run build` - Build the studio for production
- `npm run deploy` - Deploy the studio to Sanity's hosted platform (free)
- `npm run migrate` - Import content from Payload CMS

## Deployment

Once your content is ready, deploy the studio for free:

```bash
npm run deploy
```

This will give you a URL like `fjordhjem.sanity.studio` where you can access your CMS from anywhere.

## Content Structure

- **Hero Section** - Main landing section with title and background
- **About Section** - Information about the cabin with photo carousel
- **Experience Section** - Header for experience cards
- **Experience Cards** - Individual activity/feature cards
- **Location Section** - Header for location information
- **Location Points** - Nearby attractions and distances
- **Booking Section** - Call-to-action for booking

All singleton sections (Hero, About, sections headers, Booking) appear directly in the sidebar and can only have one instance.
