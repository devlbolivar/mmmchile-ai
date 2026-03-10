'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schema } from './src/sanity/schemaTypes';

export default defineConfig({
    basePath: '/studio',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mj1frquo',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    title: 'MMM Chile Studio',
    schema,
    plugins: [
        structureTool(),
        visionTool({ defaultApiVersion: '2026-03-01' }),
    ],
});
