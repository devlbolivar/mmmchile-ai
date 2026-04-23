import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Movimiento Misionero Mundial Chile — Iglesias Cristianas y Evangelio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const logoData = await readFile(path.join(process.cwd(), 'public/logo.png'));
    const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    position: 'relative',
                    background: '#1E3A5F',
                }}
            >
                {/* Fondo degradado diagonal */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1200px',
                        height: '630px',
                        background: 'linear-gradient(135deg, #0F2035 0%, #1E3A5F 50%, #1a4a7a 100%)',
                        display: 'flex',
                    }}
                />

                {/* Círculo dorado grande — decoración */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-180px',
                        right: '-100px',
                        width: '560px',
                        height: '560px',
                        borderRadius: '50%',
                        border: '2px solid rgba(212,168,67,0.15)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '-80px',
                        right: '0px',
                        width: '360px',
                        height: '360px',
                        borderRadius: '50%',
                        border: '2px solid rgba(212,168,67,0.10)',
                        display: 'flex',
                    }}
                />

                {/* Punto de luz superior derecha */}
                <div
                    style={{
                        position: 'absolute',
                        top: '60px',
                        right: '120px',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(212,168,67,0.18) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Barra dorada inferior */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '1200px',
                        height: '5px',
                        background: 'linear-gradient(90deg, #D4A843 0%, #F5E6C4 50%, #D4A843 100%)',
                        display: 'flex',
                    }}
                />

                {/* Contenido principal */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '52px 72px 64px',
                    }}
                >
                    {/* Logo arriba */}
                    <img
                        src={logoSrc}
                        style={{
                            width: '180px',
                            height: '111px',
                            objectFit: 'contain',
                            objectPosition: 'left center',
                        }}
                    />

                    {/* Cuerpo central */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            maxWidth: '760px',
                        }}
                    >
                        {/* Título */}
                        <div
                            style={{
                                fontSize: '64px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                lineHeight: 1.1,
                                fontFamily: 'serif',
                            }}
                        >
                            Fe, Esperanza y Comunidad en Chile
                        </div>

                        {/* Descripción */}
                        <div
                            style={{
                                fontSize: '24px',
                                color: '#B0C4DE',
                                lineHeight: 1.5,
                                fontFamily: 'sans-serif',
                                maxWidth: '680px',
                            }}
                        >
                            Conoce a Jesús, encuentra una iglesia y accede a recursos para tu fe.
                        </div>

                        {/* Pills de acciones clave */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            {['Conoce a Jesús', 'Encuentra tu Iglesia', 'Pide Oración'].map((label) => (
                                <div
                                    key={label}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(212,168,67,0.35)',
                                        color: '#D4A843',
                                        fontSize: '15px',
                                        fontFamily: 'sans-serif',
                                        fontWeight: 600,
                                        padding: '8px 20px',
                                        borderRadius: '999px',
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dominio abajo derecha */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '22px',
                        right: '72px',
                        color: 'rgba(255,255,255,0.28)',
                        fontSize: '15px',
                        fontFamily: 'sans-serif',
                        display: 'flex',
                    }}
                >
                    mmmchile.cl
                </div>
            </div>
        ),
        { ...size }
    );
}
