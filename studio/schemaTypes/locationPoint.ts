import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'locationPoint',
  title: 'Location Points',
  type: 'document',
  fields: [
    defineField({
      name: 'location',
      title: 'Location Name',
      type: 'string',
      description: 'Name of the nearby location or attraction',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'distance',
      title: 'Distance',
      type: 'string',
      description: 'Distance from the cabin (e.g., "5 min", "10 min south")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Detailed description of the location and what it offers',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this point appears (lower numbers first)',
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'location',
      subtitle: 'distance',
      order: 'order',
    },
    prepare({title, subtitle, order}) {
      return {
        title: `${order}. ${title}`,
        subtitle,
      }
    },
  },
})
