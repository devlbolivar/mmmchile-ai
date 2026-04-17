import { Metadata } from 'next';
import RadioPlayer from '@/components/radio/RadioPlayer';
import RadioInfo from '@/components/radio/RadioInfo';
import RadioSchedule from '@/components/radio/RadioSchedule';
import RadioFunnel from '@/components/radio/RadioFunnel';

/* ── SEO ── */
export const metadata: Metadata = {
    title: 'Radio Cristiana en Vivo 24/7 — MMM Chile',
    description:
        'Escucha Radio Bethel Chile en vivo. Música cristiana, predicaciones y devocionales las 24 horas del día.',
    alternates: { canonical: '/radio' },
    openGraph: {
        title: 'Radio Cristiana en Vivo 24/7 — MMM Chile',
        description:
            'Escucha Radio Bethel Chile en vivo. Música cristiana, predicaciones y devocionales las 24 horas del día.',
        type: 'website',
    },
};

/* ── Page ── */
export default function RadioPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["RadioStation", "BroadcastService"],
        "name": "Radio Bethel Chile",
        "url": "https://mmmchile.cl/radio",
        "description": "Radio cristiana transmitiendo en vivo las 24 horas del día. Música, predicaciones e himnos.",
        "broadcastDisplayName": "Radio Bethel Chile",
        "parentOrganization": {
            "@type": "Organization",
            "name": "Movimiento Misionero Mundial Chile"
        }
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* ===== HERO / PLAYER ===== */}
            <section
                style={{
                    minHeight: '90vh',
                    background:
                        'radial-gradient(ellipse at 50% 0%, #1A2E45 0%, #0A0F18 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'clamp(110px, 15vw, 150px) 20px clamp(60px, 8vw, 80px)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle dot texture */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.03,
                        backgroundImage:
                            'radial-gradient(circle at 25% 55%, #D4A843 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                        pointerEvents: 'none',
                    }}
                />

                {/* Station name */}
                <div style={{ textAlign: 'center', marginBottom: '48px', position: 'relative', zIndex: 1 }}>
                    {/* Icon */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '52px',
                            height: '52px',
                            borderRadius: '14px',
                            background: 'rgba(212,168,67,0.1)',
                            border: '1px solid rgba(212,168,67,0.2)',
                            marginBottom: '20px',
                        }}
                        aria-hidden="true"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#D4A843"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="2" />
                            <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
                            <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
                        </svg>
                    </div>

                    <h1
                        className="font-serif"
                        style={{
                            color: '#F8F6F0',
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            fontWeight: 400,
                            margin: '0 0 10px',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Radio Bethel Chile
                    </h1>
                    <p
                        style={{
                            color: '#6B7B8D',
                            fontSize: 'clamp(14px, 2vw, 17px)',
                            fontFamily: 'DM Sans, sans-serif',
                            margin: 0,
                        }}
                    >
                        Música cristiana y la Palabra de Dios — las 24 horas
                    </p>
                </div>

                {/* Player (client component) */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '440px', zIndex: 1 }}>
                    <RadioPlayer />
                </div>
            </section>

            {/* ===== INFO ===== */}
            <RadioInfo />

            {/* ===== SCHEDULE ===== */}
            <RadioSchedule />

            {/* ===== FUNNEL ===== */}
            <RadioFunnel />
        </main>
    );
}
