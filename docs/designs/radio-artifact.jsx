import { useState, useRef, useEffect, useCallback } from "react";

const STREAM_URL = NEXT_PUBLIC_RADIO_STREAM_URL; // .env

// --- Animated Sound Waves ---
function SoundWaves({ isPlaying }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "32px" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                    key={i}
                    style={{
                        width: "4px",
                        borderRadius: "2px",
                        background: "linear-gradient(180deg, #D4A843 0%, #B8922F 100%)",
                        height: isPlaying ? undefined : "6px",
                        animation: isPlaying ? `wave 1.2s ease-in-out infinite alternate` : "none",
                        animationDelay: `${i * 0.1}s`,
                        transition: "height 0.4s ease",
                    }}
                />
            ))}
            <style>{`
        @keyframes wave {
          0% { height: 6px; }
          50% { height: ${Math.random() * 20 + 12}px; }
          100% { height: 28px; }
        }
      `}</style>
        </div>
    );
}

// --- Volume Slider ---
function VolumeControl({ volume, onChange }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8899AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {volume === 0 ? (
                    <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#8899AA" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                    </>
                ) : (
                    <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#8899AA" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                    </>
                )}
            </svg>
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                aria-label="Volumen"
                style={{
                    width: "100px",
                    height: "4px",
                    appearance: "none",
                    background: `linear-gradient(to right, #D4A843 0%, #D4A843 ${volume * 100}%, #2A3F55 ${volume * 100}%, #2A3F55 100%)`,
                    borderRadius: "2px",
                    outline: "none",
                    cursor: "pointer",
                }}
            />
        </div>
    );
}

