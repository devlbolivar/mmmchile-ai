import Link from 'next/link';

const ctas = [
    { text: 'Conoce a Jesús', href: '/conoce-a-jesus', icon: '❤️' },
    { text: 'Necesito Oración', href: '/oracion', icon: '🙏' },
    { text: 'Encontrar Iglesia', href: '/iglesias', icon: '📍' },
];

export default function RadioFunnel() {
    return (
        <section
            style={{
                background: 'linear-gradient(180deg, #0F1C2B 0%, #111D2B 100%)',
                padding: 'clamp(56px, 8vw, 80px) 20px',
                textAlign: 'center',
            }}
        >
            <style>{`
                .radio-funnel-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 26px;
                    border-radius: 12px;
                    border: 1px solid rgba(212,168,67,0.15);
                    background: rgba(212,168,67,0.05);
                    color: #C4B898;
                    text-decoration: none;
                    font-size: 15px;
                    font-family: DM Sans, sans-serif;
                    transition: all 0.3s ease;
                }
                .radio-funnel-btn:hover {
                    background: rgba(212,168,67,0.12);
                    border-color: rgba(212,168,67,0.35);
                    color: #D4A843;
                    transform: translateY(-2px);
                }
                .radio-en-vivo-link {
                    display: inline-block;
                    margin-top: 36px;
                    color: #5A6A7A;
                    font-size: 14px;
                    font-family: DM Sans, sans-serif;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
                .radio-en-vivo-link:hover { color: #8899AA; }
            `}</style>

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
                ¿La radio tocó tu corazón?
            </span>
            <h2
                className="font-serif"
                style={{
                    color: '#F8F6F0',
                    fontSize: 'clamp(20px, 3.5vw, 28px)',
                    fontWeight: 400,
                    margin: '10px 0 36px',
                }}
            >
                Da el siguiente paso
            </h2>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '14px',
                    justifyContent: 'center',
                    maxWidth: '680px',
                    margin: '0 auto',
                }}
            >
                {ctas.map((cta) => (
                    <Link key={cta.href} href={cta.href} className="radio-funnel-btn">
                        <span aria-hidden="true">{cta.icon}</span>
                        <span>{cta.text}</span>
                    </Link>
                ))}
            </div>

            {/* Link to en-vivo */}
            <Link href="/en-vivo" className="radio-en-vivo-link">
                También puedes ver nuestros cultos en vivo →
            </Link>
        </section>
    );
}
