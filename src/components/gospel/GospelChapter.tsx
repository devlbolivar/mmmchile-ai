import { ReactNode } from "react";
import { Reveal } from "./Reveal";
import BibleVerse from "@/components/shared/BibleVerse";

interface GospelChapterProps {
    id: string;
    num: string;
    title: string;
    paragraphs: string[];
    verse: string;
    verseRef: string;
    icon: ReactNode;
    colorTheme: 'ch-1' | 'ch-2' | 'ch-3' | 'ch-4';
}

export default function GospelChapter({
    id, num, title, paragraphs, verse, verseRef, icon, colorTheme
}: GospelChapterProps) {

    const themes = {
        'ch-1': {
            bg: 'bg-gradient-to-b from-white to-[#F8F6F0]',
            num: 'text-[#D4A843]',
            title: 'text-[#1E3A5F]',
            text: 'text-[#2C2C2C]',
            verseCard: 'border-[#D4A843]',
            verseBg: 'bg-[#1E3A5F]/[0.04]',
            verseText: 'text-[#1E3A5F]',
            verseRef: 'text-[#D4A843]'
        },
        'ch-2': {
            bg: 'bg-gradient-to-b from-[#2A2A35] to-[#1F1F28]',
            num: 'text-white/50',
            title: 'text-[#E8E4DC]',
            text: 'text-[#E8E4DC]/75',
            verseCard: '!border-white/20',
            verseBg: 'bg-white/[0.04]',
            verseText: 'text-[#E8E4DC]',
            verseRef: 'text-white/40'
        },
        'ch-3': {
            bg: 'bg-gradient-to-b from-[#1F1F28] via-[#1E3A5F] to-[#2A4A6F]',
            num: 'text-[#D4A843]',
            title: 'text-[#F5E6C4]',
            text: 'text-[#F8F6F0]/80',
            verseCard: 'border-[#D4A843]',
            verseBg: 'bg-[#D4A843]/[0.08]',
            verseText: 'text-[#F8F6F0]',
            verseRef: 'text-[#D4A843]'
        },
        'ch-4': {
            bg: 'bg-gradient-to-b from-[#F8F6F0] to-white',
            num: 'text-[#D4A843]',
            title: 'text-[#1E3A5F]',
            text: 'text-[#2C2C2C]',
            verseCard: 'border-[#D4A843]',
            verseBg: 'bg-gradient-to-br from-[#D4A843]/[0.06] to-[#1E3A5F]/[0.04]',
            verseText: 'text-[#1E3A5F]',
            verseRef: 'text-[#D4A843]'
        }
    };

    const t = themes[colorTheme];

    return (
        <section id={id} className={`chapter relative min-h-[100svh] flex items-center justify-center py-20 px-6 overflow-hidden ${t.bg}`}>
            <div className="relative z-10 w-full max-w-[680px]">
                {/* Chapter Number Background */}
                <div className={`absolute -top-10 -left-6 md:-left-12 font-serif font-light text-[clamp(140px,22vw,240px)] opacity-5 leading-none select-none pointer-events-none ${t.num}`}>
                    {num}
                </div>

                <Reveal delay={0.05} className="flex justify-center mb-6">
                    {icon}
                </Reveal>

                <Reveal delay={0.15}>
                    <h2 className={`font-serif text-[clamp(28px,4.5vw,44px)] leading-[1.2] mb-7 font-medium ${t.title}`}>
                        {title}
                    </h2>
                </Reveal>

                <div className="space-y-5">
                    {paragraphs.map((p, j) => (
                        <Reveal key={j} delay={0.2 + j * 0.1}>
                            <p className={`text-[18px] leading-[1.85] font-light ${t.text}`}>
                                {p}
                            </p>
                        </Reveal>
                    ))}
                </div>

                <Reveal delay={0.2 + paragraphs.length * 0.1}>
                    <div className="mt-9">
                        <BibleVerse
                            verse={verse}
                            reference={verseRef}
                            className={t.verseCard}
                            bgClass={t.verseBg}
                            textClass={t.verseText}
                            refClass={t.verseRef}
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