// --- Main Radio Page ---
export default function RadioPage() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [retryCount, setRetryCount] = useState(0);

    const handlePlay = useCallback(() => {
        if (!audioRef.current) return;
        setHasError(false);
        setIsLoading(true);

        audioRef.current.src = STREAM_URL + "?t=" + Date.now();
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {
            setIsLoading(false);
            setHasError(true);
        });
    }, [volume]);

    const handlePause = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.src = "";
        setIsPlaying(false);
        setIsLoading(false);
    };

    const handleToggle = () => {
        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    };

    const handleRetry = () => {
        setRetryCount((c) => c + 1);
        handlePlay();
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const scheduleData = [
        { time: "5:00 AM", program: "Devocional de Madrugada" },
        { time: "7:00 AM", program: "Meditación Bíblica" },
        { time: "9:00 AM", program: "Música de Adoración" },
        { time: "12:00 PM", program: "Palabra al Mediodía" },
        { time: "3:00 PM", program: "Música Cristiana" },
        { time: "6:00 PM", program: "Predicaciones" },
        { time: "9:00 PM", program: "Reflexión Nocturna" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "#0A0F18", fontFamily: "'Libre Baskerville', 'Georgia', serif" }}>
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                preload="none"
                onPlaying={() => { setIsPlaying(true); setIsLoading(false); setRetryCount(0); }}
                onPause={() => setIsPlaying(false)}
                onError={() => { setIsLoading(false); setHasError(true); setIsPlaying(false); }}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />

            {/* Background Texture */}
            <div style={{
                position: "fixed", inset: 0, opacity: 0.04, pointerEvents: "none",
                backgroundImage: `radial-gradient(circle at 20% 50%, #D4A843 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, #1E3A5F 0%, transparent 40%)`,
            }} />

            {/* ===== HERO / PLAYER SECTION ===== */}
            <section style={{
                minHeight: "80vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", position: "relative",
                padding: "60px 20px",
            }}>
                {/* Glow behind player */}
                <div style={{
                    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
                    background: isPlaying
                        ? "radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(30,58,95,0.1) 0%, transparent 70%)",
                    transition: "background 1s ease", pointerEvents: "none",
                }} />

                {/* Live Badge */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    marginBottom: "28px", animation: "fadeInDown 0.6s ease",
                }}>
                    <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: isPlaying ? "#4ADE80" : "#D4A843",
                        boxShadow: isPlaying ? "0 0 12px #4ADE80" : "none",
                        animation: isPlaying ? "pulse 2s infinite" : "none",
                    }} />
                    <span style={{
                        color: isPlaying ? "#4ADE80" : "#8899AA",
                        fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                        letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500,
                    }}>
                        {isPlaying ? "En Vivo" : isLoading ? "Conectando..." : "24/7"}
                    </span>
                </div>

                {/* Radio Logo */}
                <div style={{
                    width: "120px", height: "120px", borderRadius: "24px",
                    background: "linear-gradient(145deg, #111827 0%, #0D1520 100%)",
                    border: "1px solid rgba(212,168,67,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px auto", overflow: "hidden",
                    boxShadow: isPlaying
                        ? "0 0 40px rgba(212,168,67,0.1), 0 8px 32px rgba(0,0,0,0.3)"
                        : "0 8px 32px rgba(0,0,0,0.3)",
                    transition: "box-shadow 1s ease",
                    animation: "fadeInDown 0.6s ease 0.05s both",
                }}>
                    {/* Replace this with: <img src="/images/radio-bethel-logo.png" alt="Radio Bethel Chile" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} /> */}
                    <div style={{
                        color: "#D4A843", fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
                        textAlign: "center", padding: "12px", lineHeight: 1.4, opacity: 0.5,
                    }}>
                        Logo Radio Bethel
                    </div>
                </div>

                {/* Station Name */}
                <h1 style={{
                    color: "#F8F6F0", fontSize: "clamp(28px, 5vw, 48px)",
                    fontWeight: 400, margin: "0 0 8px 0", textAlign: "center",
                    letterSpacing: "1px", animation: "fadeInDown 0.6s ease 0.1s both",
                }}>
                    Radio Bethel Chile
                </h1>

                <p style={{
                    color: "#6B7B8D", fontSize: "clamp(14px, 2vw, 17px)",
                    fontFamily: "'DM Sans', sans-serif", margin: "0 0 50px 0",
                    textAlign: "center", animation: "fadeInDown 0.6s ease 0.2s both",
                }}>
                    Música cristiana y la Palabra de Dios — las 24 horas
                </p>

                {/* ===== PLAYER CARD ===== */}
                <div style={{
                    background: "linear-gradient(145deg, #111827 0%, #0D1520 100%)",
                    border: "1px solid rgba(212,168,67,0.12)",
                    borderRadius: "24px", padding: "48px 40px",
                    maxWidth: "420px", width: "100%", textAlign: "center",
                    boxShadow: isPlaying
                        ? "0 0 80px rgba(212,168,67,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                        : "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
                    transition: "box-shadow 1s ease",
                    animation: "fadeInUp 0.8s ease 0.3s both",
                }}>
                    {/* Waves */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px", minHeight: "32px" }}>
                        {isPlaying ? (
                            <SoundWaves isPlaying={isPlaying} />
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "32px" }}>
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div key={i} style={{ width: "4px", height: "6px", borderRadius: "2px", background: "#2A3F55" }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Play Button */}
                    {!hasError ? (
                        <button
                            onClick={handleToggle}
                            disabled={isLoading}
                            aria-label={isPlaying ? "Pausar radio" : "Reproducir radio"}
                            style={{
                                width: "88px", height: "88px", borderRadius: "50%",
                                border: "2px solid rgba(212,168,67,0.3)",
                                background: isPlaying
                                    ? "linear-gradient(145deg, #D4A843 0%, #B8922F 100%)"
                                    : "linear-gradient(145deg, #1A2A3E 0%, #0F1C2D 100%)",
                                color: isPlaying ? "#0A0F18" : "#D4A843",
                                cursor: isLoading ? "wait" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                margin: "0 auto 24px auto",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                transform: isPlaying ? "scale(1.05)" : "scale(1)",
                                boxShadow: isPlaying
                                    ? "0 0 40px rgba(212,168,67,0.3), 0 0 80px rgba(212,168,67,0.1)"
                                    : "0 4px 20px rgba(0,0,0,0.3)",
                            }}
                            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.transform = "scale(1.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = isPlaying ? "scale(1.05)" : "scale(1)"; }}
                        >
                            {isLoading ? (
                                <div style={{
                                    width: "24px", height: "24px", border: "3px solid rgba(212,168,67,0.3)",
                                    borderTop: "3px solid #D4A843", borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                }} />
                            ) : isPlaying ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="4" width="4" height="16" rx="1" />
                                    <rect x="14" y="4" width="4" height="16" rx="1" />
                                </svg>
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "3px" }}>
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                            )}
                        </button>
                    ) : (
                        /* Error State */
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ color: "#EF4444", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", margin: "0 0 16px 0" }}>
                                Señal no disponible en este momento
                            </p>
                            <button
                                onClick={handleRetry}
                                style={{
                                    padding: "10px 28px", borderRadius: "8px",
                                    border: "1px solid rgba(212,168,67,0.3)", background: "transparent",
                                    color: "#D4A843", cursor: "pointer", fontSize: "14px",
                                    fontFamily: "'DM Sans', sans-serif",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,67,0.1)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Status Text */}
                    <p style={{
                        color: isPlaying ? "#D4A843" : "#5A6A7A",
                        fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                        margin: "0 0 28px 0", transition: "color 0.5s ease",
                    }}>
                        {isPlaying ? "Escuchando Radio Bethel Chile..." : hasError ? "" : "Presiona play para escuchar"}
                    </p>

                    {/* Volume */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <VolumeControl volume={volume} onChange={setVolume} />
                    </div>
                </div>
            </section>

            {/* ===== SCHEDULE SECTION ===== */}
            <section style={{
                background: "linear-gradient(180deg, #0A0F18 0%, #0F1520 100%)",
                padding: "80px 20px",
            }}>
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "48px" }}>
                        <span style={{
                            color: "#D4A843", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: "3px", textTransform: "uppercase",
                        }}>
                            Programación
                        </span>
                        <h2 style={{
                            color: "#F8F6F0", fontSize: "clamp(22px, 4vw, 32px)",
                            fontWeight: 400, margin: "12px 0 0 0",
                        }}>
                            24 horas de bendición
                        </h2>
                    </div>

                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "16px", overflow: "hidden",
                    }}>
                        {scheduleData.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "18px 28px",
                                    borderBottom: i < scheduleData.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                    transition: "background 0.3s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,168,67,0.04)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                            >
                                <span style={{
                                    color: "#D4A843", fontSize: "14px",
                                    fontFamily: "'DM Mono', monospace", fontWeight: 500,
                                    minWidth: "80px",
                                }}>
                                    {item.time}
                                </span>
                                <span style={{
                                    color: "#8899AA", fontSize: "15px",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>
                                    {item.program}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p style={{
                        color: "#4A5A6A", fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                        textAlign: "center", marginTop: "16px", fontStyle: "italic",
                    }}>
                        Programación sujeta a cambios. Transmisiones especiales en horarios de culto.
                    </p>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section style={{
                background: "linear-gradient(180deg, #0F1520 0%, #111D2B 100%)",
                padding: "80px 20px", textAlign: "center",
            }}>
                <p style={{
                    color: "#D4A843", fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 12px 0",
                }}>
                    La radio tocó tu corazón?
                </p>
                <h2 style={{
                    color: "#F8F6F0", fontSize: "clamp(22px, 4vw, 30px)",
                    fontWeight: 400, margin: "0 0 40px 0",
                }}>
                    Da el siguiente paso
                </h2>

                <div style={{
                    display: "flex", flexWrap: "wrap", gap: "16px",
                    justifyContent: "center", maxWidth: "700px", margin: "0 auto",
                }}>
                    {[
                        { text: "Conoce a Jesús", href: "/conoce-a-jesus", icon: "❤️" },
                        { text: "Necesito Oración", href: "/oracion", icon: "🙏" },
                        { text: "Encontrar Iglesia", href: "/iglesias", icon: "📍" },
                    ].map((cta, i) => (
                        <a
                            key={i}
                            href={cta.href}
                            style={{
                                display: "flex", alignItems: "center", gap: "10px",
                                padding: "14px 28px", borderRadius: "12px",
                                border: "1px solid rgba(212,168,67,0.15)",
                                background: "rgba(212,168,67,0.05)",
                                color: "#C4B898", textDecoration: "none",
                                fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                                transition: "all 0.3s ease", cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(212,168,67,0.12)";
                                e.currentTarget.style.borderColor = "rgba(212,168,67,0.35)";
                                e.currentTarget.style.color = "#D4A843";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(212,168,67,0.05)";
                                e.currentTarget.style.borderColor = "rgba(212,168,67,0.15)";
                                e.currentTarget.style.color = "#C4B898";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            <span>{cta.icon}</span>
                            <span>{cta.text}</span>
                        </a>
                    ))}
                </div>

                {/* Link to En Vivo */}
                <a href="/en-vivo" style={{
                    display: "inline-block", marginTop: "40px",
                    color: "#5A6A7A", fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                    textDecoration: "none", transition: "color 0.3s ease",
                }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#8899AA"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#5A6A7A"; }}
                >
                    También puedes ver nuestros cultos en vivo →
                </a>
            </section>

            {/* Global Animations */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0% { height: 6px; }
          100% { height: 28px; }
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #D4A843;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(212,168,67,0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px; height: 14px;
          border-radius: 50%; border: none;
          background: #D4A843;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}