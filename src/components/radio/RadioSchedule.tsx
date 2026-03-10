"use client";

import { useState, useEffect, useRef } from "react";
import { schedule, DaySchedule, RadioProgram } from "@/lib/data/radio-schedule";

// ====== HELPERS ======
function parseTime(timeStr: string): number {
    const [timePart, ampm] = timeStr.split(" ");
    const [h, m] = timePart.split(":").map(Number);
    let hours = h;
    if (ampm === "PM" && h !== 12) hours += 12;
    if (ampm === "AM" && h === 12) hours = 0;
    return hours * 60 + m;
}

function getCurrentProgram(programs: RadioProgram[]): number {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    for (let i = programs.length - 1; i >= 0; i--) {
        const progMin = parseTime(programs[i].time);
        const duration = programs[i].durationMinutes || 60; // 60 mins por defecto si no se especifica

        // Si el programa empezó y no ha terminado su duración
        if (currentMin >= progMin && currentMin < progMin + duration) {
            return i;
        }
    }
    return -1;
}

function getDayGroup(): keyof typeof schedule {
    const day = new Date().getDay();
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return "weekdays";
}

// ====== NOW PLAYING INDICATOR ======
function NowBadge() {
    return (
        <span
            className="inline-flex items-center gap-[6px] text-[10px] font-mono tracking-[2px] uppercase text-[#D4A843] font-semibold"
        >
            <span
                className="w-[6px] h-[6px] rounded-full bg-[#D4A843] animate-[nowPulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(212,168,67,0.6)]"
            />
            Ahora
        </span>
    );
}

// ====== SINGLE PROGRAM ROW ======
interface ProgramRowProps {
    time: string;
    name: string;
    isNow: boolean;
    isFeatured?: boolean;
    index: number;
}

function ProgramRow({ time, name, isNow, isFeatured, index }: ProgramRowProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-0 p-0 relative"
            style={{
                animation: `rowReveal 0.4s ease ${index * 0.04}s both`,
            }}
        >
            {/* ── Timeline dot + line ── */}
            <div className="w-[48px] flex flex-col items-center relative self-stretch">
                {/* Vertical line */}
                <div
                    className="absolute top-0 bottom-0 w-[1px]"
                    style={{
                        background: isNow
                            ? "linear-gradient(180deg, rgba(212,168,67,0.4), rgba(212,168,67,0.1))"
                            : "rgba(255,255,255,0.04)",
                    }}
                />
                {/* Dot */}
                <div
                    className={`relative top-[22px] rounded-full transition-all duration-300 z-10 ${isNow ? "w-[10px] h-[10px] bg-[#D4A843]" : "w-[5px] h-[5px]"
                        }`}
                    style={{
                        background: isNow
                            ? "#D4A843"
                            : hovered
                                ? "rgba(212,168,67,0.4)"
                                : "rgba(255,255,255,0.08)",
                        boxShadow: isNow ? "0 0 12px rgba(212,168,67,0.4)" : "none",
                    }}
                />
            </div>

            {/* ── Content ── */}
            <div
                className="py-[14px] flex flex-col gap-[4px] border-b border-white/5 transition-all duration-300 w-full"
                style={{
                    paddingLeft: hovered ? "4px" : "0",
                }}
            >
                {/* Time */}
                <span
                    className={`text-[11.5px] font-mono font-medium tracking-[0.5px] transition-colors duration-300 ${isNow ? "text-[#D4A843]" : "text-[#D4A843]/40"
                        }`}
                >
                    {time}
                </span>

                {/* Program name */}
                <span
                    className={`transition-all duration-300 ${isNow ? "text-[16px] font-normal text-[#F8F6F0] tracking-[0.3px]" : "text-[15px] font-normal"
                        } ${isNow || isFeatured ? "font-serif" : "font-sans"} ${!isNow ? (hovered ? "text-[#C8C0B0]" : "text-[#7A8594]") : ""}`}
                >
                    {name}
                </span>
            </div>

            {/* ── Now badge ── */}
            <div className="pr-[4px] pt-[14px] self-start">
                {isNow && <NowBadge />}
                {isFeatured && !isNow && (
                    <span className="text-[9px] font-mono tracking-[1.5px] uppercase text-[#1E3A5F]/80 bg-[#1E3A5F]/10 px-[8px] py-[3px] rounded-[4px] font-semibold">
                        Culto
                    </span>
                )}
            </div>
        </div>
    );
}

