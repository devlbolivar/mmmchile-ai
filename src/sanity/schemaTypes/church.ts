import { defineType, defineField, defineArrayMember } from 'sanity';
import { PinIcon } from '@sanity/icons';

export const church = defineType({
    name: 'church',
    title: 'Church',
    type: 'document',
    icon: PinIcon,
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
            name: 'city',
            title: 'City',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'string',
        }),
        defineField({
            name: 'zone',
            title: 'Zone',
            type: 'string',
            options: {
                list: [
                    { title: 'Norte', value: 'norte' },
                    { title: 'Centro-Norte', value: 'centro-norte' },
                    { title: 'Centro', value: 'centro' },
                    { title: 'Centro-Sur', value: 'centro-sur' },
                    { title: 'Sur', value: 'sur' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'latitude',
            title: 'Latitude',
            type: 'number',
        }),
        defineField({
            name: 'longitude',
            title: 'Longitude',
            type: 'number',
        }),
        defineField({
            name: 'phone',
            title: 'Phone',
            type: 'string',
        }),
        defineField({
            name: 'whatsapp',
            title: 'WhatsApp',
            type: 'string',
        }),
        defineField({
            name: 'pastorName',
            title: 'Pastor Name',
            type: 'string',
        }),
        defineField({
            name: 'serviceSchedule',
            title: 'Service Schedule',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    fields: [
                        defineField({ name: 'day', title: 'Day', type: 'string' }),
                        defineField({ name: 'time', title: 'Time', type: 'string' }),
                    ],
                    preview: {
                        select: {
                            title: 'day',
                            subtitle: 'time',
                        },
                    },
                }),
            ],
        }),
        defineField({
            name: 'photos',
            title: 'Photos',
            type: 'array',
            of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
        }),
        defineField({
            name: 'extraEmail',
            title: 'Extra Email',
            type: 'string',
        }),
        defineField({
            name: 'image',
            title: 'Legacy Image Path',
            type: 'string',
            description: 'Temporary field for legacy image paths during migration.',
        }),
    ],
});
