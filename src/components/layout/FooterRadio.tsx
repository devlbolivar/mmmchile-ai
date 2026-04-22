'use client';

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
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

export default function FooterRadio() {
    const { isPlaying, isLoading, toggle } = useRadio();

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3.5 flex items-center gap-3">
            <button
                onClick={toggle}
                className="w-10 h-10 rounded-full cursor-pointer bg-[#D4A843] text-[#0F2035] flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                aria-label={isPlaying ? "Pausar Radio" : "Reproducir Radio"}
            >
                {isLoading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#0F2035] border-t-transparent animate-spin" />
                ) : isPlaying ? (
                    <PauseIcon />
                ) : (
                    <PlayIcon />
                )}
            </button>
            <div>
                <p className="text-white text-[13px] font-semibold flex items-center gap-1.5">
                    <RadioIcon /> Radio Bethel Chile
                </p>
                <p className="text-[12px] opacity-70">
                    {isLoading ? "Conectando..." : isPlaying ? "Escuchando ahora..." : "Radio 24/7"}
                </p>
            </div>
        </div>
    );
}
