import React from 'react';
import Link from 'next/link';

const HeartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const PeopleIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const PrayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    </svg>
);
const ArrowRight = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

export default function IntentRouter() {
    const cards = [
        { icon: <HeartIcon />, title: "Paz interior", desc: "Descubre cómo encontrar verdadera paz en medio del ruido y las preocupaciones", link: "/conoce-a-jesus" },
        { icon: <PeopleIcon />, title: "Comunidad", desc: "Encuentra una familia de fe cerca de ti donde pertenecer y crecer", link: "/iglesias" },
        { icon: <PrayIcon />, title: "Necesito oración", desc: "Comparte tu necesidad — hay personas reales que orarán por ti", link: "/oracion" },
    ];

    return (
        <section className="py-[100px] px-6 bg-white relative">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-[#1E3A5F] mb-3">
                        ¿Qué estás buscando hoy?
                    </h2>
                    <p className="text-[#6B7280] text-[17px] max-w-[520px] mx-auto font-normal">
                        Sea lo que sea que te trajo aquí, estás en el lugar correcto
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, i) => (
                        <Link href={card.link} key={i} className="group block">
                            <div className="bg-white rounded-[16px] p-9 border-2 border-[#E8E4DC] h-full transition-all duration-300 ease-in-out relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(30,58,95,0.15)] hover:border-[#D4A843]">
                                {/* Top Border Indicator */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D4A843] scale-x-0 origin-left transition-transform duration-350 group-hover:scale-x-100" />

                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A5F]/5 to-[#D4A843]/10 flex items-center justify-center text-[#1E3A5F] mb-5">
                                    {card.icon}
                                </div>

                                <h3 className="font-serif text-[22px] text-[#1E3A5F] mb-2">
                                    {card.title}
                                </h3>

                                <p className="text-[#6B7280] text-[15px] mb-4 leading-[1.6]">
                                    {card.desc}
                                </p>

                                <span className="inline-flex items-center gap-1.5 text-[#D4A843] font-semibold text-[14px] transition-all duration-300 group-hover:gap-2.5">
                                    Explorar <ArrowRight />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
