"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { PlayCircle } from "./Icons";

export default function SalvationPrayer() {
    // For audio playback, we can add a simple state
    const [isPlaying, setIsPlaying] = useState(false);

    // We assume the audio file might not exist yet according to requirements.
    // When the real file is added to public/audio/oracion-de-fe.mp3, this will work.

    const togglePlayback = () => {
        // TODO: Implement actual audio playback here
        setIsPlaying(!isPlaying);
        alert("Audio de la oración se reproducirá aquí cuando el archivo esté disponible.");
    };

    return (
        <section id="prayer-section" className="relative py-24 px-6 text-center overflow-hidden bg-gradient-to-br from-[#F5E6C4] via-[#F0DDB8] to-[#F5E6C4]">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,0.5)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-[620px] mx-auto">
                <Reveal>
                    <h2 className="font-serif text-[clamp(28px,4.5vw,42px)] text-[#1E3A5F] mb-3 font-medium">
                        ¿Quieres dar este paso?
                    </h2>
                </Reveal>

                <Reveal delay={0.15}>
                    <p className="text-[17px] text-gray-500 leading-[1.7] mb-10 font-light max-w-lg mx-auto">
                        Si algo en tu corazón está resonando con estas palabras, puedes hacer esta oración ahora mismo.
                        No necesitas palabras perfectas — Dios escucha tu corazón.
                    </p>
                </Reveal>

                <Reveal delay={0.25}>
                    <div className="bg-white/70 backdrop-blur-md rounded-[18px] p-8 md:p-10 border border-[#D4A843]/25 shadow-[0_8px_40px_rgba(212,168,67,0.1)]">
                        <p className="font-serif italic text-xl leading-[1.8] text-[#1E3A5F] font-normal select-text">
                            Dios, reconozco que te necesito. Creo que Jesús murió por mí y resucitó.
                            Hoy abro mi corazón y te recibo como mi Salvador. Perdona mis pecados y dame una vida nueva.
                            En el nombre de Jesús, amén.
                        </p>

                        {/* <button
                            onClick={togglePlayback}
                            className="inline-flex items-center gap-2.5 mt-6 px-6 py-3 rounded-full border-[1.5px] border-[#D4A843] bg-white/60 text-[#1E3A5F] font-sans text-[15px] font-medium transition-all hover:bg-[#D4A843] hover:text-[#0F2035] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2"
                        >
                            <PlayCircle /> Escuchar esta oración
                        </button> */}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
