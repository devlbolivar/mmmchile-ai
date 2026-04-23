"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { incrementPrayCount } from "@/app/oracion/actions/incrementPrayCount";

const LS_KEY = "mmm_prayed";

export type Prayer = {
    id: string | number;
    name: string;
    text: string;
    date: string;
    prayCount: number;
    color: string;
};

export function PrayerWallList({ initialPrayers }: { initialPrayers: Prayer[] }) {
    const [prayedIds, setPrayedIds] = useState<Set<string | number>>(new Set());
    const [wallFilter, setWallFilter] = useState<"recientes" | "oradas">("recientes");
    const [wallCount, setWallCount] = useState(9);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(LS_KEY);
            if (stored) setPrayedIds(new Set(JSON.parse(stored)));
        } catch {}
    }, []);

    const handlePray = useCallback((id: string | number) => {
        setPrayedIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            try {
                localStorage.setItem(LS_KEY, JSON.stringify([...next]));
            } catch {}
            return next;
        });
        incrementPrayCount(id as string).catch(() => {});
    }, []);

    const sortedPrayers = useMemo(() => {
        const list = [...initialPrayers];
        if (wallFilter === "oradas") {
            list.sort(
                (a, b) =>
                    b.prayCount + (prayedIds.has(b.id) ? 1 : 0) - (a.prayCount + (prayedIds.has(a.id) ? 1 : 0))
            );
        }
        return list;
    }, [initialPrayers, wallFilter, prayedIds]);

    return (
        <section
            className="max-w-[1100px] mx-auto px-6 pt-[60px] pb-[80px]"
            aria-label="Muro de oración comunitario"
        >
            <div className="text-center mb-9">
                <h2 className="font-serif text-[clamp(26px,4vw,36px)] text-primary mb-2 font-medium">
                    Muro de Oración
                </h2>
                <p className="text-[15px] text-muted leading-relaxed">
                    Únete en oración por estas necesidades. Tu oración importa.
                </p>
            </div>

            <div className="flex gap-2 justify-center mb-8" role="tablist" aria-label="Filtros del muro de oración">
                <button
                    role="tab"
                    aria-selected={wallFilter === "recientes"}
                    className={`px-[18px] py-2 rounded-full text-[13px] font-bold border-2 transition-all duration-200 cursor-pointer ${wallFilter === "recientes"
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted border-border hover:border-accent hover:text-primary"
                        }`}
                    onClick={() => setWallFilter("recientes")}
                >
                    Más recientes
                </button>
                <button
                    role="tab"
                    aria-selected={wallFilter === "oradas"}
                    className={`px-[18px] py-2 rounded-full text-[13px] font-bold border-2 transition-all duration-200 cursor-pointer ${wallFilter === "oradas"
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted border-border hover:border-accent hover:text-primary"
                        }`}
                    onClick={() => setWallFilter("oradas")}
                >
                    Más oradas
                </button>
            </div>

            {sortedPrayers.length === 0 ? (
                <div className="text-center py-10 bg-white border-2 border-dashed border-border rounded-xl" role="status">
                    <p className="text-muted">Aún no hay peticiones públicas recientes. ¡Sé el primero en compartir!</p>
                </div>
            ) : (
                <div
                    className="columns-1 md:columns-2 lg:columns-3 gap-5"
                    role="feed"
                    aria-label="Peticiones de oración"
                >
                    {sortedPrayers.slice(0, wallCount).map((p, i) => (
                        <PrayerCard
                            key={p.id}
                            prayer={p}
                            hasPrayed={prayedIds.has(p.id)}
                            onPray={handlePray}
                            animDelay={i * 0.04}
                        />
                    ))}
                </div>
            )}

            {wallCount < sortedPrayers.length && (
                <div className="text-center mt-8">
                    <button
                        onClick={() => setWallCount((c) => c + 6)}
                        aria-label={`Mostrar más peticiones de oración. Mostrando ${Math.min(wallCount, sortedPrayers.length)} de ${sortedPrayers.length}`}
                        className="px-9 py-3.5 rounded-xl bg-white border-2 border-border text-[14px] font-bold text-primary cursor-pointer transition-all duration-300 hover:border-accent hover:text-accent hover:shadow-md"
                    >
                        Ver más peticiones
                    </button>
                </div>
            )}
        </section>
    );
}

function PrayerCard({
    prayer,
    hasPrayed,
    onPray,
    animDelay,
}: {
    prayer: Prayer;
    hasPrayed: boolean;
    onPray: (id: string | number) => void;
    animDelay: number;
}) {
    const nameColors = ["#1E3A5F", "#7C3AED", "#0891B2", "#DC2626", "#059669", "#D4A843"];
    const colorIdx = prayer.name === "Anónimo" ? 0 : prayer.name.charCodeAt(0) % nameColors.length;

    // Optimistic count for instant visual feedback
    const displayCount = prayer.prayCount + (hasPrayed ? 1 : 0);

    return (
        <article
            className="break-inside-avoid mb-5 rounded-2xl p-6 border border-border
        transition-[transform,box-shadow] duration-300 ease-out
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1
        animate-[cardIn_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ background: prayer.color, animationDelay: `${animDelay}s` }}
            aria-label={`Petición de oración de ${prayer.name}`}
        >
            <div className="font-bold text-[14px] text-primary mb-2 flex items-center gap-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
                    style={{ background: nameColors[colorIdx] }}
                    aria-hidden="true"
                >
                    {prayer.name === "Anónimo" || !prayer.name ? "?" : prayer.name[0].toUpperCase()}
                </div>
                <span>{prayer.name}</span>
            </div>

            <p className="text-[15px] text-[#4a4a4a] leading-relaxed mb-3.5 whitespace-pre-wrap">
                {prayer.text}
            </p>

            <div className="flex items-center justify-between">
                <time className="text-[12px] text-light">{prayer.date}</time>
                <button
                    onClick={() => { if (!hasPrayed) onPray(prayer.id); }}
                    aria-label={hasPrayed ? `Ya oraste por esta petición. ${displayCount} personas han orado` : `Orar por esta petición. ${displayCount} personas han orado`}
                    aria-pressed={hasPrayed}
                    disabled={hasPrayed}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 text-[12px] font-bold
            transition-all duration-300 ease-out
            ${hasPrayed
                            ? "border-accent text-accent bg-accent/10 shadow-[0_2px_8px_rgba(212,168,67,0.15)] cursor-default"
                            : "bg-white text-muted border-border hover:border-accent hover:text-accent hover:bg-accent/5 hover:shadow-sm cursor-pointer active:scale-95"
                        }`}
                >
                    <span
                        className={`text-[14px] transition-transform duration-300 ease-out ${hasPrayed ? "scale-125" : ""}`}
                        aria-hidden="true"
                    >
                        🙏
                    </span>
                    <span>{hasPrayed ? "Oré por esto" : "Orar"}</span>
                    <span className="font-extrabold text-accent">
                        {displayCount}
                    </span>
                </button>
            </div>
        </article>
    );
}
