import { useState, useEffect, useRef } from "react";

// ====== SCHEDULE DATA ======
const schedule = {
    weekdays: {
        label: "Lunes a Viernes",
        shortLabel: "L–V",
        programs: [
            { time: "03:00 AM", name: "Mensaje a la Conciencia" },
            { time: "08:00 AM", name: "Mensaje a la Conciencia" },
            { time: "09:00 AM", name: "Día a Día con Dios" },
            { time: "10:00 AM", name: "Biblia Maestra" },
            { time: "12:00 PM", name: "Momentos de Reflexión" },
            { time: "02:00 PM", name: "Predicaciones" },
            { time: "03:00 PM", name: "Al Ritmo del Corazón" },
            { time: "04:00 PM", name: "Belleza Espiritual" },
            { time: "05:00 PM", name: "The Bible Project" },
            { time: "10:00 PM", name: "Me Contó un Amigo" },
            { time: "11:00 PM", name: "Biblia Maestra" },
        ],
    },
    saturday: {
        label: "Sábados",
        shortLabel: "Sáb",
        programs: [
            { time: "10:00 AM", name: "Hogar Dulce Hogar" },
            { time: "11:00 AM", name: "Hablemos de Familia" },
            { time: "02:00 PM", name: "Tiempo para los Niños" },
            { time: "10:00 PM", name: "Entre 2 o 3" },
        ],
    },
    sunday: {
        label: "Domingos",
        shortLabel: "Dom",
        programs: [
            { time: "09:00 AM", name: "Dulce Armonía" },
            { time: "11:00 AM", name: "Transmisión de Culto", featured: true },
            { time: "03:00 PM", name: "Sostenidas por su Gracia" },
            { time: "04:00 PM", name: "Dulce Armonía Vespertino" },
        ],
    },
};

// ====== HELPERS ======
function parseTime(timeStr) {
    const [timePart, ampm] = timeStr.split(" ");
    const [h, m] = timePart.split(":").map(Number);
    let hours = h;
    if (ampm === "PM" && h !== 12) hours += 12;
    if (ampm === "AM" && h === 12) hours = 0;
    return hours * 60 + m;
}

function getCurrentProgram(programs) {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();

    for (let i = programs.length - 1; i >= 0; i--) {
        const progMin = parseTime(programs[i].time);
        if (currentMin >= progMin) return i;
    }
    return -1;
}

function getDayGroup() {
    const day = new Date().getDay();
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return "weekdays";
}

// ====== NOW PLAYING INDICATOR ======
function NowBadge() {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "10px", fontFamily: "var(--f-mono)",
            letterSpacing: "2px", textTransform: "uppercase",
            color: "#D4A843", fontWeight: 600,
        }}>
            <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#D4A843",
                boxShadow: "0 0 8px rgba(212,168,67,0.6)",
                animation: "nowPulse 2s ease-in-out infinite",
            }} />
            Ahora
        </span>
    );
}

