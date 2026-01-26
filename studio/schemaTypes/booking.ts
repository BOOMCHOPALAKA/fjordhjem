import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'booking',
  title: 'Booking Section',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Section label (e.g., "Book Now")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      description: 'Main heading',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Booking description text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text for the booking button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonUrl',
      title: 'Button URL',
      type: 'url',
      description: 'Link to booking platform (e.g., Airbnb, VRBO)',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
