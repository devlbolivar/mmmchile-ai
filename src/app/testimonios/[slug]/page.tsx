import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import CTAButton from '@/components/shared/CTAButton';
import Breadcrumb from '@/components/shared/Breadcrumb';

import { sanityFetch } from '@/lib/sanity/client';
import { GET_ALL_TESTIMONIES_QUERY, GET_TESTIMONY_BY_SLUG_QUERY } from '@/lib/sanity/queries';

// Generate static params from Sanity
export async function generateStaticParams() {
    const testimonies = await sanityFetch<any[]>({ query: GET_ALL_TESTIMONIES_QUERY });

    return testimonies
        .filter((testimony) => testimony.slug)
        .map((testimony) => ({
            slug: testimony.slug,
        }));
}

// Dynamic Metadata
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const resolvedParams = await params;

    const testimony = await sanityFetch<any>({
        query: GET_TESTIMONY_BY_SLUG_QUERY,
        params: { slug: resolvedParams.slug }
    });

    if (!testimony) return { title: 'Testimonio no encontrado' };

    return {
        title: `${testimony.headline} | Testimonio Cristiano`,
        description: testimony.shortVersion,
        openGraph: {
            title: `${testimony.headline} | Testimonio de ${testimony.personName}`,
            description: testimony.shortVersion,
            images: testimony.photo?.asset?.url ? [testimony.photo.asset.url] : [],
        },
    };
}

export default async function TestimonyDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const resolvedParams = await params;

    const testimony = await sanityFetch<any>({
        query: GET_TESTIMONY_BY_SLUG_QUERY,
        params: { slug: resolvedParams.slug }
    });

    if (!testimony) {
        notFound();
    }

    const getInitials = (name: string) => {
        return name.slice(0, 1).toUpperCase();
    };

    // Extract YouTube ID if URL exists to build embed URL
    let youtubeEmbedUrl = null;
    if (testimony.videoUrl) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = testimony.videoUrl.match(regExp);
        if (match && match[2].length === 11) {
            youtubeEmbedUrl = `https://www.youtube.com/embed/${match[2]}`;
        }
    }

    return (
        <article className="bg-[#FAF9F6] min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-6 max-w-3xl">

                {/* Breadcrumb */}
                <Breadcrumb
                    items={[
                        { label: 'Testimonios', href: '/testimonios' },
                        { label: testimony.headline },
                    ]}
                />

                {/* Header */}
                <header className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Categoria */}
                    <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
                        {testimony.category}
                    </span>

                    {/* Headline */}
                    <h1 className="font-serif leading-tight text-4xl md:text-5xl text-mmm-primary mb-12">
                        {testimony.headline}
                    </h1>

                    {/* Author details */}
                    <div className="flex flex-col items-center gap-4">
                        {testimony.photo?.asset?.url ? (
                            <div className="w-24 h-24 rounded-full relative overflow-hidden shadow-lg border-4 border-white">
                                <Image
                                    src={testimony.photo.asset.url}
                                    alt={`Foto de ${testimony.personName}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-[#2a5280] flex items-center justify-center text-white font-serif text-4xl shadow-lg border-4 border-white">
                                {getInitials(testimony.personName)}
                            </div>
                        )}

                        <div>
                            <h2 className="font-semibold text-lg text-mmm-primary m-0">
                                Testimonio de {testimony.personName}
                            </h2>
                            {testimony.church && (
                                <div className="flex items-center justify-center gap-1.5 text-mmm-text-light text-sm mt-1">
                                    <MapPin size={14} />
                                    <span>{testimony.church.name}, {testimony.church.city}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Video Embed */}
                {youtubeEmbedUrl && (
                    <div className="mb-14 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-700 delay-300 fill-mode-both aspect-video w-full bg-black">
                        <iframe
                            src={youtubeEmbedUrl}
                            title={`Testimonio en video de ${testimony.personName}`}
                            width="100%"
                            height="100%"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="border-0"
                        />
                    </div>
                )}

                {/* Body Content */}
                <div className="prose prose-lg prose-headings:font-serif prose-headings:text-mmm-primary prose-a:text-mmm-accent prose-a:no-underline hover:prose-a:text-mmm-primary transition-colors max-w-none mb-16 text-mmm-text animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both leading-relaxed">
                    {testimony.fullStory ? (
                        <PortableText
                            value={testimony.fullStory}
                            components={{
                                block: {
                                    normal: ({ children }) => <p className="mb-6">{children}</p>,
                                }
                            }}
                        />
                    ) : (
                        <p>{testimony.shortVersion}</p>
                    )}
                </div>

                {/* Featured Bible Verse */}
                {testimony.bibleVerse && (
                    <div className="my-16 relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-1"></div>
                        <div className="absolute inset-0 bg-white border border-primary/10 rounded-3xl shadow-sm transform rotate-1 transition-transform hover:rotate-0"></div>
                        <div className="relative p-10 md:p-12 text-center">
                            <span className="font-serif text-6xl text-accent/30 absolute top-4 left-6 leading-none -z-10">&quot;</span>
                            <p className="font-serif text-2xl md:text-3xl text-primary leading-tight font-medium">
                                {testimony.bibleVerse.split('(')[0]}
                            </p>
                            {testimony.bibleVerse.includes('(') && (
                                <p className="text-muted text-sm tracking-widest uppercase mt-6 font-semibold">
                                    {testimony.bibleVerse.split('(')[1].replace(')', '')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Funnel CTA */}
                <div className="mt-20 pt-16 border-t border-primary/10 text-center animate-in fade-in duration-700 delay-500 fill-mode-both">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/5 rounded-full mb-6">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mmm-gold text-2xl">
                            ✨
                        </div>
                    </div>

                    <h3 className="font-serif text-3xl text-primary mb-4">
                        ¿Quieres vivir tu propia historia de transformación?
                    </h3>

                    <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
                        Esa paz, esperanza y propósito que acabas de leer están disponibles para ti también, hoy mismo.
                    </p>

                    <CTAButton
                        href="/conoce-a-jesus"
                        variant="primary"
                        className="gap-2"
                    >
                        Descubre Cómo Conocer a Jesús
                        <ArrowRight size={18} />
                    </CTAButton>
                </div>

            </div>
        </article>
    );
}
