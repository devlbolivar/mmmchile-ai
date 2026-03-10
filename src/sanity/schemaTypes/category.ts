import { defineType, defineField } from 'sanity';
import { TagIcon } from '@sanity/icons';

export const category = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    icon: TagIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'color',
            title: 'Badge Color',
            type: 'string',
            description: 'CSS color or valid Tailwind color class',
        }),
    ],
});
