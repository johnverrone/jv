import {defineField, defineType} from 'sanity'

export const roaster = defineType({
  name: 'roaster',
  title: 'Roaster',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
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
