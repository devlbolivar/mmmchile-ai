import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Muro de Oración — Movimiento Misionero Mundial Chile';
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
                    background: '#0F2035',
                }}
            >
                {/* Círculo decorativo superior derecha */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '480px',
                        height: '480px',
                        borderRadius: '50%',
                        background: 'rgba(212,168,67,0.08)',
                        display: 'flex',
                    }}
                />

                {/* Círculo decorativo inferior izquierda */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-120px',
                        left: '-80px',
                        width: '380px',
                        height: '380px',
                        borderRadius: '50%',
                        background: 'rgba(30,58,95,0.6)',
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
                        height: '6px',
                        background: '#D4A843',
                        display: 'flex',
                    }}
                />

                {/* Logo arriba izquierda */}
                <img
                    src={logoSrc}
                    style={{
                        position: 'absolute',
                        top: '44px',
                        left: '64px',
                        width: '160px',
                        height: '99px',
                        objectFit: 'contain',
                    }}
                />

                {/* Contenido central */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1200px',
                        height: '630px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        padding: '64px',
                    }}
                >
                    {/* Badge */}
                    <div
                        style={{
                            display: 'flex',
                            marginBottom: '20px',
                        }}
                    >
                        <div
                            style={{
                                background: '#D4A843',
                                color: '#0F2035',
                                fontSize: '13px',
                                fontWeight: 700,
                                fontFamily: 'sans-serif',
                                padding: '7px 18px',
                                borderRadius: '999px',
                                letterSpacing: '2px',
                                display: 'flex',
                            }}
                        >
                            INTERCESIÓN
                        </div>
                    </div>

                    {/* Título */}
                    <div
                        style={{
                            fontSize: '72px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            fontFamily: 'serif',
                            maxWidth: '800px',
                        }}
                    >
                        Muro de Oración
                    </div>

                    {/* Subtítulo */}
                    <div
                        style={{
                            marginTop: '20px',
                            fontSize: '26px',
                            color: '#B0BEC5',
                            lineHeight: 1.4,
                            fontFamily: 'sans-serif',
                            maxWidth: '700px',
                        }}
                    >
                        Comparte tu necesidad. Nuestro equipo intercede por ti.
                    </div>
                </div>

                {/* Dominio abajo derecha */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        right: '64px',
                        color: 'rgba(255,255,255,0.30)',
                        fontSize: '15px',
                        fontFamily: 'sans-serif',
                        display: 'flex',
                    }}
                >
                    mmmchile.cl/oracion
                </div>
            </div>
        ),
        { ...size }
    );
}
