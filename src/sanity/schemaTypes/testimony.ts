import { defineType, defineField } from 'sanity';
import { SparklesIcon } from '@sanity/icons';

export const testimony = defineType({
    name: 'testimony',
    title: 'Testimony',
    type: 'document',
    icon: SparklesIcon,
    fields: [
        defineField({
            name: 'personName',
            title: 'Person Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'personName', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
            description: 'A short sentence summarizing the testimony',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Sanidad', value: 'sanidad' },
                    { title: 'Restauración Familiar', value: 'restauracion' },
                    { title: 'Provisión', value: 'provision' },
                    { title: 'Liberación', value: 'liberacion' },
                    { title: 'Salvación', value: 'salvacion' },
                    { title: 'Otro', value: 'otro' }
                ],
            },
        }),
        defineField({
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
        }),
        defineField({
            name: 'shortVersion',
            title: 'Short Version',
            type: 'text',
            description: 'A brief version for previews and cards',
        }),
        defineField({
            name: 'fullStory',
            title: 'Full Story',
            type: 'blockContent',
        }),
        defineField({
            name: 'bibleVerse',
            title: 'Key Bible Verse',
            type: 'string',
        }),
        defineField({
            name: 'church',
            title: 'Local Church',
            type: 'reference',
            to: [{ type: 'church' }],
        }),
    ],
});
