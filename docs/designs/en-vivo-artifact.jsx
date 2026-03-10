import { useState, useEffect } from "react";

// --- Service Schedule Data ---
const services = [
    { day: "Lunes", time: "7:30 PM", type: "Culto de Oración", dayIndex: 1 },
    { day: "Martes", time: "7:30 PM", type: "Estudio Bíblico", dayIndex: 2 },
    { day: "Jueves", time: "7:30 PM", type: "Culto", dayIndex: 4 },
    { day: "Viernes", time: "7:00 PM", type: "Culto de Jóvenes", dayIndex: 5 },
    { day: "Sábado", time: "5:00 PM", type: "Culto", dayIndex: 6 },
    { day: "Domingo", time: "11:00 AM", type: "Culto Principal", dayIndex: 0, isMain: true },
    { day: "Domingo", time: "5:00 PM", type: "Culto", dayIndex: 0 },
];

// TODO: Replace with actual YouTube channel ID
const YOUTUBE_CHANNEL_ID = "UC_YOUR_CHANNEL_ID";

// --- Next Service Calculator ---
function getNextService() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
        const checkDay = (currentDay + daysAhead) % 7;
        const dayServices = services.filter((s) => s.dayIndex === checkDay);

        for (const service of dayServices) {
            const [timePart, ampm] = service.time.split(" ");
            const [h, m] = timePart.split(":").map(Number);
            let hours = h;
            if (ampm === "PM" && h !== 12) hours += 12;
            if (ampm === "AM" && h === 12) hours = 0;
            const serviceMinutes = hours * 60 + m;

            if (daysAhead === 0 && serviceMinutes <= currentMinutes) continue;
            return { ...service, daysAhead };
        }
    }
    return { ...services[0], daysAhead: 1 };
}

function getNextLabel(daysAhead, day) {
    if (daysAhead === 0) return "Hoy";
    if (daysAhead === 1) return "Mañana";
    return day;
}

