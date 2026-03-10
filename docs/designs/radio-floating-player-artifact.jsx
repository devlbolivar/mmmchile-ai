import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";

/*
 * FLOATING RADIO MINI-PLAYER — Design Reference
 * 
 * Aesthetic: Luxury audio equipment meets frosted glass UI.
 * The expanded bar uses backdrop-blur to float transparently over
 * any page content. The minimized orb is a breathing golden sphere.
 *
 * Architecture for Next.js:
 * - RadioContext.tsx → Provider wrapping app/layout.tsx
 * - FloatingRadioPlayer.tsx → This component, rendered in layout
 * - /radio page uses useRadio() from the same context
 * - Single <audio> element shared across the entire site
 */

// ====== CONTEXT ======
const RadioContext = createContext(null);

function RadioProvider({ children }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const streamUrl = "https://radio.mmmchile.cl/stream";

    const play = useCallback(() => {
        if (!audioRef.current) return;
        setHasError(false);
        setIsLoading(true);
        setIsVisible(true);
        audioRef.current.src = streamUrl + "?t=" + Date.now();
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {
            setIsLoading(false);
            setHasError(true);
        });
    }, [volume, streamUrl]);

    const pause = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.src = "";
        setIsPlaying(false);
        setIsLoading(false);
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) pause(); else play();
    }, [isPlaying, play, pause]);

    const close = useCallback(() => {
        pause();
        setIsVisible(false);
        setIsMinimized(false);
    }, [pause]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    return (
        <RadioContext.Provider value={{
            audioRef, isPlaying, isLoading, hasError, volume,
            isVisible, isMinimized,
            play, pause, toggle, close,
            setVolume, setIsMinimized, setIsVisible,
        }}>
            <audio
                ref={audioRef}
                preload="none"
                onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
                onPause={() => setIsPlaying(false)}
                onError={() => { setIsLoading(false); setHasError(true); setIsPlaying(false); }}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
            />
            {children}
        </RadioContext.Provider>
    );
}

function useRadio() {
    return useContext(RadioContext);
}

// ====== ORGANIC SOUND WAVES ======
// Curved, flowing bars with staggered timing — not generic rectangles
function SoundWaves({ playing, size = "normal" }) {
    const count = size === "mini" ? 5 : 7;
    const h = size === "mini" ? 18 : 24;
    const w = size === "mini" ? 2.5 : 3;
    const gap = size === "mini" ? 2 : 3;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: `${gap}px`, height: `${h}px`,
        }}>
            {Array.from({ length: count }, (_, i) => {
                // Each bar has a unique max height for organic feel
                const heights = size === "mini"
                    ? [10, 16, 12, 18, 8]
                    : [14, 22, 10, 20, 16, 24, 12];
                const maxH = heights[i % heights.length];

                return (
                    <div
                        key={i}
                        style={{
                            width: `${w}px`,
                            borderRadius: "100px",
                            background: playing
                                ? `linear-gradient(0deg, rgba(212,168,67,0.4) 0%, #D4A843 100%)`
                                : "rgba(212,168,67,0.15)",
                            height: playing ? undefined : `${w + 1}px`,
                            animation: playing
                                ? `organicWave${i % 3} ${0.8 + (i % 3) * 0.3}s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate`
                                : "none",
                            animationDelay: `${i * 0.08}s`,
                            transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease",
                            transformOrigin: "bottom",
                        }}
                    />
                );
            })}
        </div>
    );
}

