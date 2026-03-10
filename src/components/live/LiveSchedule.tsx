interface Service {
    day: string;
    time: string;
    type: string;
    dayIndex: number;
    isMain?: boolean;
}

const services: Service[] = [
    { day: 'Martes', time: '7:30 PM', type: 'Culto de oración', dayIndex: 2 },
    { day: 'Jueves', time: '7:30 PM', type: 'Culto general', dayIndex: 4 },
    { day: 'Domingo', time: '11:00 AM', type: 'Culto Principal', dayIndex: 0, isMain: true },
    { day: 'Domingo', time: '5:00 PM', type: 'Culto general', dayIndex: 0 },
];

interface LiveScheduleProps {
    nextDay: string;
    nextTime: string;
    currentDayIndex: number;
}

export default function LiveSchedule({ nextDay, nextTime, currentDayIndex }: LiveScheduleProps) {
    return (
        <section
            style={{
                background: '#FFFFFF',
                padding: 'clamp(60px, 10vw, 80px) 20px',
                borderBottom: '1px solid #E8E5E0',
            }}
        >
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span
                        style={{
                            color: '#D4A843',
                            fontSize: '12px',
                            fontFamily: 'DM Sans, sans-serif',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Horarios
                    </span>
                    <h2
                        className="font-serif"
                        style={{
                            color: '#1A1A1A',
                            fontSize: 'clamp(24px, 4vw, 34px)',
                            fontWeight: 400,
                            margin: '12px 0 8px 0',
                        }}
                    >
                        Servicios de la Iglesia Central
                    </h2>
                    <p
                        style={{
                            color: '#6B7280',
                            fontSize: '15px',
                            fontFamily: 'DM Sans, sans-serif',
                        }}
                    >
                        Todos los cultos se transmiten en vivo por YouTube
                    </p>
                </div>

                {/* Schedule list */}
                <div
                    style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #E8E5E0',
                    }}
                >
                    {services.map((service, i) => {
                        const isToday = currentDayIndex === service.dayIndex;
                        const isNext =
                            service.day === nextDay && service.time === nextTime;

                        return (
                            <div
                                key={i}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '110px 90px 1fr auto',
                                    alignItems: 'center',
                                    padding: '18px 24px',
                                    gap: '8px',
                                    background: isNext
                                        ? 'rgba(212,168,67,0.06)'
                                        : i % 2 === 0 ? '#FAFAF8' : '#FFFFFF',
                                    borderBottom:
                                        i < services.length - 1
                                            ? '1px solid #F0EDE8'
                                            : 'none',
                                    borderLeft: isNext
                                        ? '3px solid #D4A843'
                                        : '3px solid transparent',
                                }}
                            >
                                <span
                                    style={{
                                        color: isToday ? '#1E3A5F' : '#2D2D2D',
                                        fontSize: '15px',
                                        fontFamily: 'DM Sans, sans-serif',
                                        fontWeight: isToday ? 600 : 400,
                                    }}
                                >
                                    {service.day}
                                </span>

                                <span
                                    style={{
                                        color: '#D4A843',
                                        fontSize: '14px',
                                        fontFamily: 'DM Mono, monospace',
                                        fontWeight: 500,
                                    }}
                                >
                                    {service.time}
                                </span>

                                <span
                                    style={{
                                        color: '#6B7280',
                                        fontSize: '14px',
                                        fontFamily: 'DM Sans, sans-serif',
                                    }}
                                >
                                    {service.type}
                                </span>

                                {isNext && (
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontFamily: 'DM Sans, sans-serif',
                                            color: '#D4A843',
                                            background: 'rgba(212,168,67,0.1)',
                                            padding: '3px 10px',
                                            borderRadius: '100px',
                                            fontWeight: 500,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Próximo
                                    </span>
                                )}

                                {service.isMain && !isNext && (
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontFamily: 'DM Sans, sans-serif',
                                            color: '#1E3A5F',
                                            background: 'rgba(30,58,95,0.08)',
                                            padding: '3px 10px',
                                            borderRadius: '100px',
                                            fontWeight: 500,
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Principal
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
