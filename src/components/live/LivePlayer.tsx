'use client';

import React from 'react';

interface LivePlayerProps {
    videoId: string;
    isLive: boolean;
}

export default function LivePlayer({ videoId, isLive }: LivePlayerProps) {
    return (
        <div className="w-full max-w-[1000px] mx-auto rounded-xl overflow-hidden shadow-2xl bg-black/50 border border-white/10 relative z-10">
            <div className="relative pt-[56.25%] w-full">
                {videoId ? (
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=${isLive ? 1 : 0}&rel=0`}
                        title="Transmisión en vivo"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-[#0a1526]">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 mb-4">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                        </svg>
                        <p className="text-white/50 text-sm font-medium">Transmisión no disponible en este momento</p>
                    </div>
                )}
            </div>
        </div>
    );
}
