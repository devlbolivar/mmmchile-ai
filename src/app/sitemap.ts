import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mmmchile.cl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Omit lastModified when no reliable editorial modification date exists.
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/eventos/convencion-nacional-2026`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/`,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/conoce-a-jesus`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/blog`,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/iglesias`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/oracion`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/testimonios`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/en-vivo`,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/radio`,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/doctrina`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Rutas dinámicas: Blog posts
    const { sanityFetch } = await import('@/lib/sanity/client');
    const { GET_ALL_POSTS_QUERY } = await import('@/lib/sanity/queries');
    const posts = await sanityFetch<{ slug: string; _updatedAt?: string; publishedAt: string }[]>({ query: GET_ALL_POSTS_QUERY });
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post._updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Rutas dinámicas: Iglesias
    const { churchesSeed } = await import('@/lib/data/churches-seed');
    const churches: MetadataRoute.Sitemap = churchesSeed.map((church) => ({
        url: `${BASE_URL}/iglesias/${church.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Rutas dinámicas: Ciudades con iglesia
    const uniqueCities = [...new Set(churchesSeed.map((c) => c.city))];
    const cities: MetadataRoute.Sitemap = uniqueCities.map((city) => {
        const normalizedCity = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
        return {
            url: `${BASE_URL}/iglesias/ciudad/${normalizedCity}`,
            changeFrequency: 'monthly',
            priority: 0.7,
        };
    });

    return [...staticRoutes, ...blogPosts, ...churches, ...cities];
}
