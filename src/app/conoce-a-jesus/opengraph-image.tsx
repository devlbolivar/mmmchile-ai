import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'Conoce a Jesús — Movimiento Misionero Mundial Chile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    const [bgData, logoData] = await Promise.all([
        readFile(path.join(process.cwd(), 'public/images/gospel_hero_bg.png')),
        readFile(path.join(process.cwd(), 'public/logo.png')),
    ]);
    const bgBase64 = `data:image/png;base64,${Buffer.from(bgData).toString('base64')}`;
    const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    position: 'relative',
                }}
            >
                {/* Fondo */}
                <img
                    src={bgBase64}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1200px',
                        height: '630px',
                        objectFit: 'cover',
                    }}
                />

                {/* Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1200px',
                        height: '630px',
                        background: 'rgba(15,32,53,0.80)',
                        display: 'flex',
                    }}
                />

                {/* Línea dorada superior */}
                <div
                    style={{
                        position: 'absolute',
                        top: '48px',
                        left: '72px',
                        width: '1056px',
                        height: '2px',
                        background: '#D4A843',
                        display: 'flex',
                    }}
                />

                {/* Línea dorada inferior */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '48px',
                        left: '72px',
                        width: '1056px',
                        height: '2px',
                        background: '#D4A843',
                        display: 'flex',
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
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        padding: '0 96px',
                    }}
                >
                    {/* Logo */}
                    <img
                        src={logoSrc}
                        style={{
                            width: '180px',
                            height: '111px',
                            objectFit: 'contain',
                        }}
                    />

                    {/* Título */}
                    <div
                        style={{
                            fontSize: '76px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            fontFamily: 'serif',
                            textAlign: 'center',
                        }}
                    >
                        Conoce a Jesús
                    </div>

                    {/* Subtítulo */}
                    <div
                        style={{
                            fontSize: '26px',
                            color: '#E8E0D0',
                            lineHeight: 1.4,
                            fontFamily: 'sans-serif',
                            textAlign: 'center',
                            maxWidth: '820px',
                        }}
                    >
                        ¿Sientes que algo falta? Descubre el amor de Dios y da el primer paso hacia una vida con propósito y paz.
                    </div>

                    {/* URL pill */}
                    <div
                        style={{
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#D4A843',
                            color: '#0F2035',
                            fontSize: '18px',
                            fontWeight: 700,
                            fontFamily: 'sans-serif',
                            padding: '10px 32px',
                            borderRadius: '999px',
                        }}
                    >
                        mmmchile.cl/conoce-a-jesus
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
