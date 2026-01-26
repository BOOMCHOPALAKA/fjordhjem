import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bannerCarousel',
  title: 'Banner Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Carousel Images',
      type: 'array',
      description: 'Images that auto-scroll in the banner carousel',
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
              description: 'Describe the image for accessibility',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(3).max(12),
    }),
  ],
})
