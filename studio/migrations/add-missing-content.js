import {createClient} from '@sanity/client'

const client = createClient({
  projectId: '6ae0om2j',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

// About section features
const aboutFeatures = [
  {
    title: 'Sleeps 6',
    description: 'The more the cozier',
  },
  {
    title: '2 Full Baths',
    description: '',
  },
  {
    title: 'Mountain & Water Views',
    description: 'From nearly every window',
  },
  {
    title: 'Beach Access',
    description: '5 minutes to the water',
  },
]

// Location points
const locationPoints = [
  {
    _type: 'locationPoint',
    location: 'Twanoh Falls State Park',
    distance: '5 min',
    description: 'Beach access, oyster harvesting, swimming, salmon runs, and forest trails. The waterfall hike is quick and beautiful. You\'ll probably visit every day.',
    order: 0,
  },
  {
    _type: 'locationPoint',
    location: 'Union & Alderbrook Resort',
    distance: '10 min south',
    description: 'Charming small town with that classic Hood Canal vibe. Alderbrook Resort (open to everyone) has waterfront dining, craft cocktails, spa treatments, and beautiful grounds. Perfect for a nice dinner out.',
    order: 1,
  },
  {
    _type: 'locationPoint',
    location: 'Belfair',
    distance: '10 min north',
    description: 'Grocery stores (Safeway, QFC, Grocery Outlet), local restaurants, breweries, and coffee shops. Everything you need to stock the fridge or grab food on the go.',
    order: 2,
  },
  {
    _type: 'locationPoint',
    location: 'Lake Cushman',
    distance: '20 min',
    description: 'Beautiful alpine lake with campgrounds, boat launches, and swimming. Crystal clear water, mountain backdrop — makes for a great day trip.',
    order: 3,
  },
  {
    _type: 'locationPoint',
    location: 'Mt. Ellinor Trail',
    distance: '30 min',
    description: 'One of the best hikes in the Olympics. Steep? Yes. Worth it? Absolutely. Clear-day views stretch from Hood Canal to the Cascades. Wildflowers in summer, epic fall colors. Bring layers, start early.',
    order: 4,
  },
  {
    _type: 'locationPoint',
    location: 'Olympic National Park',
    distance: '45-60 min',
    description: 'Multiple park entrances within reach. Hurricane Ridge for mountain views and marmots. Staircase for riverside trails and old-growth forest. Quinault for rainforest vibes. Enough day trips to keep you busy all week.',
    order: 5,
  },
]

// About section description (both paragraphs)
const aboutDescription = `Fjordhjem (Norwegian for "Fjord Home") sits 300 feet above Hood Canal (which is, in fact, a fjord!) with Olympic Mountain views that'll make you want to stay on the deck all day. It's the kind of place where your only agenda is coffee in the morning, maybe a hike if you feel like it, and definitely some time around the fire pit at night.

The cabin sleeps 7 with two bedrooms, a pull-out sofa, and two full bathrooms. Fully stocked kitchen, lots of blankets, and everything you need to either adventure hard or do absolutely nothing. Your call.`

async function migrate() {
  try {
    console.log('Starting migration...')

    // 1. Update About section with features and description
    console.log('Adding features and description to About section...')
    const about = await client.patch('about')
      .set({
        features: aboutFeatures,
        description: aboutDescription,
      })
      .commit()
    console.log('✓ Updated About section')

    // 2. Create or update location points
    console.log('Creating location points...')
    for (const point of locationPoints) {
      const result = await client.create(point)
      console.log(`✓ Created: ${point.location}`)
    }

    console.log('\n✅ Migration complete!')
    console.log('\nWhat was added:')
    console.log('- Features grid in About section (Sleeps 6, 2 Full Baths, etc.)')
    console.log('- 6 Location Points with descriptions')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
