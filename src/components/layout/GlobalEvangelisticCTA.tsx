'use client';

import React from 'react';
import Link from 'next/link';

export default function GlobalEvangelisticCTA() {
    return (
        <section className="bg-gradient-to-r from-[#1E3A5F] to-[#142640] py-12 px-6 border-b border-[#0F2035]">
            <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left text-white max-w-2xl">
                    <h3 className="font-serif text-[24px] sm:text-[28px] mb-2 leading-tight">
                        ¿Buscas paz en medio de la tormenta?
                    </h3>
                    <p className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed">
                        Miles han encontrado un propósito real y amor incondicional. Tú también puedes conocerlo hoy mismo.
                    </p>
                </div>
                <div className="shrink-0 w-full sm:w-auto">
                    <Link 
                        href="/conoce-a-jesus" 
                        className="flex items-center justify-center gap-2 bg-[#D4A843] text-[#0F2035] px-8 py-3.5 rounded-lg font-bold font-sans text-[15px] transition-all shadow-[0_4px_16px_rgba(212,168,67,0.2)] hover:bg-[#E8C976] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(212,168,67,0.3)] w-full"
                    >
                        Conocer a Jesús
                    </Link>
                </div>
            </div>
        </section>
    );
}
