'use client';

import { useRadio } from './RadioContext';

// Safe GA4 event helper
declare global { interface Window { gtag?: (...args: unknown[]) => void } }
function trackEvent(name: string, params?: Record<string, string>) {
    window.gtag?.('event', name, { event_category: 'radio', ...params });
}

/* ── Sound waves (local variant for the standalone page card) ── */
function SoundWaves({ isPlaying }: { isPlaying: boolean }) {
    const heights = [18, 28, 14, 28, 20, 28, 16];
    return (
        <div className="flex items-end gap-[3px]" style={{ height: '32px' }} aria-hidden="true">
            {heights.map((maxH, i) => (
                <div
                    key={i}
                    className="w-1 rounded-sm"
                    style={{
                        background: 'linear-gradient(180deg, #D4A843 0%, #B8922F 100%)',
                        height: isPlaying ? undefined : '6px',
                        animation: isPlaying ? `radioWave 1.2s ease-in-out infinite alternate` : 'none',
                        animationDelay: `${i * 0.13}s`,
                        transition: 'height 0.4s ease',
                        '--wave-max': `${maxH}px`,
                    } as React.CSSProperties}
                />
            ))}
            <style>{`
                @keyframes radioWave {
                    0%   { height: 6px; }
                    100% { height: var(--wave-max, 28px); }
                }
            `}</style>
        </div>
    );
}

