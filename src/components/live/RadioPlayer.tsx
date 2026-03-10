'use client';

import React, { useState, useRef, useEffect } from 'react';

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const RadioIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2" />
        <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
        <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
);

export default function RadioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [randomVals, setRandomVals] = useState<number[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Placeholder audio stream 
    // You should replace this with the actual MMM Chile radio URL if available
    const audioStreamUrl = "https://stream.zeno.fm/0r0xa792kwzuv";

    useEffect(() => {
        const t = setTimeout(() => setRandomVals([...Array(8)].map(() => Math.random())), 0);
        audioRef.current = new Audio(audioStreamUrl);
        return () => {
            clearTimeout(t);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="bg-[#1E3A5F] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl w-full max-w-4xl mx-auto relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#D4A843]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <button
                    onClick={togglePlay}
                    className="w-16 h-16 shrink-0 rounded-full bg-[#D4A843] text-[#0F2035] flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,168,67,0.3)]"
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#25D366] animate-pulse' : 'bg-white/30'}`} />
                        <img src="/logo-bethel.png" alt="Radio Bethel Logo" className="h-[28px] w-auto object-contain" />
                        <h3 className="font-serif text-xl font-semibold text-white hidden sm:block">Radio Bethel</h3>
                    </div>
                    <p className="text-white/60 text-sm">Escucha bendición musical 24/7</p>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-white/40 relative z-10">
                <div className={`flex items-center gap-[2px] h-8 ${isPlaying ? 'opacity-100' : 'opacity-30'} transition-opacity`}>
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-[#D4A843] rounded-full"
                            style={{
                                height: isPlaying ? `${Math.max(20, (randomVals[i] || 0.5) * 100)}%` : '20%',
                                animation: isPlaying ? `equalizer ${0.5 + (randomVals[i] || 0.5)}s ease-in-out infinite alternate` : 'none'
                            }}
                        />
                    ))}
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes equalizer {
                        0% { height: 20%; }
                        100% { height: 100%; }
                    }
                `}} />
            </div>

            <div className="w-full md:w-auto flex justify-center relative z-10 mt-4 md:mt-0">
                <div className="bg-white/10 rounded-full px-4 py-2 border border-white/5 flex items-center gap-2">
                    <RadioIcon />
                    <span className="text-sm font-medium text-white/80">Transmisión Digital</span>
                </div>
            </div>
        </div>
    );
}
