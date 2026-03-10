import Link from 'next/link';

export default function LiveRadioBanner() {
    return (
        <section
            style={{
                background: 'linear-gradient(135deg, #0F2035 0%, #162D45 100%)',
                padding: 'clamp(48px, 8vw, 80px) 20px',
                textAlign: 'center',
            }}
        >
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                {/* 24/7 badge */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#D4A843"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="m4.9 19.1 2.8-2.8" />
                        <path d="M16.3 19.1 13.5 16.3" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="m7.1 7.1 2.8 2.8" />
                        <path d="m14.1 9.9 2.8-2.8" />
                        <path d="M12 2v4" />
                        <path d="M2 12h4" />
                        <path d="M18 12h4" />
                    </svg>
                    <span
                        style={{
                            color: '#4ADE80',
                            fontSize: '12px',
                            fontFamily: 'DM Sans, sans-serif',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: 500,
                        }}
                    >
                        24/7 en vivo
                    </span>
                </div>

                <h2
                    className="font-serif"
                    style={{
                        color: '#F8F6F0',
                        fontSize: 'clamp(20px, 4vw, 26px)',
                        fontWeight: 400,
                        margin: '0 0 8px 0',
                    }}
                >
                    ¿No hay culto ahora? Escucha la radio
                </h2>

                <p
                    style={{
                        color: 'rgba(248,246,240,0.5)',
                        fontSize: '15px',
                        fontFamily: 'DM Sans, sans-serif',
                        margin: '0 0 28px 0',
                    }}
                >
                    Radio Bethel Chile — Música cristiana y predicaciones las 24 horas
                </p>

                <Link
                    href="/radio"
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-medium text-[15px] transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                        background: 'rgba(212,168,67,0.12)',
                        border: '1px solid rgba(212,168,67,0.25)',
                        color: '#D4A843',
                        textDecoration: 'none',
                        fontFamily: 'DM Sans, sans-serif',
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Escuchar Radio
                </Link>
            </div>
        </section>
    );
}
