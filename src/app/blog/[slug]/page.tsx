import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity/client';
import { GET_POST_BY_SLUG_QUERY, GET_POSTS_BY_CATEGORY_QUERY, GET_ALL_POST_SLUGS_QUERY } from '@/lib/sanity/queries';
import { BlogPost } from '@/lib/mock-data/blog';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/image';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mmmchile.cl';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ShareButtons from '@/components/blog/ShareButtons';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleCTA from '@/components/blog/ArticleCTA';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Breadcrumb from '@/components/shared/Breadcrumb';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await sanityFetch<{ slug: string }[]>({ query: GET_ALL_POST_SLUGS_QUERY });
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await sanityFetch<BlogPost>({ query: GET_POST_BY_SLUG_QUERY, params: { slug: resolvedParams.slug } });

    if (!post) {
        return {
            title: 'Artículo no encontrado | MMM Chile',
        };
    }

    const ogImageUrl = post.coverImage 
        ? urlForImage(post.coverImage).width(1200).height(630).fit('crop').url()
        : `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.title || 'Blog')}`;

    const description = post.excerpt || `Lee este artículo en el blog de MMM Chile: ${post.title}`;

    return {
        title: `${post.title} | MMM Chile`,
        description,
        openGraph: {
            title: post.title,
            description,
            url: `${BASE_URL}/blog/${post.slug}`,
            type: 'article',
            publishedTime: post.publishedAt,
            authors: [post.author?.name || 'MMM Chile'],
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [ogImageUrl],
        },
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        other: {
            'fb:app_id': process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? '',
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const post = await sanityFetch<BlogPost>({ query: GET_POST_BY_SLUG_QUERY, params: { slug: resolvedParams.slug } });

    if (!post) {
        notFound();
    }

    // Find related posts (up to 3) by category
    let related: BlogPost[] = [];
    if (post.category?.slug) {
        const categoryPosts = await sanityFetch<BlogPost[]>({ query: GET_POSTS_BY_CATEGORY_QUERY, params: { categorySlug: post.category.slug } });
        related = categoryPosts.filter((p: BlogPost) => p._id !== post._id).slice(0, 3);
    }

    const ogImageUrl = post.coverImage 
        ? urlForImage(post.coverImage).width(1200).height(630).fit('crop').url()
        : `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.title || 'Blog')}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author?.name ?? 'MMM Chile',
        },
        image: ogImageUrl,
        publisher: {
            '@type': 'Organization',
            name: 'Movimiento Misionero Mundial Chile',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/blog/${post.slug}`,
        },
    };

    const bgStyle = { background: "linear-gradient(135deg, #1E3A5F 0%, #2a5280 100%)" }; // Default gradient since image support isn't ready

    return (
        <article className="min-h-screen bg-[#F8F6F0]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Breadcrumb */}
            <div className="max-w-[740px] mx-auto px-6 pt-24 md:pt-32 pb-2">
                <Breadcrumb
                    items={[
                        { label: 'Blog', href: '/blog' },
                        { label: post.category?.title || 'Blog', href: `/blog?categoria=${post.category?.slug || 'todos'}` },
                        { label: post.title },
                    ]}
                />
            </div>

            {/* COVER IMAGE */}
            <div className="w-full h-[clamp(240px,35vw,400px)] relative overflow-hidden mt-6 bg-muted">
                {post.coverImage ? (
                    <Image
                        src={urlForImage(post.coverImage).url()}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={bgStyle}
                    >
                        <span className="font-serif text-[120px] text-white/5 select-none">✦</span>
                    </div>
                )}
            </div>

            <div className="bg-[#F8F6F0] -mt-10 relative z-10 rounded-t-[40px] sm:rounded-none sm:mt-0 pb-16">
                {/* HEADER */}
                <ArticleHeader post={post} />

                {/* SHARE TOP */}
                <ShareButtons title={post.title} url={`${BASE_URL}/blog/${post.slug}`} />

                {/* BODY */}
                <ArticleBody post={post} />

                {/* SHARE BOTTOM */}
                <div className="mt-8 mb-4">
                    <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4">¿Te bendijo este artículo? ¡Compártelo!</h3>
                    <ShareButtons title={post.title} url={`${BASE_URL}/blog/${post.slug}`} />
                </div>

                {/* CTA (Contextual based on category) */}
                <ArticleCTA categoryName={post.category?.title || 'General'} />

                {/* WhatsApp Interaction Box */}
                <div className="max-w-[700px] mx-auto mb-12 px-6">
                    <div className="p-6 text-center bg-[#25D366]/5 border border-[#25D366]/15 rounded-2xl">
                        <p className="text-[15px] text-muted-foreground mb-4">
                            ¿Qué piensas sobre este artículo? Nos encantaría saber tu opinión.
                        </p>
                        <a
                            href={`https://wa.me/56912345612?text=${encodeURIComponent("Hola, acabo de leer el artículo: " + post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white text-[14px] font-extrabold hover:bg-[#1ea952] hover:-translate-y-0.5 transition-all"
                        >
                            Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>

                {/* RELATED */}
                {related.length > 0 && (
                    <RelatedPosts posts={related} />
                )}
            </div>
        </article>
    );
}
