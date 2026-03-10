import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mmmchile.cl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/conoce-a-jesus`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/iglesias`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/oracion`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/testimonios`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/en-vivo`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/radio`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/doctrina`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    // Rutas dinámicas: Blog posts
    const { sanityFetch } = await import('@/lib/sanity/client');
    const { GET_ALL_POSTS_QUERY } = await import('@/lib/sanity/queries');
    const posts = await sanityFetch<any[]>({ query: GET_ALL_POSTS_QUERY });
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Rutas dinámicas: Iglesias
    const { churchesSeed } = await import('@/lib/data/churches-seed');
    const churches: MetadataRoute.Sitemap = churchesSeed.map((church) => ({
        url: `${BASE_URL}/iglesias/${church.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    // Rutas dinámicas: Ciudades con iglesia
    const uniqueCities = [...new Set(churchesSeed.map((c) => c.city))];
    const cities: MetadataRoute.Sitemap = uniqueCities.map((city) => {
        const normalizedCity = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
        return {
            url: `${BASE_URL}/iglesias/ciudad/${normalizedCity}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        };
    });

    return [...staticRoutes, ...blogPosts, ...churches, ...cities];
}
