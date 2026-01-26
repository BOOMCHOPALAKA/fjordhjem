import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'experienceSection',
  title: 'Experience Section',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Section label (e.g., "The Experience")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      description: 'Main heading (supports line breaks)',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
