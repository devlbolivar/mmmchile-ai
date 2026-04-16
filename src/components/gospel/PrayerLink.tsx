'use client';

import React from 'react';
import Link from 'next/link';

export default function PrayerLink() {
    return (
        <section className="py-16 px-6 bg-[#F8F6F0]">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-[#F5E6C4] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z" />
                        <path d="M12 3v9" />
                        <path d="M12 3c-2 0-3 2-3 4s3 5 3 5 3-3 3-5-1-4-3-4z" />
                    </svg>
                </div>
                <h3 className="font-serif text-[28px] text-[#1E3A5F] mb-4">
                    ¿Podemos orar por ti ahora mismo?
                </h3>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                    Si estás pasando por un momento difícil o simplemente necesitas que alguien se una a ti en oración, no tienes que hacerlo solo.
                </p>
                <Link
                    href="/oracion"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#1E3A5F] border-2 border-[#1E3A5F] px-8 py-3.5 rounded-lg font-bold font-sans transition-all hover:bg-[#1E3A5F] hover:text-white group"
                >
                    Ir al Muro de Oración
                    <svg 
                        className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