// ====== SINGLE PROGRAM ROW ======
function ProgramRow({ time, name, isNow, isFeatured, index }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                alignItems: "center",
                gap: "0",
                padding: "0",
                position: "relative",
                animation: `rowReveal 0.4s ease ${index * 0.04}s both`,
            }}
        >
            {/* ── Timeline dot + line ── */}
            <div style={{
                width: "48px",
                display: "flex", flexDirection: "column", alignItems: "center",
                position: "relative", alignSelf: "stretch",
            }}>
                {/* Vertical line */}
                <div style={{
                    position: "absolute", top: 0, bottom: 0, width: "1px",
                    background: isNow
                        ? "linear-gradient(180deg, rgba(212,168,67,0.4), rgba(212,168,67,0.1))"
                        : "rgba(255,255,255,0.04)",
                }} />
                {/* Dot */}
                <div style={{
                    position: "relative", top: "22px",
                    width: isNow ? "10px" : "5px",
                    height: isNow ? "10px" : "5px",
                    borderRadius: "50%",
                    background: isNow ? "#D4A843" : hovered ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.08)",
                    boxShadow: isNow ? "0 0 12px rgba(212,168,67,0.4)" : "none",
                    transition: "all 0.3s ease",
                    zIndex: 1,
                }} />
            </div>

            {/* ── Content ── */}
            <div style={{
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                display: "flex", flexDirection: "column", gap: "4px",
                transition: "padding-left 0.3s ease",
                paddingLeft: hovered ? "4px" : "0",
            }}>
                {/* Time */}
                <span style={{
                    fontSize: "11.5px",
                    fontFamily: "var(--f-mono)",
                    fontWeight: 500,
                    color: isNow ? "#D4A843" : "rgba(212,168,67,0.45)",
                    letterSpacing: "0.5px",
                    transition: "color 0.3s ease",
                }}>
                    {time}
                </span>

                {/* Program name */}
                <span style={{
                    fontSize: isNow ? "16px" : "15px",
                    fontFamily: isNow || isFeatured ? "var(--f-display)" : "var(--f-body)",
                    fontWeight: isNow ? 400 : 400,
                    color: isNow ? "#F8F6F0" : hovered ? "#C8C0B0" : "#7A8594",
                    letterSpacing: isNow ? "0.3px" : "0",
                    transition: "all 0.3s ease",
                }}>
                    {name}
                </span>
            </div>

            {/* ── Now badge ── */}
            <div style={{ paddingRight: "4px", paddingTop: "14px", alignSelf: "start" }}>
                {isNow && <NowBadge />}
                {isFeatured && !isNow && (
                    <span style={{
                        fontSize: "9px", fontFamily: "var(--f-mono)",
                        letterSpacing: "1.5px", textTransform: "uppercase",
                        color: "rgba(30,58,95,0.8)", background: "rgba(30,58,95,0.12)",
                        padding: "3px 8px", borderRadius: "4px", fontWeight: 600,
                    }}>
                        Culto
                    </span>
                )}
            </div>
        </div>
    );
}

