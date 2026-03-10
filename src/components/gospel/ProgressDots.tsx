"use client";

import { useEffect, useState } from "react";

const dotLabels = ["Propósito", "El Vacío", "El Amor", "Vida Nueva", "Oración"];

export default function ProgressDots() {
    const [activeChapter, setActiveChapter] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // Find sections based on IDs
            const sections = [
                document.getElementById('ch-1'),
                document.getElementById('ch-2'),
                document.getElementById('ch-3'),
                document.getElementById('ch-4'),
                document.getElementById('prayer-section'), // we need to add this ID to SalvationPrayer
            ];

            const offsets = sections.map(el => el ? el.getBoundingClientRect().top : 9999);

            let active = 0;
            for (let i = offsets.length - 1; i >= 0; i--) {
                // If top of section is above the middle of viewport
                if (offsets[i] < window.innerHeight * 0.5) {
                    active = i;
                    break;
                }
            }

            setActiveChapter(active);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (i: number) => {
        const sections = [
            document.getElementById('ch-1'),
            document.getElementById('ch-2'),
            document.getElementById('ch-3'),
            document.getElementById('ch-4'),
            document.getElementById('prayer-section'),
        ];

        const el = sections[i];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (i === 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[90] hidden md:flex flex-col gap-3.5">
            {dotLabels.map((label, i) => (
                <div
                    key={i}
                    className="group relative w-2.5 h-2.5 rounded-full bg-[#1E3A5F]/15 border-[1.5px] border-[#1E3A5F]/20 cursor-pointer transition-all duration-400"
                    style={activeChapter === i ? {
                        background: '#D4A843',
                        borderColor: '#D4A843',
                        boxShadow: '0 0 0 4px rgba(212,168,67,0.2)'
                    } : {}}
                    onClick={() => scrollTo(i)}
                >
                    <span
                        className={`absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium text-gray-500 transition-opacity duration-300 pointer-events-none
                        ${activeChapter === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
}