// --- Main Page ---
export default function EnVivoPage() {
    const [nextService, setNextService] = useState(null);
    const [currentDayIndex, setCurrentDayIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false);

    useEffect(() => {
        setNextService(getNextService());
        setCurrentDayIndex(new Date().getDay());
    }, []);

    return (
        <div style={{
            minHeight: "100vh",
            background: "#F8F6F0",
            fontFamily: "'Libre Baskerville', 'Georgia', serif",
        }}>

            {/* ===== HERO + PLAYER ===== */}
            <section style={{
                background: "linear-gradient(160deg, #0F2035 0%, #1E3A5F 50%, #1A3352 100%)",
                padding: "clamp(60px, 10vw, 100px) 20px 0 20px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Subtle dot pattern */}
                <div style={{
                    position: "absolute", inset: 0, opacity: 0.03,
                    backgroundImage: "radial-gradient(circle at 30% 40%, #D4A843 1px, transparent 1px)",
                    backgroundSize: "40px 40px", pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                    {/* Next service badge */}
                    {nextService && (
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "10px",
                            background: "rgba(212,168,67,0.12)",
                            border: "1px solid rgba(212,168,67,0.2)",
                            borderRadius: "100px", padding: "8px 20px",
                            marginBottom: "28px", animation: "fadeInDown 0.6s ease",
                        }}>
                            <div style={{
                                width: "6px", height: "6px", borderRadius: "50%",
                                background: "#D4A843", animation: "pulse 2s infinite",
                            }} />
                            <span style={{
                                color: "#D4A843", fontSize: "13px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, letterSpacing: "0.5px",
                            }}>
                                Próximo culto: {getNextLabel(nextService.daysAhead, nextService.day)} a las {nextService.time}
                            </span>
                        </div>
                    )}

                    <h1 style={{
                        color: "#F8F6F0", fontSize: "clamp(30px, 6vw, 52px)",
                        fontWeight: 400, margin: "0 0 16px 0",
                        animation: "fadeInDown 0.6s ease 0.1s both",
                    }}>
                        Culto en Vivo
                    </h1>

                    <p style={{
                        color: "rgba(248,246,240,0.6)", fontSize: "clamp(15px, 2.5vw, 18px)",
                        fontFamily: "'DM Sans', sans-serif",
                        maxWidth: "480px", margin: "0 auto",
                        lineHeight: 1.7, animation: "fadeInDown 0.6s ease 0.2s both",
                    }}>
                        Participa de nuestros servicios desde donde estés
                    </p>
                </div>

                {/* ===== YOUTUBE PLAYER ===== */}
                <div style={{
                    maxWidth: "900px", margin: "48px auto 0 auto",
                    position: "relative", zIndex: 2,
                    animation: "fadeInUp 0.8s ease 0.3s both",
                }}>
                    <div style={{
                        borderRadius: "20px 20px 0 0",
                        overflow: "hidden",
                        boxShadow: "0 -4px 60px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderBottom: "none",
                        background: "#000",
                    }}>
                        {showPlayer ? (
                            <div style={{
                                position: "relative",
                                paddingBottom: "56.25%",
                                height: 0,
                            }}>
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${YOUTUBE_CHANNEL_ID}&autoplay=1`}
                                    title="Culto en vivo — MMM Chile"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                        position: "absolute",
                                        top: 0, left: 0,
                                        width: "100%", height: "100%",
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => setShowPlayer(true)}
                                style={{
                                    position: "relative",
                                    paddingBottom: "56.25%",
                                    height: 0,
                                    cursor: "pointer",
                                    background: "linear-gradient(180deg, #0F1520 0%, #0A0E16 100%)",
                                }}
                            >
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    gap: "20px",
                                }}>
                                    {/* Play button */}
                                    <div style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        background: "rgba(212,168,67,0.15)",
                                        border: "2px solid rgba(212,168,67,0.3)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "all 0.3s ease",
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#D4A843" style={{ marginLeft: "3px" }}>
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <p style={{
                                            color: "#F8F6F0", fontSize: "16px",
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontWeight: 500, margin: "0 0 6px 0",
                                        }}>
                                            Toca para conectarte
                                        </p>
                                        <p style={{
                                            color: "#5A6A7A", fontSize: "13px",
                                            fontFamily: "'DM Sans', sans-serif",
                                            margin: 0,
                                        }}>
                                            Si hay transmisión activa, se reproducirá automáticamente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ===== INFO BAR ===== */}
            <section style={{
                background: "#FFFFFF",
                padding: "24px 20px",
                borderBottom: "1px solid #E8E5E0",
            }}>
                <div style={{
                    maxWidth: "900px", margin: "0 auto",
                    display: "flex", flexWrap: "wrap",
                    alignItems: "center", justifyContent: "space-between",
                    gap: "16px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <div>
                            <p style={{
                                color: "#2D2D2D", fontSize: "14px",
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, margin: 0,
                            }}>
                                Transmitido por YouTube
                            </p>
                            <p style={{
                                color: "#9CA3AF", fontSize: "12px",
                                fontFamily: "'DM Sans', sans-serif",
                                margin: 0,
                            }}>
                                Iglesia Central — General Gana #924, Santiago
                            </p>
                        </div>
                    </div>

                    <a
                        href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}?sub_confirmation=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "10px 20px", borderRadius: "10px",
                            background: "#FF0000", color: "#FFFFFF",
                            textDecoration: "none", fontSize: "13px",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#CC0000";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#FF0000";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        Suscribirme al canal
                    </a>
                </div>
            </section>

            {/* ===== SCHEDULE ===== */}
            <section style={{
                background: "#FFFFFF",
                padding: "80px 20px",
                borderBottom: "1px solid #E8E5E0",
            }}>
                <div style={{ maxWidth: "640px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <span style={{
                            color: "#D4A843", fontSize: "12px",
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: "3px", textTransform: "uppercase",
                        }}>
                            Horarios
                        </span>
                        <h2 style={{
                            color: "#1A1A1A", fontSize: "clamp(24px, 4vw, 34px)",
                            fontWeight: 400, margin: "12px 0 8px 0",
                        }}>
                            Servicios de la Iglesia Central
                        </h2>
                        <p style={{
                            color: "#6B7280", fontSize: "15px",
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Todos los cultos se transmiten en vivo por YouTube
                        </p>
                    </div>

                    <div style={{
                        borderRadius: "16px", overflow: "hidden",
                        border: "1px solid #E8E5E0",
                    }}>
                        {services.map((service, i) => {
                            const isToday = currentDayIndex === service.dayIndex;
                            const isNext = nextService &&
                                service.day === nextService.day &&
                                service.time === nextService.time;

                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "110px 90px 1fr auto",
                                        alignItems: "center",
                                        padding: "18px 24px",
                                        background: isNext
                                            ? "rgba(212,168,67,0.06)"
                                            : i % 2 === 0 ? "#FAFAF8" : "#FFFFFF",
                                        borderBottom: i < services.length - 1 ? "1px solid #F0EDE8" : "none",
                                        borderLeft: isNext ? "3px solid #D4A843" : "3px solid transparent",
                                        transition: "background 0.3s ease",
                                        gap: "8px",
                                    }}
                                    onMouseEnter={(e) => { if (!isNext) e.currentTarget.style.background = "#F5F3EE"; }}
                                    onMouseLeave={(e) => { if (!isNext) e.currentTarget.style.background = isNext ? "rgba(212,168,67,0.06)" : i % 2 === 0 ? "#FAFAF8" : "#FFFFFF"; }}
                                >
                                    <span style={{
                                        color: isToday ? "#1E3A5F" : "#2D2D2D",
                                        fontSize: "15px",
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontWeight: isToday ? 600 : 400,
                                    }}>
                                        {service.day}
                                    </span>
                                    <span style={{
                                        color: "#D4A843", fontSize: "14px",
                                        fontFamily: "'DM Mono', monospace",
                                        fontWeight: 500,
                                    }}>
                                        {service.time}
                                    </span>
                                    <span style={{
                                        color: "#6B7280", fontSize: "14px",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        {service.type}
                                    </span>
                                    {isNext && (
                                        <span style={{
                                            fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
                                            color: "#D4A843", background: "rgba(212,168,67,0.1)",
                                            padding: "3px 10px", borderRadius: "100px",
                                            fontWeight: 500, whiteSpace: "nowrap",
                                        }}>
                                            Próximo
                                        </span>
                                    )}
                                    {service.isMain && !isNext && (
                                        <span style={{
                                            fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
                                            color: "#1E3A5F", background: "rgba(30,58,95,0.08)",
                                            padding: "3px 10px", borderRadius: "100px",
                                            fontWeight: 500, whiteSpace: "nowrap",
                                        }}>
                                            Principal
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== RADIO BANNER ===== */}
            <section style={{
                background: "linear-gradient(135deg, #0F2035 0%, #162D45 100%)",
                padding: "60px 20px", textAlign: "center",
            }}>
                <div style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "8px", marginBottom: "16px",
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m4.9 19.1 2.8-2.8" /><path d="M16.3 19.1 13.5 16.3" />
                            <circle cx="12" cy="12" r="3" /><path d="m7.1 7.1 2.8 2.8" />
                            <path d="m14.1 9.9 2.8-2.8" />
                            <path d="M12 2v4" /><path d="M2 12h4" /><path d="M18 12h4" />
                        </svg>
                        <span style={{
                            color: "#4ADE80", fontSize: "12px",
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: "2px", textTransform: "uppercase",
                            fontWeight: 500,
                        }}>
                            24/7 en vivo
                        </span>
                    </div>

                    <h3 style={{
                        color: "#F8F6F0", fontSize: "clamp(20px, 4vw, 26px)",
                        fontWeight: 400, margin: "0 0 8px 0",
                    }}>
                        ¿No hay culto ahora? Escucha la radio
                    </h3>
                    <p style={{
                        color: "rgba(248,246,240,0.5)", fontSize: "15px",
                        fontFamily: "'DM Sans', sans-serif",
                        margin: "0 0 28px 0",
                    }}>
                        Radio Bethel Chile — Música cristiana y predicaciones las 24 horas
                    </p>

                    <a
                        href="/radio"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "10px",
                            padding: "14px 32px", borderRadius: "12px",
                            background: "rgba(212,168,67,0.12)",
                            border: "1px solid rgba(212,168,67,0.25)",
                            color: "#D4A843", textDecoration: "none",
                            fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500, transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(212,168,67,0.2)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(212,168,67,0.12)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Escuchar Radio
                    </a>
                </div>
            </section>

            {/* ===== FUNNEL CTAs ===== */}
            <section style={{ padding: "80px 20px", textAlign: "center", background: "#F8F6F0" }}>
                <p style={{
                    color: "#9CA3AF", fontSize: "14px",
                    fontFamily: "'DM Sans', sans-serif",
                    margin: "0 0 8px 0",
                }}>
                    Lo digital es bueno, pero lo presencial es mejor
                </p>
                <h2 style={{
                    color: "#2D2D2D", fontSize: "clamp(22px, 4vw, 30px)",
                    fontWeight: 400, margin: "0 0 40px 0",
                }}>
                    Te esperamos en persona
                </h2>

                <div style={{
                    display: "flex", flexWrap: "wrap", gap: "16px",
                    justifyContent: "center", maxWidth: "750px", margin: "0 auto",
                }}>
                    {[
                        { text: "Encuentra una iglesia cerca de ti", href: "/iglesias", accent: "#1E3A5F" },
                        { text: "¿Quieres conocer a Jesús?", href: "/conoce-a-jesus", accent: "#D4A843" },
                    ].map((cta, i) => (
                        <a
                            key={i}
                            href={cta.href}
                            style={{
                                padding: "16px 32px", borderRadius: "14px",
                                border: `1.5px solid ${cta.accent}25`,
                                background: `${cta.accent}08`,
                                color: cta.accent, textDecoration: "none",
                                fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                                fontWeight: 500, transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${cta.accent}15`;
                                e.currentTarget.style.borderColor = `${cta.accent}40`;
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = `${cta.accent}08`;
                                e.currentTarget.style.borderColor = `${cta.accent}25`;
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {cta.text} →
                        </a>
                    ))}
                </div>
            </section>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}