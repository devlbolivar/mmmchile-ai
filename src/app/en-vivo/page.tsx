import { Metadata } from 'next';
import LiveHero from '@/components/live/LiveHero';
import YouTubeEmbed from '@/components/live/YouTubeEmbed';
import SubscribeButton from '@/components/live/SubscribeButton';
import LiveSchedule from '@/components/live/LiveSchedule';
import LiveRadioBanner from '@/components/live/LiveRadioBanner';
import LiveCTA from '@/components/live/LiveCTA';

export const metadata: Metadata = {
    title: 'Culto en Vivo | MMM Chile — Conéctate desde Donde Estés',
    description:
        'Mira los cultos del Movimiento Misionero Mundial Chile en vivo por YouTube. Horarios y transmisiones.',
    alternates: {
        canonical: '/en-vivo',
    },
    openGraph: {
        title: 'Culto en Vivo | MMM Chile',
        description:
            'Mira los cultos del Movimiento Misionero Mundial Chile en vivo por YouTube. Horarios y transmisiones.',
        type: 'website',
    },
};

// ---------------------------------------------------------------------------
// Server-side next-service calculator (timezone: America/Santiago)
// ---------------------------------------------------------------------------

interface ServiceEntry {
    day: string;
    time: string;
    dayIndex: number; // 0=Sunday
    hour: number;
    minute: number;
}

const SERVICE_ENTRIES: ServiceEntry[] = [
    { day: 'Domingo', time: '11:00 AM', dayIndex: 0, hour: 11, minute: 0 },
    { day: 'Domingo', time: '5:00 PM', dayIndex: 0, hour: 17, minute: 0 },
    { day: 'Lunes', time: '7:30 PM', dayIndex: 1, hour: 19, minute: 30 },
    { day: 'Martes', time: '7:30 PM', dayIndex: 2, hour: 19, minute: 30 },
    { day: 'Jueves', time: '7:30 PM', dayIndex: 4, hour: 19, minute: 30 },
    { day: 'Viernes', time: '7:00 PM', dayIndex: 5, hour: 19, minute: 0 },
    { day: 'Sábado', time: '5:00 PM', dayIndex: 6, hour: 17, minute: 0 },
];

interface NextService {
    day: string;
    time: string;
    daysAhead: number;
    dayIndex: number;
}

function getNextServiceSSR(): NextService {
    // Parse current time in America/Santiago
    const nowStr = new Date().toLocaleString('en-US', {
        timeZone: 'America/Santiago',
    });
    const now = new Date(nowStr);
    const currentDay = now.getDay(); // 0=Sunday
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let daysAhead = 0; daysAhead < 7; daysAhead++) {
        const checkDay = (currentDay + daysAhead) % 7;
        // Filter services for this day, sorted by time
        const dayServices = SERVICE_ENTRIES
            .filter((s) => s.dayIndex === checkDay)
            .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

        for (const service of dayServices) {
            const serviceMinutes = service.hour * 60 + service.minute;
            // Same day: skip past services
            if (daysAhead === 0 && serviceMinutes <= currentMinutes) continue;
            return { ...service, daysAhead };
        }
    }

    // Fallback: first service next week
    return { ...SERVICE_ENTRIES[0], daysAhead: 1 };
}

function getNextLabel(daysAhead: number, day: string): string {
    if (daysAhead === 0) return 'Hoy';
    if (daysAhead === 1) return 'Mañana';
    return day;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EnVivoPage() {
    const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || null;
    const youtubeChannelUrl = `https://www.youtube.com/channel/${channelId || ''}?sub_confirmation=1`;

    const next = getNextServiceSSR();
    const nextLabel = getNextLabel(next.daysAhead, next.day);

    // For the schedule, we also need currentDayIndex in Santiago
    const nowStr = new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' });
    const santiagoDayIndex = new Date(nowStr).getDay();

    return (
        <main>
            {/* ===== HERO + PLAYER ===== */}
            <section
                style={{
                    background: 'linear-gradient(160deg, #0F2035 0%, #1E3A5F 50%, #1A3352 100%)',
                    padding: 'clamp(100px, 14vw, 140px) 20px 0 20px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle dot pattern layer */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.03,
                        backgroundImage:
                            'radial-gradient(circle at 30% 40%, #D4A843 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none',
                    }}
                />

                {/* Hero text + badge */}
                <LiveHero nextLabel={nextLabel} nextTime={next.time} />

                {/* Player — max-width 900px, rounded top, flush bottom */}
                <div
                    style={{
                        maxWidth: '900px',
                        margin: '48px auto 0 auto',
                        position: 'relative',
                        zIndex: 2,
                    }}
                >
                    <YouTubeEmbed channelId={channelId || null} />
                </div>
            </section>

            {/* ===== INFO BAR ===== */}
            <section
                style={{
                    background: '#FFFFFF',
                    padding: '24px 20px',
                    borderBottom: '1px solid #E8E5E0',
                }}
            >
                <div
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}
                >
                    {/* YouTube icon + address */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <div>
                            <p
                                style={{
                                    color: '#2D2D2D',
                                    fontSize: '14px',
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontWeight: 500,
                                    margin: 0,
                                }}
                            >
                                Transmitido por YouTube
                            </p>
                            <p
                                style={{
                                    color: '#9CA3AF',
                                    fontSize: '12px',
                                    fontFamily: 'DM Sans, sans-serif',
                                    margin: 0,
                                }}
                            >
                                Iglesia Central — General Gana #924, Santiago
                            </p>
                        </div>
                    </div>

                    {/* Subscribe button */}
                    <SubscribeButton channelUrl={youtubeChannelUrl} />
                </div>
            </section>

            {/* ===== HORARIOS ===== */}
            <LiveSchedule
                nextDay={next.day}
                nextTime={next.time}
                currentDayIndex={santiagoDayIndex}
            />

            {/* ===== RADIO BANNER ===== */}
            <LiveRadioBanner />

            {/* ===== CTAs ===== */}
            <LiveCTA />
        </main>
    );
}
