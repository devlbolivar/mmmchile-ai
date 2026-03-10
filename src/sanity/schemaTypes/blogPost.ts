import { defineType, defineField, defineArrayMember } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

export const blogPost = defineType({
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',
    icon: DocumentTextIcon,
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
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'blockContent',
        }),
        defineField({
            name: 'bibleVerses',
            title: 'Key Bible Verses',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
        }),
        defineField({
            name: 'callToAction',
            title: 'Call To Action',
            type: 'string',
            options: {
                list: [
                    { title: 'Conoce a Jesús', value: 'conoce-a-jesus' },
                    { title: 'Oración', value: 'oracion' },
                    { title: 'Nuestras Iglesias', value: 'iglesias' },
                ],
            },
        }),
        defineField({
            name: 'seoKeywords',
            title: 'SEO Keywords',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
});
