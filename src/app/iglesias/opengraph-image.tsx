import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Encuentra tu Iglesia en Chile — Movimiento Misionero Mundial';
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
                {/* Decoración geométrica — círculos */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-60px',
                        right: '80px',
                        width: '340px',
                        height: '340px',
                        borderRadius: '50%',
                        border: '2px solid rgba(212,168,67,0.20)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '120px',
                        width: '240px',
                        height: '240px',
                        borderRadius: '50%',
                        border: '2px solid rgba(212,168,67,0.12)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-80px',
                        left: '-60px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(15,32,53,0.5)',
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

                {/* Contenido */}
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
                    <div style={{ display: 'flex', marginBottom: '20px' }}>
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
                            +30 CONGREGACIONES EN CHILE
                        </div>
                    </div>

                    {/* Título */}
                    <div
                        style={{
                            fontSize: '68px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            fontFamily: 'serif',
                            maxWidth: '850px',
                        }}
                    >
                        Encuentra tu Iglesia Cristiana
                    </div>

                    {/* Subtítulo */}
                    <div
                        style={{
                            marginTop: '20px',
                            fontSize: '26px',
                            color: '#B0C4DE',
                            lineHeight: 1.4,
                            fontFamily: 'sans-serif',
                            maxWidth: '720px',
                        }}
                    >
                        Congregaciones del Movimiento Misionero Mundial en todo el país, listas para recibirte.
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
                    mmmchile.cl/iglesias
                </div>
            </div>
        ),
        { ...size }
    );
}
