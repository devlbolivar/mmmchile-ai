import Breadcrumb from '@/components/shared/Breadcrumb';

interface LiveHeroProps {
    nextLabel: string;
    nextTime: string;
}

export default function LiveHero({ nextLabel, nextTime }: LiveHeroProps) {
    return (
        <div className="relative z-1 text-center">
            {/* Breadcrumb */}
            <div className="mb-8">
                <Breadcrumb items={[{ label: 'En Vivo' }]} variant="light" />
            </div>

            {/* Next service badge */}
            <div
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-7"
                style={{
                    background: 'rgba(212,168,67,0.12)',
                    border: '1px solid rgba(212,168,67,0.2)',
                }}
            >
                <span
                    className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse"
                    aria-hidden="true"
                />
                <span className="text-[#D4A843] text-[13px] font-medium font-sans tracking-[0.5px]">
                    Próximo culto: {nextLabel} a las {nextTime}
                </span>
            </div>

            <h1 className="font-serif text-[clamp(30px,6vw,52px)] font-normal text-[#F8F6F0] mb-4">
                Culto en Vivo
            </h1>

            <p className="text-[rgba(248,246,240,0.6)] text-[clamp(15px,2.5vw,18px)] font-sans max-w-[480px] mx-auto leading-[1.7]">
                Participa de nuestros servicios desde donde estés
            </p>
        </div>
    );
}
