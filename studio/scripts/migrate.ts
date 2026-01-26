import {createClient} from '@sanity/client'
import axios from 'axios'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3001/api'
const SANITY_PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const SANITY_DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const SANITY_TOKEN = process.env.SANITY_TOKEN

if (!SANITY_TOKEN) {
  console.error('❌ SANITY_TOKEN environment variable is required')
  console.log('Get a token from: https://sanity.io/manage/personal/tokens')
  console.log('Create a token with "Editor" permissions')
  process.exit(1)
}

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  token: SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface PayloadDocument {
  id: string
  [key: string]: any
}

async function fetchFromPayload(endpoint: string) {
  try {
    const response = await axios.get(`${PAYLOAD_API_URL}/${endpoint}`)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, error.message)
    return null
  }
}

async function uploadImageToSanity(imageUrl: string, filename: string) {
  try {
    const response = await axios.get(imageUrl, {responseType: 'arraybuffer'})
    const buffer = Buffer.from(response.data)
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: filename,
    })
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error: any) {
    console.error(`Error uploading image ${filename}:`, error.message)
    return null
  }
}

async function migrateHero() {
  console.log('\n📄 Migrating Hero Section...')
  const data = await fetchFromPayload('hero')

  if (!data?.docs?.[0]) {
    console.log('⚠️  No hero data found')
    return
  }

  const hero = data.docs[0]
  let backgroundImage = null

  if (hero.backgroundImage) {
    const imageUrl =
      typeof hero.backgroundImage === 'string'
        ? hero.backgroundImage
        : `${PAYLOAD_API_URL.replace('/api', '')}${hero.backgroundImage.url}`

    backgroundImage = await uploadImageToSanity(imageUrl, 'hero-background.jpg')
  }

  const doc = {
    _id: 'hero',
    _type: 'hero',
    title: hero.title,
    subtitle: hero.subtitle,
    backgroundImage,
  }

  await sanityClient.createOrReplace(doc)
  console.log('✅ Hero section migrated')
}

async function migrateAbout() {
  console.log('\n📄 Migrating About Section...')
  const data = await fetchFromPayload('about')

  if (!data?.docs?.[0]) {
    console.log('⚠️  No about data found')
    return
  }

  const about = data.docs[0]
  const photos = []

  if (about.photos && Array.isArray(about.photos)) {
    for (let i = 0; i < about.photos.length; i++) {
      const photo = about.photos[i]
      let imageUrl = ''

      if (typeof photo === 'string') {
        imageUrl = photo
      } else if (photo.url) {
        imageUrl = photo.url.startsWith('http')
          ? photo.url
          : `${PAYLOAD_API_URL.replace('/api', '')}${photo.url}`
      }

      if (imageUrl) {
        const image = await uploadImageToSanity(imageUrl, `about-photo-${i + 1}.jpg`)
        if (image) {
          photos.push(image)
        }
      }
    }
  }

  const doc = {
    _id: 'about',
    _type: 'about',
    label: about.label,
    heading: about.heading,
    description: about.description,
    photos,
  }

  await sanityClient.createOrReplace(doc)
  console.log('✅ About section migrated')
}

async function migrateExperienceSection() {
  console.log('\n📄 Migrating Experience Section...')
  const data = await fetchFromPayload('globals/experience-section')

  if (!data) {
    console.log('⚠️  No experience section data found')
    return
  }

  const doc = {
    _id: 'experienceSection',
    _type: 'experienceSection',
    label: data.label,
    heading: data.heading,
  }

  await sanityClient.createOrReplace(doc)
  console.log('✅ Experience section migrated')
}

async function migrateExperienceCards() {
  console.log('\n📄 Migrating Experience Cards...')
  const data = await fetchFromPayload('experience-cards')

  if (!data?.docs) {
    console.log('⚠️  No experience cards found')
    return
  }

  for (const card of data.docs) {
    let image = null

    if (card.image) {
      const imageUrl =
        typeof card.image === 'string'
          ? card.image
          : card.image.url?.startsWith('http')
            ? card.image.url
            : `${PAYLOAD_API_URL.replace('/api', '')}${card.image.url}`

      image = await uploadImageToSanity(imageUrl, `experience-${card.order}.jpg`)
    }

    const doc = {
      _type: 'experienceCard',
      title: card.title,
      description: card.description,
      image,
      order: card.order,
    }

    await sanityClient.create(doc)
    console.log(`✅ Migrated: ${card.title}`)
  }
}

async function migrateLocationSection() {
  console.log('\n📄 Migrating Location Section...')
  const data = await fetchFromPayload('globals/location-section')

  if (!data) {
    console.log('⚠️  No location section data found')
    return
  }

  const doc = {
    _id: 'locationSection',
    _type: 'locationSection',
    label: data.label,
    heading: data.heading,
    intro: data.intro,
  }

  await sanityClient.createOrReplace(doc)
  console.log('✅ Location section migrated')
}

async function migrateLocationPoints() {
  console.log('\n📄 Migrating Location Points...')
  const data = await fetchFromPayload('location-points')

  if (!data?.docs) {
    console.log('⚠️  No location points found')
    return
  }

  for (const point of data.docs) {
    const doc = {
      _type: 'locationPoint',
      location: point.location,
      distance: point.distance,
      order: point.order,
    }

    await sanityClient.create(doc)
    console.log(`✅ Migrated: ${point.location}`)
  }
}

async function migrateBooking() {
  console.log('\n📄 Migrating Booking Section...')
  const data = await fetchFromPayload('booking')

  if (!data?.docs?.[0]) {
    console.log('⚠️  No booking data found')
    return
  }

  const booking = data.docs[0]

  const doc = {
    _id: 'booking',
    _type: 'booking',
    label: booking.label,
    heading: booking.heading,
    description: booking.description,
    buttonText: booking.buttonText,
    buttonUrl: booking.buttonUrl,
  }

  await sanityClient.createOrReplace(doc)
  console.log('✅ Booking section migrated')
}

async function main() {
  console.log('🚀 Starting migration from Payload to Sanity...')
  console.log(`📡 Payload API: ${PAYLOAD_API_URL}`)
  console.log(`🎨 Sanity Project: ${SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${SANITY_DATASET}`)

  try {
    // Delete existing experience cards and location points to avoid duplicates
    console.log('\n🗑️  Cleaning up existing collection documents...')
    await sanityClient.delete({query: "*[_type == 'experienceCard']"})
    await sanityClient.delete({query: "*[_type == 'locationPoint']"})

    await migrateHero()
    await migrateAbout()
    await migrateExperienceSection()
    await migrateExperienceCards()
    await migrateLocationSection()
    await migrateLocationPoints()
    await migrateBooking()

    console.log('\n✅ Migration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Run `npm run dev` to start the Sanity Studio')
    console.log('2. Open http://localhost:3333 to view your content')
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

main()
