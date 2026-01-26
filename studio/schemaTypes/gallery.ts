import {defineType} from 'sanity'
import {BulkImageInput} from '../components/BulkImageInput'

export default defineType({
  name: 'gallery',
  title: 'Gallery Section',
  type: 'document',
  fields: [
    {
      name: 'label',
      title: 'Section Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Gallery',
    },
    {
      name: 'heading',
      title: 'Main Section Heading',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
      description: 'Use line breaks to split into multiple lines',
      initialValue: 'See For\nYourself',
    },
    {
      name: 'collections',
      title: 'Photo Collections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'photoCollection',
          title: 'Photo Collection',
          fields: [
            {
              name: 'collectionName',
              title: 'Collection Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'e.g., "House Photos", "Scenic Views", "Local Area"',
            },
            {
              name: 'subheading',
              title: 'Subheading (optional)',
              type: 'string',
              description: 'Optional descriptive subheading for this collection',
            },
            {
              name: 'photos',
              title: 'Photos',
              type: 'array',
              options: {
                layout: 'grid',
              },
              components: {
                input: BulkImageInput,
              },
              of: [
                {
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                      description: 'Describe the image for accessibility',
                    },
                    {
                      name: 'size',
                      title: 'Display Size',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Regular (1x1)', value: 'regular'},
                          {title: 'Large (2x2)', value: 'large'},
                          {title: 'Wide (2x1)', value: 'wide'},
                          {title: 'Tall (1x2)', value: 'tall'},
                        ],
                        layout: 'dropdown',
                      },
                      initialValue: 'regular',
                    },
                  ],
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              title: 'collectionName',
              subtitle: 'subheading',
              photoCount: 'photos.length',
            },
            prepare(selection) {
              const {title, subtitle, photoCount} = selection
              return {
                title: title,
                subtitle: subtitle || `${photoCount || 0} photos`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'Add multiple photo collections (e.g., House Photos, Scenic Views)',
    },
  ],
})
