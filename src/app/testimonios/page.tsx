import type { Metadata } from 'next';
import { sanityFetch } from '@/lib/sanity/client';
import { GET_ALL_TESTIMONIES_QUERY } from '@/lib/sanity/queries';
import { SparklesIcon } from 'lucide-react';
import TestimonyFilter from '@/components/testimony/TestimonyFilter';
import TestimonyGrid from '@/components/testimony/TestimonyGrid';
import TestimonySubmitCTA from '@/components/testimony/TestimonySubmitCTA';
import { Suspense } from 'react';
import Breadcrumb from '@/components/shared/Breadcrumb';

export const metadata: Metadata = {
    title: 'Testimonios Cristianos | Vidas Transformadas | MMM Chile',
    description: 'Descubre historias reales de personas que encontraron esperanza, paz y propósito a través del poder de Jesús.',
    openGraph: {
        title: 'Testimonios | Vidas Transformadas',
        description: 'Descubre historias reales de personas que encontraron esperanza, paz y propósito a través del poder de Jesús.',
        url: 'https://mmmchile.cl/testimonios',
    },
};

export default async function TestimoniosPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Resolve search params promise before accessing properties
    const resolvedParams = await searchParams;
    const currentCategory = (resolvedParams.categoria as string) || 'todos';

    // Fetch testimonies from Sanity
    const allTestimonies = await sanityFetch<any[]>({ query: GET_ALL_TESTIMONIES_QUERY });

    // Filter testimonies based on selected category 
    // Mapped appropriately from Sanity fields
    const filteredTestimonies = allTestimonies.filter((testimony: any) => {
        if (currentCategory === 'todos') return true;
        return testimony.category === currentCategory;
    }).map((t: any) => ({
        id: t._id,
        slug: t.slug,
        title: t.headline || '',
        excerpt: t.shortVersion || t.headline || '',
        category: t.category,
        author: t.personName,
        location: t.church?.city || t.church?.name || '',
        date: new Date().toISOString(), // Fallback if no specific date
        imageUrl: t.photo || '/placeholder.svg'
    }));

    return (
        <div className="bg-cream min-h-screen pb-16">
            {/* Hero Section */}
            <div className="bg-primary pt-32 pb-24 relative overflow-hidden mb-12">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 text-accent font-semibold uppercase tracking-wider text-sm mb-4">
                        <SparklesIcon size={16} /> <span>Vidas Transformadas</span> <SparklesIcon size={16} />
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                        Testimonios de Esperanza
                    </h1>
                    <p className="text-lg text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
                        Historias reales de personas ordinarias que experimentaron el poder extraordinario
                        del amor, la sanidad y la restauración de Jesucristo.
                    </p>

                    {/* Breadcrumb */}
                    <div className="flex justify-center mt-6">
                        <Breadcrumb items={[{ label: 'Testimonios' }]} variant="light" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl">

                {/* Filter Section - Client Component with Suspense since it uses useSearchParams */}
                <Suspense fallback={<div className="h-12 w-full animate-pulse bg-white/50 rounded-full max-w-lg mx-auto mb-12"></div>}>
                    <TestimonyFilter />
                </Suspense>

                {/* Testimonies Grid */}
                <TestimonyGrid testimonies={filteredTestimonies} />

                {/* Call To Action */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                    <TestimonySubmitCTA />
                </div>
            </div>
        </div>
    );
}
