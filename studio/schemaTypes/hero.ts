import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Main heading (e.g., "Fjordhjem")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      description: 'Subtitle text below the main heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryButtonText',
      title: 'Primary Button Text',
      type: 'string',
      description: 'Text for the main call-to-action button (e.g., "Check Availability")',
      validation: (Rule) => Rule.required(),
      initialValue: 'Check Availability',
    }),
    defineField({
      name: 'primaryButtonUrl',
      title: 'Primary Button URL',
      type: 'string',
      description: 'URL or anchor link (e.g., "#book" or full URL)',
      validation: (Rule) => Rule.required(),
      initialValue: '#book',
    }),
    defineField({
      name: 'secondaryButtonText',
      title: 'Secondary Button Text',
      type: 'string',
      description: 'Text for the secondary button (e.g., "Come explore")',
      validation: (Rule) => Rule.required(),
      initialValue: 'Come explore',
    }),
    defineField({
      name: 'secondaryButtonUrl',
      title: 'Secondary Button URL',
      type: 'string',
      description: 'URL or anchor link (e.g., "#about" or full URL)',
      validation: (Rule) => Rule.required(),
      initialValue: '#about',
    }),
  ],
})
