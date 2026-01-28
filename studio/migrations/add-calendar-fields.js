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
    console.log('Adding calendar fields to Booking section...\n')

    await client.patch('booking').set({
      showCalendar: true,
      airbnbICalUrl: 'https://www.airbnb.com/calendar/ical/1602316073626784701.ics?t=1e6c09b9044b432fbbe45e4d680fed7c',
    }).commit()

    console.log('✅ Calendar fields added to Booking section\n')
    console.log('You can now edit these fields in Sanity Studio → Booking Section')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
