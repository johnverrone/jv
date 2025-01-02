import {defineField, defineType} from 'sanity'

export const coffee = defineType({
  name: 'coffee',
  title: 'Coffee',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'roaster',
      type: 'reference',
      to: [{type: 'roaster'}],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
    }),
  ],
})
