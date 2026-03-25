'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

interface YouTubeEmbedProps {
    channelId: string | null;
}

export default function YouTubeEmbed({ channelId }: YouTubeEmbedProps) {
    const [showPlayer, setShowPlayer] = useState(false);

    const embedSrc = channelId
        ? `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1`
        : null;

    const handlePlayClick = () => {
        if (!embedSrc) return;
        trackEvent('live_player_click', {
            event_category: 'live',
            channel_id: channelId,
        });
        setShowPlayer(true);
    };

    return (
        <div
            style={{
                borderRadius: '20px 20px 0 0',
                overflow: 'hidden',
                boxShadow: '0 -4px 60px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                background: '#000',
            }}
        >
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                {showPlayer && embedSrc ? (
                    <iframe
                        src={embedSrc}
                        title="Culto en vivo — MMM Chile"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                ) : (
                    /* Lazy-load placeholder */
                    <button
                        onClick={handlePlayClick}
                        aria-label="Toca para conectarte al culto en vivo"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '20px',
                            background: 'linear-gradient(180deg, #0F1520 0%, #0A0E16 100%)',
                            border: 'none',
                            cursor: embedSrc ? 'pointer' : 'default',
                            padding: '24px',
                        }}
                    >
                        {/* Play button */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(212,168,67,0.15)',
                                border: '2px solid rgba(212,168,67,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                            }}
                            className="hover:bg-[rgba(212,168,67,0.25)] hover:border-[rgba(212,168,67,0.5)]"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="#D4A843"
                                style={{ marginLeft: '3px' }}
                                aria-hidden="true"
                            >
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            {embedSrc ? (
                                <>
                                    <p style={{ color: '#F8F6F0', fontSize: '16px', fontWeight: 500, margin: '0 0 6px 0' }}>
                                        Toca para conectarte
                                    </p>
                                    <p style={{ color: '#5A6A7A', fontSize: '13px', margin: 0 }}>
                                        Si hay transmisión activa, se reproducirá automáticamente
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#F8F6F0', fontSize: '16px', fontWeight: 500, margin: '0 0 6px 0' }}>
                                        Transmisión no disponible en este momento
                                    </p>
                                    <a
                                        href="https://www.youtube.com/@KoinoniaMMMChileOficial"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ color: '#D4A843', fontSize: '13px', textDecoration: 'underline' }}
                                    >
                                        Ver canal de YouTube →
                                    </a>
                                </>
                            )}
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