// ====== MAIN SCHEDULE COMPONENT ======
export default function RadioSchedule() {
    const [activeTab, setActiveTab] = useState("weekdays");
    const [currentDayGroup, setCurrentDayGroup] = useState("weekdays");
    const [nowIndex, setNowIndex] = useState(-1);
    const scrollRef = useRef(null);

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

    const tabs = Object.entries(schedule);
    const activeData = schedule[activeTab];

    return (
        <div style={{
            background: "linear-gradient(180deg, #080C14 0%, #0B1018 50%, #0A0E16 100%)",
            padding: "clamp(60px, 10vw, 100px) 20px",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Subtle radial glow */}
            <div style={{
                position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
                width: "600px", height: "400px", borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(212,168,67,0.03) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: "580px", margin: "0 auto", position: "relative" }}>

                {/* ── Header ── */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        fontSize: "11px", fontFamily: "var(--f-mono)",
                        letterSpacing: "3px", textTransform: "uppercase",
                        color: "#D4A843", fontWeight: 500,
                        marginBottom: "14px",
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Programación
                    </span>
                    <h2 style={{
                        fontSize: "clamp(26px, 5vw, 36px)",
                        fontFamily: "var(--f-display)",
                        fontWeight: 400, color: "#F8F6F0",
                        margin: "0", lineHeight: 1.2,
                    }}>
                        Lo que suena en Bethel
                    </h2>
                </div>

                {/* ── Tab Selector ── */}
                <div style={{
                    display: "flex",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "14px",
                    padding: "4px",
                    marginBottom: "36px",
                    border: "1px solid rgba(255,255,255,0.04)",
                    position: "relative",
                }}>
                    {tabs.map(([key, data]) => {
                        const isActive = activeTab === key;
                        const isToday = currentDayGroup === key;

                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                style={{
                                    flex: 1,
                                    padding: "12px 8px",
                                    borderRadius: "11px",
                                    border: "none",
                                    background: isActive
                                        ? "linear-gradient(145deg, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.06) 100%)"
                                        : "transparent",
                                    color: isActive ? "#F8F6F0" : "#4A5A6A",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontFamily: "var(--f-body)",
                                    fontWeight: isActive ? 500 : 400,
                                    position: "relative",
                                    transition: "all 0.3s ease",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", gap: "2px",
                                    boxShadow: isActive
                                        ? "0 2px 12px rgba(212,168,67,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                                        : "none",
                                }}
                            >
                                {/* Desktop label */}
                                <span className="tab-full" style={{ lineHeight: 1.3 }}>
                                    {data.label}
                                </span>
                                {/* Mobile label */}
                                <span className="tab-short" style={{
                                    display: "none", lineHeight: 1.3,
                                }}>
                                    {data.shortLabel}
                                </span>

                                {/* "Today" dot */}
                                {isToday && (
                                    <div style={{
                                        width: "4px", height: "4px", borderRadius: "50%",
                                        background: isActive ? "#D4A843" : "rgba(212,168,67,0.35)",
                                        marginTop: "2px",
                                        transition: "background 0.3s ease",
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Program List ── */}
                <div
                    ref={scrollRef}
                    style={{
                        position: "relative",
                        maxHeight: "520px",
                        overflowY: "auto",
                        paddingRight: "8px",
                        /* Custom scrollbar */
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(212,168,67,0.15) transparent",
                    }}
                >
                    {/* Fade top/bottom for scroll indication */}
                    <div style={{
                        position: "sticky", top: 0, height: "24px", zIndex: 2,
                        background: "linear-gradient(180deg, #0A0E16 0%, transparent 100%)",
                        marginBottom: "-24px", pointerEvents: "none",
                    }} />

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
                    <div style={{
                        display: "flex", alignItems: "center", gap: "0",
                        padding: "14px 0 8px 0",
                    }}>
                        <div style={{
                            width: "48px", display: "flex", justifyContent: "center",
                        }}>
                            <div style={{
                                width: "3px", height: "3px", borderRadius: "50%",
                                background: "rgba(255,255,255,0.06)",
                            }} />
                        </div>
                        <span style={{
                            fontSize: "11px", fontFamily: "var(--f-mono)",
                            color: "rgba(255,255,255,0.1)", letterSpacing: "1px",
                            fontStyle: "italic",
                        }}>
                            Programación continúa...
                        </span>
                    </div>

                    <div style={{
                        position: "sticky", bottom: 0, height: "24px", zIndex: 2,
                        background: "linear-gradient(0deg, #0A0E16 0%, transparent 100%)",
                        marginTop: "-24px", pointerEvents: "none",
                    }} />
                </div>

                {/* ── Footer note ── */}
                <p style={{
                    textAlign: "center",
                    fontSize: "12px", fontFamily: "var(--f-body)",
                    color: "rgba(255,255,255,0.15)",
                    marginTop: "28px", fontStyle: "italic",
                    letterSpacing: "0.3px",
                }}>
                    Transmisiones especiales durante horarios de culto
                </p>
            </div>

            {/* ====== STYLES ====== */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --f-display: 'Libre Baskerville', 'Georgia', serif;
          --f-body: 'DM Sans', system-ui, sans-serif;
          --f-mono: 'JetBrains Mono', 'Menlo', monospace;
        }

        @keyframes nowPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes rowReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar styling for WebKit */
        div::-webkit-scrollbar {
          width: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(212,168,67,0.12);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(212,168,67,0.25);
        }

        /* Responsive tab labels */
        @media (max-width: 480px) {
          .tab-full { display: none !important; }
          .tab-short { display: block !important; }
        }
      `}</style>
        </div>
    );
}