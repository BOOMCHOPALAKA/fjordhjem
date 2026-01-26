import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '6ae0om2j',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

async function migrate() {
  try {
    console.log('Starting comprehensive migration...\n')

    // 1. Update Hero with button fields
    console.log('1. Updating Hero section with button fields...')
    await client.patch('hero').set({
      primaryButtonText: 'Check Availability',
      primaryButtonUrl: '#book',
      secondaryButtonText: 'Come explore',
      secondaryButtonUrl: '#about',
    }).commit()
    console.log('✓ Updated Hero section\n')

    // 2. Create Banner Carousel document
    console.log('2. Creating Banner Carousel document...')
    // First check if it exists
    const existingCarousel = await client.fetch('*[_type == "bannerCarousel" && _id == "bannerCarousel"][0]')

    if (!existingCarousel) {
      await client.create({
        _id: 'bannerCarousel',
        _type: 'bannerCarousel',
        images: [], // User will need to upload images via Studio
      })
      console.log('✓ Created Banner Carousel (empty - add images in Studio)\n')
    } else {
      console.log('✓ Banner Carousel already exists\n')
    }

    // 3. Update Booking with new button fields
    console.log('3. Updating Booking section with Airbnb/VRBO fields...')
    await client.patch('booking').set({
      airbnbButtonText: 'View on Airbnb',
      airbnbUrl: 'https://www.airbnb.com', // Placeholder - user should update
      vrboButtonText: 'View on VRBO',
      vrboUrl: 'https://www.vrbo.com', // Placeholder - user should update
      contactQuestionText: 'Questions about your stay?',
      contactEmail: 'info@fjordhjem.com', // Placeholder - user should update
    }).commit()
    console.log('✓ Updated Booking section\n')

    // 4. Create Site Settings document
    console.log('4. Creating Site Settings document...')
    const existingSettings = await client.fetch('*[_type == "siteSettings" && _id == "siteSettings"][0]')

    if (!existingSettings) {
      await client.create({
        _id: 'siteSettings',
        _type: 'siteSettings',
        siteName: 'Fjordhjem',
        siteLocation: 'Hood Canal, Washington',
        copyrightText: 'Fjordhjem. All rights reserved.',
      })
      console.log('✓ Created Site Settings\n')
    } else {
      console.log('✓ Site Settings already exist\n')
    }

    console.log('✅ Migration complete!\n')
    console.log('What was added/updated:')
    console.log('- Hero: Primary & secondary button text and URLs')
    console.log('- Banner Carousel: Document created (add images in Studio)')
    console.log('- Booking: Airbnb/VRBO buttons, contact question, email')
    console.log('- Site Settings: Site name, location, copyright')
    console.log('\n⚠️  IMPORTANT: Update these placeholder values in Sanity Studio:')
    console.log('- Booking Section → Airbnb URL (currently placeholder)')
    console.log('- Booking Section → VRBO URL (currently placeholder)')
    console.log('- Booking Section → Contact Email (currently placeholder)')
    console.log('- Banner Carousel → Upload images')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
