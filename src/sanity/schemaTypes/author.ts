import { defineType, defineField } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const author = defineType({
    name: 'author',
    title: 'Author',
    type: 'document',
    icon: UserIcon,
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'bio',
            title: 'Bio',
            type: 'text',
        }),
        defineField({
            name: 'role',
            title: 'Role',
            type: 'string',
        }),
    ],
});
