import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Section label (e.g., "About")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      description: 'Main heading for the about section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Main description text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photo Carousel',
      type: 'array',
      options: {
        layout: 'grid',
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
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
})
