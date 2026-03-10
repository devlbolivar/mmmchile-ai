import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactMap from '@/components/contact/ContactMap';
import ContactFAQ from '@/components/contact/ContactFAQ';
import ContactFunnel from '@/components/contact/ContactFunnel';
import Breadcrumb from '@/components/shared/Breadcrumb';

export const metadata: Metadata = {
    title: 'Contacto | MMM Chile — Estamos Aquí Para Ti',
    description: 'Contáctanos para información general, petición de oración o para visitar nuestras iglesias. Iglesia Cristiana Movimiento Misionero Mundial en Chile.',
};

export default function ContactPage() {
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contacto | MMM Chile",
            description: "Página de contacto del Movimiento Misionero Mundial en Chile",
            url: "https://mmmchile.cl/contacto"
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Movimiento Misionero Mundial Chile",
            url: "https://mmmchile.cl",
            logo: "https://mmmchile.cl/logo.png",
            telephone: "+56975587223",
            email: "secretariammmchile@gmail.com",
            address: {
                "@type": "PostalAddress",
                streetAddress: "General Gana 924",
                addressLocality: "Santiago",
                addressRegion: "Región Metropolitana",
                postalCode: "8360000",
                addressCountry: "CL"
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: -33.4682337,
                longitude: -70.6483162
            },
            openingHoursSpecification: [
                {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    opens: "09:00",
                    closes: "19:00"
                }
            ],
            sameAs: [
                "https://web.facebook.com/MMMCHILEORG/",
                "https://www.youtube.com/@KoinoniaMMMChileOficial",
                "https://www.instagram.com/chile_mmm/"
            ]
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-cream pb-0">
                <ContactHero />

                {/* Breadcrumb */}
                <div className="max-w-[1060px] mx-auto px-6 pt-6">
                    <Breadcrumb items={[{ label: 'Contacto' }]} />
                </div>

                {/* Form and Info Section */}
                <section className="max-w-[1060px] mx-auto px-6 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
                        <div className="order-2 lg:order-1">
                            <Suspense fallback={<div className="bg-white rounded-[20px] p-10 border border-[#E8E2D8] animate-pulse h-[500px]" />}>
                                <ContactForm />
                            </Suspense>
                        </div>
                        <div className="order-1 lg:order-2">
                            <ContactInfo />
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="bg-white py-16 md:py-24 border-y border-[#E8E2D8]">
                    <div className="max-w-[1060px] mx-auto px-6">
                        <ContactMap />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 md:py-32 px-6">
                    <ContactFAQ />
                </section>

                {/* Funnel CTAs */}
                <ContactFunnel />
            </main>
        </>
    );
}
