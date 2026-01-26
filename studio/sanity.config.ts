import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'

// List of singleton document types
const singletonTypes = new Set(['hero', 'about', 'experienceSection', 'locationSection', 'gallery', 'booking', 'bannerCarousel', 'siteSettings'])

// List of singleton document IDs
const singletonIds = new Set([
  'hero',
  'about',
  'experienceSection',
  'locationSection',
  'gallery',
  'booking',
  'bannerCarousel',
  'siteSettings',
])

export default defineConfig({
  name: 'default',
  title: 'Fjordhjem',

  projectId: '6ae0om2j',
  dataset: 'production',

  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) => assetSource.name !== 'sanity-default'
        )
      },
    },
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton documents
            S.listItem()
              .title('Hero Section')
              .id('hero')
              .child(S.document().schemaType('hero').documentId('hero')),
            S.listItem()
              .title('About Section')
              .id('about')
              .child(S.document().schemaType('about').documentId('about')),
            S.listItem()
              .title('Banner Carousel')
              .id('bannerCarousel')
              .child(S.document().schemaType('bannerCarousel').documentId('bannerCarousel')),
            S.divider(),
            S.listItem()
              .title('Experience Section')
              .id('experienceSection')
              .child(S.document().schemaType('experienceSection').documentId('experienceSection')),
            S.documentTypeListItem('experienceCard').title('Experience Cards'),
            S.divider(),
            S.listItem()
              .title('Location Section')
              .id('locationSection')
              .child(S.document().schemaType('locationSection').documentId('locationSection')),
            S.documentTypeListItem('locationPoint').title('Location Points'),
            S.divider(),
            S.listItem()
              .title('Gallery Section')
              .id('gallery')
              .child(S.document().schemaType('gallery').documentId('gallery')),
            S.divider(),
            S.listItem()
              .title('Booking Section')
              .id('booking')
              .child(S.document().schemaType('booking').documentId('booking')),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
    media({
      creditLine: {
        enabled: false
      }
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Prevent creating new instances of singletons
    actions: (prev, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(({action}) => action && !['create', 'delete', 'duplicate'].includes(action))
      }
      return prev
    },
    // Hide 'publish' button for new singleton documents since they can't be created
    newDocumentOptions: (prev) => {
      return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
    },
  },
})
