import React from 'react';
import Link from 'next/link';
import { sanityFetch } from '@/lib/sanity/client';
import { GET_ALL_TESTIMONIES_QUERY } from '@/lib/sanity/queries';

export type TestimonyPreview = {
    _id: string;
    personName: string;
    slug: string;
    headline?: string;
    shortVersion?: string;
    category?: string;
};

const ArrowRight = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

const CrossPattern = ({ opacity = 0.04, color = "#1E3A5F" }) => (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}>
        <defs>
            <pattern id="crossPatternTestimony" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="30" y1="18" x2="30" y2="42" stroke={color} strokeWidth="1.2" />
                <line x1="22" y1="28" x2="38" y2="28" stroke={color} strokeWidth="1.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crossPatternTestimony)" />
    </svg>
);

export default async function TestimoniesPreview() {
    // Tomamos 3 testimonios al azar o los últimos 3 para el preview.
    // Como el query trae todos, solo tomamos los primeros 3 aquí.
    const allTestimonies = await sanityFetch<TestimonyPreview[]>({ query: GET_ALL_TESTIMONIES_QUERY });
    const testimonies = allTestimonies.slice(0, 3);

    return (
        <section className="py-[100px] px-6 bg-[#F8F6F0] relative overflow-hidden">
            <CrossPattern opacity={0.025} />

            <div className="max-w-[1120px] mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-[#1E3A5F] mb-3">
                        Vidas Transformadas
                    </h2>
                    <p className="text-[#6B7280] text-[17px] max-w-[520px] mx-auto font-normal">
                        Historias reales de personas como tú
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                    {testimonies.map((t: TestimonyPreview) => (
                        <div key={t._id} className="bg-white rounded-[16px] px-7 py-9 text-center border border-[#E8E4DC] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group flex flex-col items-center">
                            <div className="w-[72px] h-[72px] rounded-full mx-auto mb-5 bg-gradient-to-br from-[#1E3A5F] to-[#2a5280] flex items-center justify-center text-white font-serif text-[26px] shadow-[0_4px_15px_rgba(30,58,95,0.2)]">
                                {t.personName ? t.personName.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div className="relative font-serif italic text-[17px] text-[#2C2C2C] leading-[1.7] mb-4 flex-grow">
                                <span className="block font-serif text-[64px] text-[#D4A843] opacity-30 leading-none h-[22px] -mt-2">&quot;</span>
                                {t.shortVersion || t.headline}
                            </div>
                            <div className="font-semibold text-[#1E3A5F] text-[15px]">{t.personName}</div>
                            <Link href={`/testimonios/${t.slug}`} className="inline-flex items-center justify-center gap-1.5 text-[#D4A843] font-semibold text-[14px] mt-3 transition-all duration-300 group-hover:gap-2.5">
                                Leer historia completa <ArrowRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href="/testimonios" className="inline-flex items-center gap-2 text-[#D4A843] font-semibold text-[15px] hover:text-[#E8C976] transition-colors">
                        Ver más testimonios <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
