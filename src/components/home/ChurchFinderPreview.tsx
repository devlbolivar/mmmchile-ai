"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import type { ChurchListItem } from '@/lib/types/church';

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const MapPinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const ArrowRight = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

const ChileMapSVG = () => {
    const cities = [
        { name: "Arica", top: "2%", left: "55%" },
        { name: "Iquique", top: "8%", left: "52%" },
        { name: "Antofagasta", top: "17%", left: "50%" },
        { name: "La Serena", top: "30%", left: "42%" },
        { name: "Valparaíso", top: "42%", left: "38%" },
        { name: "Santiago", top: "45%", left: "44%" },
        { name: "Concepción", top: "60%", left: "40%" },
        { name: "Temuco", top: "68%", left: "42%" },
        { name: "Puerto Montt", top: "76%", left: "40%" },
        { name: "Punta Arenas", top: "95%", left: "38%" },
    ];
    return (
        <div className="relative w-full max-w-[200px] h-[500px] mx-auto md:mr-auto md:ml-0">
            <svg viewBox="0 0 100 500" className="w-full h-full">
                <path
                    d="M55 5 Q60 10, 52 30 Q48 50, 50 70 Q52 90, 48 120 Q44 150, 42 180 Q38 210, 40 240 Q42 270, 40 300 Q38 330, 42 360 Q44 390, 40 420 Q38 440, 40 460 Q42 475, 38 490 L35 495 Q30 490, 35 460 Q32 430, 34 400 Q30 370, 32 340 Q28 310, 30 280 Q28 250, 32 220 Q34 190, 38 160 Q40 130, 42 100 Q44 70, 48 40 Q50 20, 55 5"
                    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                />
            </svg>
            {cities.map((city, i) => (
                <div
                    key={i}
                    className="absolute w-[10px] h-[10px] bg-[#D4A843] rounded-full -translate-x-1/2 -translate-y-1/2 animate-[pulse-dot_2s_ease-in-out_infinite]"
                    style={{ top: city.top, left: city.left, animationDelay: `${i * 0.2}s`, boxShadow: "0 0 0 3px rgba(212,168,67,0.3)" }}
                    title={city.name}
                />
            ))}
        </div>
    );
};

export default function ChurchFinderPreview({ churches }: { churches?: ChurchListItem[] }) {
    const [searchCity, setSearchCity] = useState("");

    const churchList = churches || [];

    const filteredChurches = churchList.filter(c => c.city.toLowerCase().includes(searchCity.toLowerCase()));

    return (
        <section className="py-[100px] px-6 bg-[#1E3A5F]">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-white mb-3">
                        Hay una Iglesia Esperándote
                    </h2>
                    <p className="text-white/70 text-[17px] max-w-[520px] mx-auto font-normal">
                        Más de 30 iglesias en todo Chile, desde Arica hasta Punta Arenas
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 text-center md:text-left">
                        <ChileMapSVG />
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="flex bg-white/10 border border-white/20 rounded-[10px] overflow-hidden mb-7">
                            <input
                                type="text"
                                placeholder="Ingresa tu ciudad o comuna"
                                aria-label="Ingresa tu ciudad o comuna"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                className="flex-1 p-[14px_18px] bg-transparent border-none text-white text-[15px] font-sans outline-none placeholder:text-white/50"
                            />
                            <button aria-label="Buscar" className="p-[14px_18px] bg-[#D4A843] border-none cursor-pointer flex items-center text-[#0F2035] transition-colors hover:bg-[#E8C976]">
                                <SearchIcon />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredChurches.length > 0 ? filteredChurches.map((c, i) => (
                                <Link key={c._id || i} href={c.slug ? `/iglesias/${c.slug}` : "/iglesias"} className="block bg-white/5 border border-white/10 rounded-[10px] p-4 transition-colors duration-300 hover:bg-white/10">
                                    <h4 className="text-white text-[15px] font-semibold mb-1">{c.name}</h4>
                                    <p className="text-white/60 text-[13px] flex items-center gap-1 mb-1.5"><MapPinIcon /> {c.city}{c.address ? `, ${c.address}` : ''}</p>
                                    <span className="text-[#D4A843] text-[13px] font-semibold flex items-center gap-1">
                                        Ver horarios <ArrowRight size={12} />
                                    </span>
                                </Link>
                            )) : (
                                <p className="text-white/60 text-[14px] text-center py-4">No se encontraron iglesias en esa ciudad.</p>
                            )}
                        </div>
                        <div className="mt-6 text-center md:text-left">
                            <Link href="/iglesias" className="text-white text-[14px] underline underline-offset-4 hover:text-[#D4A843] transition-colors">Ver todas las iglesias</Link>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}} />
        </section>
    );
}
