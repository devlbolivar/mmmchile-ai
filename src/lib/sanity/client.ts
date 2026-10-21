import { createClient } from 'next-sanity';
import type { QueryParams } from '@sanity/client';

export const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'mj1frquo',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-03-01',
    useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<QueryResponse>({
    query,
    params = {},
    tags,
}: {
    query: string;
    params?: QueryParams;
    tags?: string[];
}): Promise<QueryResponse> {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return client.fetch<QueryResponse>(query, params, {
        next: {
            revalidate: isDevelopment ? 0 : 3600, // Editorial content: refresh at most hourly in production
            tags,
        },
    });
}