// ====== FLOATING MINI-PLAYER ======
function FloatingRadioPlayer() {
    const radio = useRadio();
    const [isHoveringOrb, setIsHoveringOrb] = useState(false);

    if (!radio.isVisible) return null;

    // ===== MINIMIZED: Floating Orb =====
    if (radio.isMinimized) {
        return (
            <>
                <button
                    onClick={() => radio.setIsMinimized(false)}
                    onMouseEnter={() => setIsHoveringOrb(true)}
                    onMouseLeave={() => setIsHoveringOrb(false)}
                    aria-label="Expandir radio"
                    style={{
                        position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
                        width: isHoveringOrb ? "60px" : "56px",
                        height: isHoveringOrb ? "60px" : "56px",
                        borderRadius: "50%",
                        background: radio.isPlaying
                            ? "linear-gradient(145deg, #D4A843 0%, #C49A35 50%, #A8842A 100%)"
                            : "linear-gradient(145deg, #162D45 0%, #0F2035 100%)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: radio.isPlaying
                            ? `0 0 0 ${isHoveringOrb ? "6px" : "3px"} rgba(212,168,67,0.15),
                 0 0 ${isHoveringOrb ? "40px" : "24px"} rgba(212,168,67,0.25),
                 0 8px 32px rgba(0,0,0,0.3)`
                            : `0 4px 24px rgba(0,0,0,0.4),
                 inset 0 1px 0 rgba(255,255,255,0.05)`,
                        overflow: "hidden",
                    }}
                >
                    {/* Inner glow ring when playing */}
                    {radio.isPlaying && (
                        <div style={{
                            position: "absolute", inset: "3px", borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.15)",
                            animation: "orbBreathe 3s ease-in-out infinite",
                        }} />
                    )}

                    {radio.isPlaying ? (
                        <SoundWaves playing={true} size="mini" />
                    ) : radio.isLoading ? (
                        <div style={{
                            width: "20px", height: "20px",
                            border: "2px solid rgba(212,168,67,0.2)",
                            borderTop: "2px solid #D4A843",
                            borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }} />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill={radio.hasError ? "#EF4444" : "#D4A843"}
                            style={{ marginLeft: "2px", transition: "fill 0.3s ease" }}>
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    )}
                </button>

                {/* Tooltip on hover */}
                {isHoveringOrb && (
                    <div style={{
                        position: "fixed", bottom: "96px", right: "28px", zIndex: 9999,
                        background: "rgba(15,32,53,0.95)",
                        backdropFilter: "blur(8px)",
                        color: "#F8F6F0", fontSize: "12px",
                        fontFamily: "var(--font-body)",
                        padding: "6px 14px", borderRadius: "8px",
                        whiteSpace: "nowrap",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        animation: "tooltipIn 0.2s ease",
                        pointerEvents: "none",
                    }}>
                        {radio.isPlaying ? "Radio Bethel — En vivo" : "Radio Bethel"}
                    </div>
                )}
            </>
        );
    }

    // ===== EXPANDED: Frosted Glass Bottom Bar =====
    return (
        <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9998,
            animation: "barSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
            {/* Frosted glass layer */}
            <div style={{
                background: "rgba(10, 15, 24, 0.82)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                borderTop: "1px solid rgba(212,168,67,0.08)",
            }}>
                {/* Subtle top highlight */}
                <div style={{
                    position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.15) 50%, transparent 100%)",
                }} />

                <div style={{
                    maxWidth: "1100px", margin: "0 auto",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    height: "68px", padding: "0 24px",
                    gap: "16px",
                }}>
                    {/* ── Left: Branding + Status ── */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        minWidth: 0, flex: "1 1 auto",
                    }}>
                        {/* Waves indicator */}
                        <div style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            background: radio.isPlaying
                                ? "rgba(212,168,67,0.1)"
                                : "rgba(255,255,255,0.03)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.5s ease",
                            flexShrink: 0,
                        }}>
                            <SoundWaves playing={radio.isPlaying} size="mini" />
                        </div>

                        <div style={{ minWidth: 0 }}>
                            <p style={{
                                color: "#F8F6F0", fontSize: "13.5px",
                                fontFamily: "var(--font-body)",
                                fontWeight: 500, margin: 0, letterSpacing: "0.2px",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                                Radio Bethel Chile
                            </p>
                            <p style={{
                                fontSize: "11.5px",
                                fontFamily: "var(--font-body)",
                                margin: "2px 0 0 0",
                                transition: "color 0.4s ease",
                                color: radio.isPlaying ? "#D4A843"
                                    : radio.isLoading ? "#8899AA"
                                        : radio.hasError ? "#EF4444"
                                            : "#4A5A6A",
                            }}>
                                {radio.isPlaying ? "En vivo · Streaming"
                                    : radio.isLoading ? "Conectando señal..."
                                        : radio.hasError ? "Sin señal"
                                            : "En pausa"}
                            </p>
                        </div>
                    </div>

                    {/* ── Center: Transport Controls ── */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "16px",
                        flex: "0 0 auto",
                    }}>
                        {radio.hasError ? (
                            <button
                                onClick={radio.play}
                                aria-label="Reintentar conexión"
                                style={{
                                    background: "rgba(212,168,67,0.08)",
                                    border: "1px solid rgba(212,168,67,0.2)",
                                    color: "#D4A843", padding: "7px 20px", borderRadius: "8px",
                                    cursor: "pointer", fontSize: "12px",
                                    fontFamily: "var(--font-body)", fontWeight: 500,
                                    letterSpacing: "0.5px",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(212,168,67,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(212,168,67,0.08)";
                                }}
                            >
                                Reintentar
                            </button>
                        ) : (
                            <button
                                onClick={radio.toggle}
                                disabled={radio.isLoading}
                                aria-label={radio.isPlaying ? "Pausar radio" : "Reproducir radio"}
                                style={{
                                    width: "42px", height: "42px", borderRadius: "50%",
                                    border: "none",
                                    background: radio.isPlaying
                                        ? "linear-gradient(145deg, #D4A843 0%, #B8922F 100%)"
                                        : "rgba(255,255,255,0.06)",
                                    color: radio.isPlaying ? "#0A0F18" : "#D4A843",
                                    cursor: radio.isLoading ? "wait" : "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                    transform: radio.isPlaying ? "scale(1)" : "scale(1)",
                                    boxShadow: radio.isPlaying
                                        ? "0 0 20px rgba(212,168,67,0.25)"
                                        : "inset 0 1px 0 rgba(255,255,255,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                {radio.isLoading ? (
                                    <div style={{
                                        width: "18px", height: "18px",
                                        border: "2px solid rgba(212,168,67,0.2)",
                                        borderTop: "2px solid #D4A843",
                                        borderRadius: "50%", animation: "spin 0.8s linear infinite",
                                    }} />
                                ) : radio.isPlaying ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" rx="1.5" />
                                        <rect x="14" y="4" width="4" height="16" rx="1.5" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                                        style={{ marginLeft: "2px" }}>
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                )}
                            </button>
                        )}

                        {/* Volume — desktop only */}
                        <div className="radio-vol-desktop" style={{
                            display: "flex", alignItems: "center", gap: "8px",
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="#4A5A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#4A5A6A" />
                                {radio.volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                                {radio.volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                            </svg>
                            <div style={{ position: "relative", width: "80px", height: "20px", display: "flex", alignItems: "center" }}>
                                {/* Track background */}
                                <div style={{
                                    position: "absolute", left: 0, right: 0, height: "3px",
                                    background: "rgba(255,255,255,0.06)", borderRadius: "2px",
                                }} />
                                {/* Track fill */}
                                <div style={{
                                    position: "absolute", left: 0, height: "3px",
                                    width: `${radio.volume * 100}%`,
                                    background: "linear-gradient(90deg, rgba(212,168,67,0.5), #D4A843)",
                                    borderRadius: "2px", transition: "width 0.1s ease",
                                }} />
                                <input
                                    type="range" min="0" max="1" step="0.05"
                                    value={radio.volume}
                                    onChange={(e) => radio.setVolume(parseFloat(e.target.value))}
                                    aria-label="Volumen"
                                    style={{
                                        position: "relative", width: "100%", height: "20px",
                                        appearance: "none", background: "transparent",
                                        outline: "none", cursor: "pointer", zIndex: 1,
                                        margin: 0,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Window Controls ── */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "2px",
                        flex: "0 0 auto",
                    }}>
                        {/* Minimize to orb */}
                        <button
                            onClick={() => radio.setIsMinimized(true)}
                            aria-label="Minimizar radio"
                            style={{
                                width: "34px", height: "34px", borderRadius: "10px",
                                background: "transparent", border: "none",
                                color: "#3A4A5A", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#8899AA";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#3A4A5A";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>

                        {/* Close */}
                        <button
                            onClick={radio.close}
                            aria-label="Cerrar radio"
                            style={{
                                width: "34px", height: "34px", borderRadius: "10px",
                                background: "transparent", border: "none",
                                color: "#3A4A5A", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#EF4444";
                                e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#3A4A5A";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ====== DEMO: Simulates navigating the site with the persistent player ======
function RadioPageInline() {
    const radio = useRadio();
    return (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
                width: "80px", height: "80px", borderRadius: "20px",
                background: "linear-gradient(145deg, #0F2035, #1A3352)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px auto",
                border: "1px solid rgba(212,168,67,0.12)",
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m4.9 19.1 2.8-2.8" /><path d="M16.3 19.1 13.5 16.3" />
                    <circle cx="12" cy="12" r="3" /><path d="m7.1 7.1 2.8 2.8" />
                    <path d="m14.1 9.9 2.8-2.8" />
                </svg>
            </div>
            <h2 style={{ color: "#1E3A5F", fontSize: "24px", fontWeight: 400, margin: "0 0 6px 0" }}>
                Radio Bethel Chile
            </h2>
            <p style={{ color: "#8899AA", fontSize: "14px", margin: "0 0 32px 0" }}>
                24 horas de música cristiana y predicaciones
            </p>
            <button
                onClick={() => { radio.toggle(); if (!radio.isVisible) radio.setIsVisible(true); }}
                disabled={radio.isLoading}
                style={{
                    width: "72px", height: "72px", borderRadius: "50%", border: "none",
                    background: radio.isPlaying
                        ? "linear-gradient(145deg, #D4A843 0%, #B8922F 100%)"
                        : "linear-gradient(145deg, #1E3A5F 0%, #0F2035 100%)",
                    color: radio.isPlaying ? "#0A0F18" : "#D4A843",
                    cursor: radio.isLoading ? "wait" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto", transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: radio.isPlaying
                        ? "0 0 32px rgba(212,168,67,0.3)" : "0 4px 16px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
                {radio.isLoading ? (
                    <div style={{
                        width: "22px", height: "22px", border: "2.5px solid rgba(212,168,67,0.2)",
                        borderTop: "2.5px solid #D4A843", borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                    }} />
                ) : radio.isPlaying ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1.5" />
                        <rect x="14" y="4" width="4" height="16" rx="1.5" />
                    </svg>
                ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "3px" }}>
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                )}
            </button>
            <p style={{
                color: radio.isPlaying ? "#D4A843" : "#9CA3AF",
                fontSize: "13px", marginTop: "16px", transition: "color 0.3s ease",
            }}>
                {radio.isPlaying ? "Escuchando · Navega a otra página, la radio sigue ↗"
                    : radio.hasError ? "Sin señal — intenta de nuevo"
                        : "Presiona play para escuchar"}
            </p>
        </div>
    );
}

export default function RadioFloatingPlayerDemo() {
    const [page, setPage] = useState("radio");

    const pages = {
        inicio: { title: "Bienvenido a MMM Chile", body: "Navega a \"Radio\" y dale play. Luego cambia de página — el mini-player se mantiene." },
        iglesias: { title: "Encuentra una Iglesia", body: "La radio sigue sonando mientras exploras las iglesias. El mini-player está abajo. ↓" },
        blog: { title: "Reflexiones para Tu Vida", body: "Lee un artículo mientras escuchas la radio. El audio no se interrumpe. ↓" },
    };

    return (
        <RadioProvider>
            <div style={{
                minHeight: "100vh", background: "#F8F6F0",
                fontFamily: "'DM Sans', sans-serif",
                paddingBottom: "84px",
            }}>
                {/* Nav */}
                <nav style={{
                    background: "#0F2035", padding: "0 24px", height: "56px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: "1px solid rgba(212,168,67,0.08)",
                }}>
                    <span style={{
                        color: "#F8F6F0", fontSize: "15px", fontWeight: 600,
                        fontFamily: "'Libre Baskerville', serif", letterSpacing: "0.5px",
                    }}>
                        MMM Chile
                    </span>
                    <div style={{ display: "flex", gap: "6px" }}>
                        {["inicio", "iglesias", "blog", "radio"].map((p) => (
                            <button
                                key={p} onClick={() => setPage(p)}
                                style={{
                                    background: page === p ? "rgba(212,168,67,0.1)" : "transparent",
                                    border: "none", borderRadius: "8px",
                                    color: page === p ? "#D4A843" : "#6B7B8D",
                                    cursor: "pointer", fontSize: "12.5px", padding: "7px 14px",
                                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                                    letterSpacing: "0.3px", transition: "all 0.2s ease",
                                    textTransform: "capitalize",
                                }}
                            >
                                {p === "radio" ? "📻 Radio" : p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Pages */}
                <main style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 24px" }}>
                    {page === "radio" ? (
                        <RadioPageInline />
                    ) : (
                        <div>
                            <h1 style={{
                                color: "#1E3A5F", fontSize: "26px", fontWeight: 400,
                                fontFamily: "'Libre Baskerville', serif", margin: "0 0 12px 0",
                            }}>
                                {pages[page]?.title}
                            </h1>
                            <p style={{ color: "#6B7B8D", lineHeight: 1.8 }}>
                                {pages[page]?.body}
                            </p>
                        </div>
                    )}
                </main>

                <FloatingRadioPlayer />
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        :root { --font-body: 'DM Sans', sans-serif; --font-display: 'Libre Baskerville', serif; }

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes barSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes orbBreathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.04); }
        }

        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes organicWave0 {
          0% { height: 4px; } 100% { height: 22px; }
        }
        @keyframes organicWave1 {
          0% { height: 6px; } 100% { height: 16px; }
        }
        @keyframes organicWave2 {
          0% { height: 3px; } 100% { height: 20px; }
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none; width: 14px; height: 14px; border-radius: 50%;
          background: #D4A843; cursor: pointer;
          box-shadow: 0 0 8px rgba(212,168,67,0.3);
          margin-top: -5px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%; border: none;
          background: #D4A843; cursor: pointer;
        }

        @media (max-width: 640px) {
          .radio-vol-desktop { display: none !important; }
        }
      `}</style>
        </RadioProvider>
    );
}