'use client';

import { useState } from 'react';
import { useRadio } from './RadioContext';

/* ── Organic Sound Waves ── */
function SoundWaves({ playing, size = 'normal', onDark = false }: { playing: boolean; size?: 'mini' | 'normal'; onDark?: boolean }) {
    const count = size === 'mini' ? 5 : 7;
    const h = size === 'mini' ? 18 : 24;
    const w = size === 'mini' ? 2.5 : 3;
    const gap = size === 'mini' ? 2 : 3;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: `${gap}px`, height: `${h}px` }}>
            {Array.from({ length: count }, (_, i) => {
                const heights = size === 'mini'
                    ? [10, 16, 12, 18, 8]
                    : [14, 22, 10, 20, 16, 24, 12];
                const maxH = heights[i % heights.length];

                const delay = `${i * 0.08}s`;
                const duration = `${0.8 + (i % 3) * 0.3}s`;
                return (
                    <div
                        key={i}
                        style={{
                            width: `${w}px`,
                            borderRadius: '100px',
                            background: playing
                                ? onDark
                                    ? 'rgba(255,255,255,0.9)'
                                    : `linear-gradient(0deg, rgba(212,168,67,0.4) 0%, #D4A843 100%)`
                                : onDark ? 'rgba(255,255,255,0.3)' : 'rgba(212,168,67,0.15)',
                            height: playing ? undefined : `${w + 1}px`,
                            // Merge delay into shorthand to avoid React style warning
                            animation: playing
                                ? `organicWave${i % 3} ${duration} ${delay} cubic-bezier(0.4, 0, 0.2, 1) infinite alternate`
                                : 'none',
                            transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease',
                            transformOrigin: 'bottom',
                            // maxH drives the CSS variable used in keyframes
                            ['--wave-max' as string]: `${maxH}px`,
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ── Float Player ── */
export default function FloatingRadioPlayer() {
    const radio = useRadio();
    const [isHoveringOrb, setIsHoveringOrb] = useState(false);

    if (!radio.isVisible) return null;

    /* Keyframes always in DOM so minimized orb animation works too */
    const keyframes = (
        <style>{`
            @keyframes barSlideUp {
                from { transform: translateY(100%); opacity: 0; }
                to   { transform: translateY(0);    opacity: 1; }
            }
            @keyframes orbBreathe {
                0%, 100% { opacity: 0.4; transform: scale(1); }
                50%      { opacity: 0.8; transform: scale(1.04); }
            }
            @keyframes tooltipIn {
                from { opacity: 0; transform: translateY(4px); }
                to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes organicWave0 {
                0%   { height: 4px;  } 100% { height: 16px; }
            }
            @keyframes organicWave1 {
                0%   { height: 6px;  } 100% { height: 13px; }
            }
            @keyframes organicWave2 {
                0%   { height: 3px;  } 100% { height: 18px; }
            }
            @keyframes radioSpin {
                to { transform: rotate(360deg); }
            }
            input[type="range"].radio-vol-range::-webkit-slider-thumb {
                appearance: none; width: 14px; height: 14px; border-radius: 50%;
                background: #D4A843; cursor: pointer;
                box-shadow: 0 0 8px rgba(212,168,67,0.3);
                margin-top: -5px;
            }
            input[type="range"].radio-vol-range::-moz-range-thumb {
                width: 14px; height: 14px; border-radius: 50%; border: none;
                background: #D4A843; cursor: pointer;
            }
            @media (max-width: 640px) {
                .radio-vol-desktop { display: none !important; }
            }
        `}</style>
    );

    /* ===== MINIMIZED: Floating Orb ===== */
    if (radio.isMinimized) {
        return (
            <>
                {keyframes}
                <button
                    onClick={() => radio.setIsMinimized(false)}
                    onMouseEnter={() => setIsHoveringOrb(true)}
                    onMouseLeave={() => setIsHoveringOrb(false)}
                    aria-label="Expandir radio"
                    style={{
                        position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
                        width: isHoveringOrb ? '60px' : '56px',
                        height: isHoveringOrb ? '60px' : '56px',
                        borderRadius: '50%',
                        background: radio.isPlaying
                            ? 'linear-gradient(145deg, #D4A843 0%, #C49A35 50%, #A8842A 100%)'
                            : 'linear-gradient(145deg, #162D45 0%, #0F2035 100%)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: radio.isPlaying
                            ? `0 0 0 ${isHoveringOrb ? '6px' : '3px'} rgba(212,168,67,0.15),
               0 0 ${isHoveringOrb ? '40px' : '24px'} rgba(212,168,67,0.25),
               0 8px 32px rgba(0,0,0,0.3)`
                            : `0 4px 24px rgba(0,0,0,0.4),
               inset 0 1px 0 rgba(255,255,255,0.05)`,
                        overflow: 'hidden',
                    }}
                >
                    {/* Inner glow ring when playing */}
                    {radio.isPlaying && (
                        <div style={{
                            position: 'absolute', inset: '3px', borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.15)',
                            animation: 'orbBreathe 3s ease-in-out infinite',
                        }} />
                    )}

                    {radio.isPlaying ? (
                        // onDark=true → white bars visible on gold background
                        <SoundWaves playing={true} size="mini" onDark />
                    ) : radio.isLoading ? (
                        <div style={{
                            width: '20px', height: '20px',
                            border: '2px solid rgba(212,168,67,0.2)',
                            borderTop: '2px solid #D4A843',
                            borderRadius: '50%', animation: 'radioSpin 0.8s linear infinite',
                        }} />
                    ) : (
                        // Radio antenna icon — clearly identifiable as radio even when paused
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke={radio.hasError ? '#EF4444' : '#D4A843'}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transition: 'stroke 0.3s ease' }}>
                            <circle cx="12" cy="12" r="2" />
                            <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                            <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
                        </svg>
                    )}
                </button>

                {/* Tooltip on hover */}
                {isHoveringOrb && (
                    <div style={{
                        position: 'fixed', bottom: '96px', right: '28px', zIndex: 9999,
                        background: 'rgba(15,32,53,0.95)',
                        backdropFilter: 'blur(8px)',
                        color: '#F8F6F0', fontSize: '12px',
                        fontFamily: 'var(--font-sans)',
                        padding: '6px 14px', borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        animation: 'tooltipIn 0.2s ease',
                        pointerEvents: 'none',
                    }}>
                        {radio.isPlaying ? 'Radio Bethel — En vivo' : 'Radio Bethel'}
                    </div>
                )}
            </>
        );
    }

    /* ===== EXPANDED: Frosted Glass Bottom Bar ===== */
    return (
        <>
            {keyframes}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
                animation: 'barSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {/* Frosted glass layer */}
                <div style={{
                    background: 'rgba(10, 15, 24, 0.82)',
                    backdropFilter: 'blur(24px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                    borderTop: '1px solid rgba(212,168,67,0.08)',
                    position: 'relative',
                }}>
                    {/* Subtle top highlight */}
                    <div style={{
                        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.15) 50%, transparent 100%)',
                    }} />

                    <div style={{
                        maxWidth: '1100px', margin: '0 auto',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '68px', padding: '0 24px',
                        gap: '16px',
                    }}>
                        {/* ── Left: Branding + Status ── */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            minWidth: 0, flex: '1 1 auto',
                        }}>
                            {/* Waves indicator */}
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: radio.isPlaying
                                    ? 'rgba(212,168,67,0.1)'
                                    : 'rgba(255,255,255,0.03)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.5s ease',
                                flexShrink: 0,
                            }}>
                                <SoundWaves playing={radio.isPlaying} size="mini" />
                            </div>

                            <div style={{ minWidth: 0 }}>
                                <p style={{
                                    color: '#F8F6F0', fontSize: '13.5px',
                                    fontFamily: 'var(--font-sans)',
                                    fontWeight: 500, margin: 0, letterSpacing: '0.2px',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>
                                    Radio Bethel Chile
                                </p>
                                <p style={{
                                    fontSize: '11.5px',
                                    fontFamily: 'var(--font-sans)',
                                    margin: '2px 0 0 0',
                                    transition: 'color 0.4s ease',
                                    color: radio.isPlaying ? '#D4A843'
                                        : radio.isLoading ? '#8899AA'
                                            : radio.hasError ? '#EF4444'
                                                : '#4A5A6A',
                                }}>
                                    {radio.isPlaying ? 'En vivo · Streaming'
                                        : radio.isLoading ? 'Conectando señal...'
                                            : radio.hasError ? 'Sin señal'
                                                : 'En pausa'}
                                </p>
                            </div>
                        </div>

                        {/* ── Center: Transport Controls ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '0 0 auto' }}>
                            {radio.hasError ? (
                                <button
                                    onClick={radio.play}
                                    aria-label="Reintentar conexión"
                                    style={{
                                        background: 'rgba(212,168,67,0.08)',
                                        border: '1px solid rgba(212,168,67,0.2)',
                                        color: '#D4A843', padding: '7px 20px', borderRadius: '8px',
                                        cursor: 'pointer', fontSize: '12px',
                                        fontFamily: 'var(--font-sans)', fontWeight: 500,
                                        letterSpacing: '0.5px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,168,67,0.15)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,168,67,0.08)'; }}
                                >
                                    Reintentar
                                </button>
                            ) : (
                                <button
                                    onClick={radio.toggle}
                                    disabled={radio.isLoading}
                                    aria-label={radio.isPlaying ? 'Pausar radio' : 'Reproducir radio'}
                                    style={{
                                        width: '42px', height: '42px', borderRadius: '50%',
                                        border: 'none',
                                        background: radio.isPlaying
                                            ? 'linear-gradient(145deg, #D4A843 0%, #B8922F 100%)'
                                            : 'rgba(255,255,255,0.06)',
                                        color: radio.isPlaying ? '#0A0F18' : '#D4A843',
                                        cursor: radio.isLoading ? 'wait' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        boxShadow: radio.isPlaying
                                            ? '0 0 20px rgba(212,168,67,0.25)'
                                            : 'inset 0 1px 0 rgba(255,255,255,0.06)',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                >
                                    {radio.isLoading ? (
                                        <div style={{
                                            width: '18px', height: '18px',
                                            border: '2px solid rgba(212,168,67,0.2)',
                                            borderTop: '2px solid #D4A843',
                                            borderRadius: '50%', animation: 'radioSpin 0.8s linear infinite',
                                        }} />
                                    ) : radio.isPlaying ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16" rx="1.5" />
                                            <rect x="14" y="4" width="4" height="16" rx="1.5" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"
                                            style={{ marginLeft: '2px' }}>
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    )}
                                </button>
                            )}

                            {/* Volume — hidden on mobile via CSS class */}
                            <div className="radio-vol-desktop" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="#4A5A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#4A5A6A" />
                                    {radio.volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
                                    {radio.volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                                </svg>
                                <div style={{ position: 'relative', width: '80px', height: '20px', display: 'flex', alignItems: 'center' }}>
                                    {/* Track background */}
                                    <div style={{
                                        position: 'absolute', left: 0, right: 0, height: '3px',
                                        background: 'rgba(255,255,255,0.06)', borderRadius: '2px',
                                    }} />
                                    {/* Track fill */}
                                    <div style={{
                                        position: 'absolute', left: 0, height: '3px',
                                        width: `${radio.volume * 100}%`,
                                        background: 'linear-gradient(90deg, rgba(212,168,67,0.5), #D4A843)',
                                        borderRadius: '2px', transition: 'width 0.1s ease',
                                    }} />
                                    <input
                                        type="range" min="0" max="1" step="0.05"
                                        value={radio.volume}
                                        onChange={(e) => radio.setVolume(parseFloat(e.target.value))}
                                        aria-label="Volumen"
                                        style={{
                                            position: 'relative', width: '100%', height: '20px',
                                            appearance: 'none', background: 'transparent',
                                            outline: 'none', cursor: 'pointer', zIndex: 1,
                                            margin: 0,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Window Controls ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: '0 0 auto' }}>
                            {/* Minimize to orb */}
                            <button
                                onClick={() => radio.setIsMinimized(true)}
                                aria-label="Minimizar radio"
                                style={{
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    background: 'transparent', border: 'none',
                                    color: '#3A4A5A', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.25s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#8899AA'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#3A4A5A'; e.currentTarget.style.background = 'transparent'; }}
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
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    background: 'transparent', border: 'none',
                                    color: '#3A4A5A', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.25s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#3A4A5A'; e.currentTarget.style.background = 'transparent'; }}
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

            {/* Styles moved to top-level keyframes block */}
        </>
    );
}
