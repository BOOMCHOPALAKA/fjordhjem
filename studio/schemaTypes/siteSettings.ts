import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Name of the site (appears in logo, footer, etc.)',
      validation: (Rule) => Rule.required(),
      initialValue: 'Fjordhjem',
    }),
    defineField({
      name: 'siteLocation',
      title: 'Site Location',
      type: 'string',
      description: 'Location text for footer (e.g., "Hood Canal, Washington")',
      validation: (Rule) => Rule.required(),
      initialValue: 'Hood Canal, Washington',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright notice (year will auto-update in code if needed)',
      validation: (Rule) => Rule.required(),
      initialValue: 'Fjordhjem. All rights reserved.',
    }),
  ],
})
