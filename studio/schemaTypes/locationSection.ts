import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'locationSection',
  title: 'Location Section',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Section label (e.g., "Location")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      description: 'Main heading (supports line breaks)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction Text',
      type: 'text',
      description: 'Introductory paragraph',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
