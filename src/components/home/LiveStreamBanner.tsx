'use client';

import React from 'react';
import Link from 'next/link';
import { useRadio } from '@/components/radio/RadioContext';

const RadioIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
);

const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    </svg>
);

export default function LiveStreamBanner() {
    const { toggle, isPlaying, isLoading } = useRadio();

    return (
        <section className="bg-[linear-gradient(135deg,#1E3A5F_0%,#1a4a7a_50%,#1E3A5F_100%)] p-[60px_24px] text-center relative overflow-hidden">
            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full mb-4 text-[13px] font-semibold text-white tracking-[0.5px]">
                    <div className="w-2 h-2 bg-[#EF4444] rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                    EN VIVO
                </div>

                <h2 className="font-serif text-[clamp(24px,3.5vw,36px)] text-white mb-2">
                    Servicios de la Iglesia Central
                </h2>

                <p className="text-white/60 text-[14px] mb-6">
                    Domingos 11:00 AM y 5:00 PM | Martes y Jueves 7:30 PM
                </p>

                <div className="flex gap-3.5 justify-center flex-wrap">
                    <Link
                        href="/en-vivo"
                        className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0F2035] px-6 py-3 rounded-lg text-[14px] font-semibold transition-colors hover:bg-[#E8C976]"
                    >
                        <PlayIcon /> Ver Transmisión
                    </Link>
                    <button
                        onClick={toggle}
                        className="inline-flex items-center cursor-pointer gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg text-[14px] font-semibold transition-colors hover:bg-white/20 disabled:opacity-75"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-[18px] w-[18px] text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : isPlaying ? (
                            <PauseIcon />
                        ) : (
                            <RadioIcon />
                        )}
                        {isLoading ? 'Conectando...' : isPlaying ? 'Pausar Radio' : 'Escuchar Radio'}
                    </button>
                </div>
            </div>
        </section>
    );
}