/* ── Volume slider ── */
function VolumeControl({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
    const pct = Math.round(volume * 100);
    return (
        <div className="flex items-center gap-3">
            <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#8899AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
            >
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
                type="range" min="0" max="1" step="0.05" value={volume}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                aria-label="Control de volumen"
                className="radio-volume-slider"
                style={{
                    width: '100px', height: '4px', appearance: 'none',
                    background: `linear-gradient(to right, #D4A843 0%, #D4A843 ${pct}%, #2A3F55 ${pct}%, #2A3F55 100%)`,
                    borderRadius: '2px', outline: 'none', cursor: 'pointer',
                }}
            />
            <style>{`
                .radio-volume-slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    background: #D4A843;
                    cursor: pointer;
                    box-shadow: 0 0 8px rgba(212,168,67,0.5);
                }
                .radio-volume-slider::-moz-range-thumb {
                    width: 14px; height: 14px;
                    border-radius: 50%; border: none;
                    background: #D4A843;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}

/* ── Main inline player (uses shared RadioContext) ── */
export default function RadioPlayer() {
    const radio = useRadio();

    const MAX_RETRIES = 3;

    const handleToggle = () => {
        if (radio.isPlaying || radio.isLoading) {
            radio.pause();
            trackEvent('radio_pause');
        } else {
            radio.play();
            trackEvent('radio_play');
        }
    };

    const handleRetry = () => {
        radio.play();
        trackEvent('radio_play', { method: 'retry' });
    };

    /* Derived status text */
    const statusText = radio.isPlaying
        ? 'Escuchando Radio Bethel Chile...'
        : radio.hasError
            ? ''
            : radio.isLoading
                ? 'Conectando...'
                : 'Presiona play para escuchar';

    /* Ambient glow */
    const glowStyle = radio.isPlaying
        ? { background: 'radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)' }
        : { background: 'radial-gradient(circle, rgba(30,58,95,0.10) 0%, transparent 70%)' };

    return (
        <>
            {/* NOTE: <audio> lives inside RadioProvider (RadioContext.tsx), not here */}

            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: '380px', height: '380px',
                    left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    transition: 'background 1.2s ease',
                    ...glowStyle,
                }}
            />

            {/* Card */}
            <div
                className="relative z-10 w-full text-center"
                style={{
                    background: 'linear-gradient(145deg, #111827 0%, #0D1520 100%)',
                    border: '1px solid rgba(212,168,67,0.12)',
                    borderRadius: '24px',
                    padding: 'clamp(32px, 5vw, 48px) clamp(24px, 5vw, 40px)',
                    maxWidth: '420px',
                    margin: '0 auto',
                    boxShadow: radio.isPlaying
                        ? '0 0 80px rgba(212,168,67,0.08), inset 0 1px 0 rgba(255,255,255,0.03)'
                        : '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                    transition: 'box-shadow 1s ease',
                }}
            >
                {/* Live badge */}
                <div className="flex items-center justify-center gap-2 mb-7">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            background: radio.isPlaying ? '#4ADE80' : '#D4A843',
                            boxShadow: radio.isPlaying ? '0 0 12px #4ADE80' : 'none',
                            animation: radio.isPlaying ? 'radioPulse 2s infinite' : 'none',
                        }}
                    />
                    <span
                        className="text-[11px] tracking-[3px] uppercase font-medium"
                        style={{ color: radio.isPlaying ? '#4ADE80' : '#8899AA', fontFamily: 'DM Sans, sans-serif' }}
                    >
                        {radio.isPlaying ? 'En Vivo' : radio.isLoading ? 'Conectando...' : '24/7'}
                    </span>
                </div>

                {/* Sound waves */}
                <div className="flex justify-center mb-7" style={{ minHeight: '32px' }}>
                    {radio.isPlaying ? (
                        <SoundWaves isPlaying={radio.isPlaying} />
                    ) : (
                        <div className="flex items-end gap-[3px]" style={{ height: '32px' }} aria-hidden="true">
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <div key={i} className="w-1 rounded-sm" style={{ height: '6px', background: '#2A3F55' }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Play / Error */}
                {!radio.hasError ? (
                    <button
                        onClick={handleToggle}
                        aria-label={radio.isPlaying ? 'Pausar radio' : 'Reproducir Radio Bethel Chile'}
                        className="flex items-center justify-center mx-auto mb-6 transition-all"
                        style={{
                            width: '88px', height: '88px',
                            borderRadius: '50%',
                            border: '2px solid rgba(212,168,67,0.3)',
                            background: radio.isPlaying
                                ? 'linear-gradient(145deg, #D4A843 0%, #B8922F 100%)'
                                : 'linear-gradient(145deg, #1A2A3E 0%, #0F1C2D 100%)',
                            color: radio.isPlaying ? '#0A0F18' : '#D4A843',
                            cursor: 'pointer',
                            transform: radio.isPlaying ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: radio.isPlaying
                                ? '0 0 40px rgba(212,168,67,0.3), 0 0 80px rgba(212,168,67,0.1)'
                                : '0 4px 20px rgba(0,0,0,0.3)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = radio.isPlaying ? 'scale(1.1)' : 'scale(1.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = radio.isPlaying ? 'scale(1.05)' : 'scale(1)'; }}
                    >
                        {radio.isLoading ? (
                            <div
                                aria-label="Cargando"
                                style={{
                                    width: '24px', height: '24px',
                                    border: '3px solid rgba(212,168,67,0.3)',
                                    borderTop: '3px solid #D4A843',
                                    borderRadius: '50%',
                                    animation: 'radioSpin 0.8s linear infinite',
                                }}
                            />
                        ) : radio.isPlaying ? (
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }} aria-hidden="true">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        )}
                    </button>
                ) : (
                    <div className="mb-6">
                        <p className="text-red-400 text-[14px] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            Señal no disponible en este momento
                        </p>
                        <button
                            onClick={handleRetry}
                            className="px-7 py-2.5 rounded-lg text-[14px] transition-all hover:bg-[rgba(212,168,67,0.1)]"
                            style={{
                                border: '1px solid rgba(212,168,67,0.3)',
                                background: 'transparent',
                                color: '#D4A843',
                                cursor: 'pointer',
                                fontFamily: 'DM Sans, sans-serif',
                            }}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Status text */}
                <p
                    className="text-[14px] mb-7 transition-colors duration-500"
                    style={{ color: radio.isPlaying ? '#D4A843' : '#5A6A7A', fontFamily: 'DM Sans, sans-serif' }}
                >
                    {statusText}
                </p>

                {/* Volume */}
                <div className="flex justify-center">
                    <VolumeControl volume={radio.volume} onChange={radio.setVolume} />
                </div>
            </div>

            {/* Global keyframes */}
            <style>{`
                @keyframes radioPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.35; }
                }
                @keyframes radioSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
