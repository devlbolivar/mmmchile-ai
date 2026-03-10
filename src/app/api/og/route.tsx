import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') ?? 'MMM Chile';
    const category = searchParams.get('category') ?? '';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '64px',
                    background: '#1E3A5F',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background radial decoration */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '-80px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'rgba(212,168,67,0.07)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-120px',
                        left: '-80px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                    }}
                />

                {/* Logo — top left */}
                <div
                    style={{
                        position: 'absolute',
                        top: '48px',
                        left: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            background: '#D4A843',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1E3A5F',
                            fontSize: '22px',
                            fontWeight: 'bold',
                        }}
                    >
                        ✦
                    </div>
                    <span
                        style={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            letterSpacing: '0.04em',
                        }}
                    >
                        MMM Chile
                    </span>
                </div>

                {/* Category badge */}
                {category ? (
                    <div style={{ display: 'flex', marginBottom: '22px' }}>
                        <div
                            style={{
                                background: '#D4A843',
                                color: '#0F2035',
                                padding: '7px 18px',
                                borderRadius: '100px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                display: 'flex',
                            }}
                        >
                            {category}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', marginBottom: '22px' }} />
                )}

                {/* Title */}
                <div
                    style={{
                        color: 'white',
                        fontSize: title.length > 65 ? '40px' : title.length > 45 ? '48px' : '56px',
                        lineHeight: 1.2,
                        fontWeight: 'bold',
                        maxWidth: '950px',
                        display: 'flex',
                    }}
                >
                    {title}
                </div>

                {/* Domain — bottom right */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '52px',
                        right: '64px',
                        color: 'rgba(255,255,255,0.35)',
                        fontSize: '16px',
                        display: 'flex',
                    }}
                >
                    mmmchile.cl
                </div>

                {/* Gold accent bar — bottom */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(90deg, #D4A843 0%, #F5E6C4 50%, #D4A843 100%)',
                        display: 'flex',
                    }}
                />
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
