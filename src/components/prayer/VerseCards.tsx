"use client";

import { useState, useEffect } from "react";

const VERSES = [
    { text: "Echa toda tu ansiedad sobre él, porque él tiene cuidado de ti.", ref: "1 Pedro 5:7" },
    { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", ref: "Mateo 11:28" },
    { text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", ref: "Jeremías 33:3" },
    { text: "Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.", ref: "Salmos 23:1-2" },
    { text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.", ref: "Isaías 41:10" },
    { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.", ref: "Juan 14:27" },
];

export function VerseCards() {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const iv = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIdx((i) => (i + 1) % VERSES.length);
                setFade(true);
            }, 400);
        }, 6000);
        return () => clearInterval(iv);
    }, []);

    const handleDotClick = (i: number) => {
        if (i === idx) return;
        setFade(false);
        setTimeout(() => {
            setIdx(i);
            setFade(true);
        }, 300);
    };

    return (
        <div className="bg-white rounded-[20px] p-7 md:p-8 border border-border relative overflow-hidden shadow-[0_4px_20px_rgba(30,58,95,0.03)]">
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-pale to-accent" />

            <div className="text-[12px] font-extrabold tracking-[1.5px] uppercase text-accent mb-5">
                Promesas de Dios para Ti
            </div>

            <div
                className={`font-serif italic text-[18px] leading-relaxed text-primary mb-3 min-h-[96px] transition-opacity duration-500 flex items-center ${fade ? "opacity-100" : "opacity-0"
                    }`}
            >
                &quot;{VERSES[idx].text}&quot;
            </div>

            <div className="text-[13px] font-bold text-accent mb-4">— {VERSES[idx].ref}</div>

            <div className="flex gap-1.5 justify-center">
                {VERSES.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${i === idx ? "bg-accent w-5" : "bg-border w-2"
                            }`}
                        onClick={() => handleDotClick(i)}
                    />
                ))}
            </div>
        </div>
    );
}