// ====== MAIN SCHEDULE COMPONENT ======
export default function RadioSchedule() {
    const [activeTab, setActiveTab] = useState<keyof typeof schedule>("weekdays");
    const [currentDayGroup, setCurrentDayGroup] = useState<keyof typeof schedule>("weekdays");
    const [nowIndex, setNowIndex] = useState(-1);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const group = getDayGroup();
        setCurrentDayGroup(group);
        setActiveTab(group);
    }, []);

    useEffect(() => {
        if (activeTab === currentDayGroup) {
            setNowIndex(getCurrentProgram(schedule[activeTab].programs));
        } else {
            setNowIndex(-1);
        }
    }, [activeTab, currentDayGroup]);

    // Auto-scroll to now playing
    useEffect(() => {
        if (nowIndex > 0 && scrollRef.current) {
            const rows = scrollRef.current.querySelectorAll("[data-row]");
            if (rows[nowIndex]) {
                setTimeout(() => {
                    rows[nowIndex].scrollIntoView({ behavior: "smooth", block: "center" });
                }, 500);
            }
        }
    }, [nowIndex, activeTab]);

    const tabs = Object.entries(schedule) as [keyof typeof schedule, DaySchedule][];
    const activeData = schedule[activeTab];

    return (
        <div
            className="relative overflow-hidden"
            style={{
                background: "linear-gradient(180deg, #080C14 0%, #0B1018 50%, #0A0E16 100%)",
                padding: "clamp(60px, 10vw, 100px) 20px",
            }}
        >
            {/* Subtle radial glow */}
            <div
                className="absolute top-[-20%] left-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
                style={{
                    transform: "translateX(-50%)",
                    background: "radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)",
                }}
            />

            <div className="max-w-[580px] mx-auto relative">
                {/* ── Header ── */}
                <div className="text-center mb-[40px]">
                    <span className="inline-flex items-center gap-[8px] text-[11px] font-mono tracking-[3px] uppercase text-[#D4A843] font-medium mb-[14px]">
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Programación
                    </span>
                    <h2 className="text-[clamp(26px,5vw,36px)] font-serif font-normal text-[#F8F6F0] m-0 leading-[1.2]">
                        Lo que suena en RBC
                    </h2>
                </div>

                {/* ── Tab Selector ── */}
                <div
                    role="tablist"
                    aria-label="Días de Programación"
                    className="flex bg-white/5 rounded-[14px] p-[4px] mb-[36px] border border-white/5 relative"
                >
                    {tabs.map(([key, data]) => {
                        const isActive = activeTab === key;
                        const isToday = currentDayGroup === key;

                        return (
                            <button
                                key={key}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`panel-${key}`}
                                id={`tab-${key}`}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 py-[12px] px-[8px] rounded-[11px] border-none cursor-pointer text-[13px] font-sans relative transition-all duration-300 flex flex-col items-center gap-[2px] ${isActive ? "text-[#F8F6F0] font-medium" : "text-[#4A5A6A] font-normal"
                                    }`}
                                style={{
                                    background: isActive
                                        ? "linear-gradient(145deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.06) 100%)"
                                        : "transparent",
                                    boxShadow: isActive
                                        ? "0 2px 12px rgba(212,168,67,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                                        : "none",
                                }}
                            >
                                {/* Desktop label */}
                                <span className="hidden sm:block leading-[1.3]">{data.label}</span>
                                {/* Mobile label */}
                                <span className="block sm:hidden leading-[1.3]">{data.shortLabel}</span>

                                {/* "Today" dot */}
                                {isToday && (
                                    <div
                                        className="w-[4px] h-[4px] rounded-full mt-[2px] transition-colors duration-300"
                                        style={{
                                            background: isActive ? "#D4A843" : "rgba(212,168,67,0.35)",
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Program List ── */}
                <div
                    ref={scrollRef}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    className="relative max-h-[520px] overflow-y-auto pr-[8px]"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(212,168,67,0.15) transparent",
                    }}
                >
                    {/* Fade top/bottom for scroll indication */}
                    <div
                        className="sticky top-0 h-[24px] z-[2] mb-[-24px] pointer-events-none"
                        style={{
                            background: "linear-gradient(180deg, #0A0E16 0%, transparent 100%)",
                        }}
                    />

                    {activeData.programs.map((prog, i) => (
                        <div key={`${activeTab}-${i}`} data-row>
                            <ProgramRow
                                time={prog.time}
                                name={prog.name}
                                isNow={i === nowIndex}
                                isFeatured={prog.featured}
                                index={i}
                            />
                        </div>
                    ))}

                    {/* End cap */}
                    <div className="flex items-center gap-0 pt-[14px] pb-[8px]">
                        <div className="w-[48px] flex justify-center">
                            <div className="w-[3px] h-[3px] rounded-full bg-white/10" />
                        </div>
                        <span className="text-[11px] font-mono text-white/10 tracking-[1px] italic">
                            Programación continúa...
                        </span>
                    </div>

                    <div
                        className="sticky bottom-0 h-[24px] z-[2] mt-[-24px] pointer-events-none"
                        style={{
                            background: "linear-gradient(0deg, #0A0E16 0%, transparent 100%)",
                        }}
                    />
                </div>

                {/* ── Footer note ── */}
                <p className="text-center text-[12px] font-sans text-white/15 mt-[28px] italic tracking-[0.3px]">
                    Transmisiones especiales durante horarios de culto
                </p>
            </div>
        </div>
    );
}
