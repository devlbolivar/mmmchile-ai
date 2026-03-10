import Image from 'next/image';

export default function RadioInfo() {
    return (
        <section
            style={{
                background: 'linear-gradient(180deg, #0A0F18 0%, #0D1520 100%)',
                padding: 'clamp(56px, 8vw, 80px) 20px',
            }}
        >
            <div
                style={{
                    maxWidth: '640px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '24px',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '18px',
                        border: '1px solid rgba(212,168,67,0.2)',
                        background: 'linear-gradient(145deg, #111827 0%, #0D1520 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    <Image
                        src="/logo-bethel.png"
                        alt="Logo Radio Bethel Chile"
                        width={70}
                        height={70}
                        className="object-contain p-2"
                    />
                </div>

                {/* Copy */}
                <div>
                    <span
                        style={{
                            color: '#D4A843',
                            fontSize: '11px',
                            fontFamily: 'DM Sans, sans-serif',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                        }}
                    >
                        Sobre la radio
                    </span>
                    <h2
                        className="font-serif"
                        style={{
                            color: '#F8F6F0',
                            fontSize: 'clamp(20px, 3.5vw, 26px)',
                            fontWeight: 400,
                            margin: '10px 0 14px',
                        }}
                    >
                        Radio Bethel Chile
                    </h2>
                    <p
                        style={{
                            color: '#6B7B8D',
                            fontSize: '16px',
                            fontFamily: 'DM Sans, sans-serif',
                            lineHeight: 1.75,
                            margin: 0,
                            maxWidth: '500px',
                        }}
                    >
                        Una radio cristiana en línea que transmite las 24 horas del día,
                        los 7 días de la semana. Escucha música de adoración, predicaciones
                        del evangelio y devocionales que edificarán tu fe.
                    </p>
                </div>
            </div>
        </section>
    );
}
