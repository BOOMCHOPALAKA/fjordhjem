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
    console.log('Adding images field to Location Section...\n')

    // The locationSection schema now has an 'images' field
    // User needs to upload these images manually in the Studio:
    // 1. images/view/brothers-bluehour.jpg → "Olympic Mountains at blue hour"
    // 2. images/view/brothers-sailboat-goldenhour.jpg → "Sailboat on Hood Canal with mountain views"

    console.log('✅ Schema updated!\n')
    console.log('⚠️  ACTION REQUIRED:')
    console.log('Go to Sanity Studio → Location Section → Images')
    console.log('Upload 2-3 scenic images to replace the hardcoded ones:\n')
    console.log('Current hardcoded images (for reference):')
    console.log('  1. Olympic Mountains at blue hour')
    console.log('  2. Sailboat on Hood Canal with mountain views')
    console.log('\nThese will display on the right side of the location section.')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
