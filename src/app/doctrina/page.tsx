import { Metadata } from 'next'
import { doctrinePoints } from '@/lib/data/doctrine'
import DoctrineHero from '@/components/doctrine/DoctrineHero'
import DoctrineCard from '@/components/doctrine/DoctrineCard'
import DoctrineNavigation from '@/components/doctrine/DoctrineNavigation'
import CTAButton from '@/components/shared/CTAButton'
import { Heart, MapPin } from 'lucide-react'
import Breadcrumb from '@/components/shared/Breadcrumb'

export const metadata: Metadata = {
    title: 'Doctrina Cristiana | Creencias de Fe | MMM Chile',
    description: 'Conoce los fundamentos bíblicos de nuestra fe cristiana. Doctrina evangélica pentecostal basada en la Santa Biblia.',
    alternates: {
        canonical: 'https://mmmchile.cl/doctrina',
    },
}

export default function DoctrinePage() {
    // Generate FAQ Schema for SEO
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: doctrinePoints.map((point) => ({
            '@type': 'Question',
            name: `¿Qué creen sobre ${point.title}?`,
            acceptedAnswer: {
                '@type': 'Answer',
                text: point.summary + ' ' + point.fullExplanation,
            },
        })),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="min-h-screen flex flex-col bg-[#F8F6F0]">
                <main className="flex-1">
                    <DoctrineHero />

                    {/* Breadcrumb */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
                        <Breadcrumb items={[{ label: 'Doctrina' }]} />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative items-start">

                            {/* Navigation Sidebar */}
                            <aside className="w-full md:w-64 lg:w-80 shrink-0">
                                <DoctrineNavigation doctrines={doctrinePoints} />
                            </aside>

                            {/* Main Content Area */}
                            <div className="flex-1 w-full max-w-3xl">
                                {doctrinePoints.map((doctrine) => (
                                    <DoctrineCard key={doctrine.id} doctrine={doctrine} />
                                ))}

                                {/* Embedded CTA Section */}
                                <section className="mt-20 pt-16 border-t border-gray-200/60 pb-8">
                                    <div className="text-center">
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E3A5F] mb-6">
                                            ¿Quieres conocer más?
                                        </h2>
                                        <p className="text-[#6B7280] text-lg mb-10 max-w-2xl mx-auto">
                                            La fe no es solo doctrina, es una experiencia personal. Te invitamos a dar el siguiente paso en tu viaje espiritual con Dios.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                                            <CTAButton
                                                href="/conoce-a-jesus"
                                                variant="primary"
                                                className="w-full sm:w-auto min-w-[220px]"
                                            >
                                                <Heart className="w-5 h-5 mr-2" />
                                                Conoce a Jesús
                                            </CTAButton>

                                            <CTAButton
                                                href="/iglesias"
                                                variant="secondary"
                                                className="w-full sm:w-auto min-w-[220px]"
                                            >
                                                <MapPin className="w-5 h-5 mr-2" />
                                                Visita una Iglesia
                                            </CTAButton>
                                        </div>
                                    </div>
                                </section>

                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
