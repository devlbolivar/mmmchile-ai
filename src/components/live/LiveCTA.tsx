import Link from 'next/link';

export default function LiveCTA() {
    return (
        <section
            style={{
                background: '#F8F6F0',
                padding: 'clamp(60px, 10vw, 80px) 20px',
                textAlign: 'center',
            }}
        >
            <p
                style={{
                    color: '#9CA3AF',
                    fontSize: '14px',
                    fontFamily: 'DM Sans, sans-serif',
                    margin: '0 0 8px 0',
                }}
            >
                Lo digital es bueno, pero lo presencial es mejor
            </p>

            <h2
                className="font-serif"
                style={{
                    color: '#2D2D2D',
                    fontSize: 'clamp(22px, 4vw, 30px)',
                    fontWeight: 400,
                    margin: '0 0 40px 0',
                }}
            >
                Te esperamos en persona
            </h2>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    justifyContent: 'center',
                    maxWidth: '750px',
                    margin: '0 auto',
                }}
            >
                <Link
                    href="/iglesias"
                    className="transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                        padding: '16px 32px',
                        borderRadius: '14px',
                        border: '1.5px solid rgba(30,58,95,0.15)',
                        background: 'rgba(30,58,95,0.05)',
                        color: '#1E3A5F',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 500,
                    }}
                >
                    Encuentra una iglesia cerca de ti →
                </Link>

                <Link
                    href="/conoce-a-jesus"
                    className="transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                        padding: '16px 32px',
                        borderRadius: '14px',
                        border: '1.5px solid rgba(212,168,67,0.15)',
                        background: 'rgba(212,168,67,0.05)',
                        color: '#D4A843',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontWeight: 500,
                    }}
                >
                    ¿Quieres conocer a Jesús? →
                </Link>
            </div>
        </section>
    );
}
