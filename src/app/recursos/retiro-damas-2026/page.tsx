import type { Metadata } from 'next'
import Image from 'next/image'
import { HeartHandshake } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'
import CTAButton from '@/components/shared/CTAButton'
import ImageGallery from '@/components/recursos/ImageGallery'
import { retiroDamasInfo, retiroDamasImages } from '@/lib/data/retiro-damas-2026'

export const metadata: Metadata = {
    title: 'Recursos del Retiro de Damas 2026 | MMM Chile',
    description: `Fotos y material gráfico del retiro "${retiroDamasInfo.lema}".`,
    alternates: {
        canonical: `https://mmmchile.cl/recursos/${retiroDamasInfo.slug}`,
    },
    openGraph: {
        title: 'Recursos del Retiro de Damas 2026',
        description: retiroDamasInfo.lema,
        url: `https://mmmchile.cl/recursos/${retiroDamasInfo.slug}`,
        images: ['/lema-retiro-2026.png'],
    },
}

export default function RetiroDamasRecursosPage() {
    return (
        <div className="min-h-screen bg-[#F8F6F0] pb-16">
            <div className="w-full overflow-hidden bg-[#0F2035] flex justify-center px-6 py-8">
                <Image
                    src="/lema-retiro-2026.png"
                    alt={`Lema del retiro: ${retiroDamasInfo.lema}`}
                    width={900}
                    height={1111}
                    priority
                    className="w-full max-w-sm h-auto"
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-6">
                <Breadcrumb items={[{ label: 'Retiro de Damas 2026' }]} />
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
                <div className="inline-flex items-center gap-2 text-[#D4A843] font-semibold uppercase tracking-wider text-sm mb-3">
                    <HeartHandshake size={16} />
                    <span>{retiroDamasInfo.fechas} · {retiroDamasInfo.lugar}</span>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A5F] mb-3">
                    Recursos del Retiro de Damas
                </h1>
                <p className="text-[#6B7280] text-lg mb-10 max-w-2xl">
                    Fotos y material gráfico de &ldquo;{retiroDamasInfo.lema}&rdquo;.
                </p>

                <ImageGallery images={retiroDamasImages} />

                <section className="mt-16 pt-10 border-t border-[#1E3A5F]/10 text-center">
                    <h2 className="font-serif text-2xl text-[#1E3A5F] mb-4">
                        ¿Quieres seguir creciendo en tu fe?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <CTAButton href="/conoce-a-jesus" variant="primary" className="w-full sm:w-auto min-w-[220px]">
                            Conoce a Jesús
                        </CTAButton>
                        <CTAButton href="/iglesias" variant="secondary" className="w-full sm:w-auto min-w-[220px]">
                            Visita una Iglesia
                        </CTAButton>
                    </div>
                </section>
            </div>
        </div>
    )
}
