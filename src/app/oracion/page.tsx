import { Metadata } from "next";
import Link from "next/link";
import { PrayerForm } from "@/components/prayer/PrayerForm";
import { VerseCards } from "@/components/prayer/VerseCards";
import { PrayerWall } from "@/components/prayer/PrayerWall";
import Breadcrumb from "@/components/shared/Breadcrumb";

export const revalidate = 30;

export const metadata: Metadata = {
    title: "Petición de Oración | MMM Chile",
    description: "Déjanos tu petición de oración. Nuestro equipo de intercesión estará clamando a Dios por tu necesidad.",
    alternates: {
        canonical: '/oracion',
    },
    openGraph: {
        title: "Peticiones de Oración | MMM Chile",
        description: "Comparte tu necesidad y nuestro equipo de intercesión orará por ti esta semana. Dios te escucha y nosotros también.",
        url: "https://mmmchile.cl/oracion",
        siteName: "MMM Chile",
        locale: "es_CL",
        type: "website",
    },
};

const ArrowIco = ({ s = 14 }: { s?: number }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const HandsPraying = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="opacity-85 mx-auto">
        <circle cx="40" cy="40" r="36" fill="url(#prayGlow)" />
        <path d="M40 15 Q44 22 44 28 Q44 33 40 35 Q36 33 36 28 Q36 22 40 15Z" fill="var(--color-accent)" className="opacity-60" />
        <path d="M40 18 Q42.5 23 42.5 27 Q42.5 31 40 32.5 Q37.5 31 37.5 27 Q37.5 23 40 18Z" fill="var(--color-accent)" className="opacity-90" />
        <ellipse cx="40" cy="27" rx="2" ry="3" fill="#FFF5E0" className="opacity-70" />
        <rect x="37" y="35" width="6" height="20" rx="2" fill="rgba(255,255,255,0.35)" stroke="var(--color-accent)" strokeWidth="0.8" className="opacity-50" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i * Math.PI) / 3 - Math.PI / 2;
            return (
                <line
                    key={i}
                    x1={40 + Math.cos(a) * 8}
                    y1={26 + Math.sin(a) * 8}
                    x2={40 + Math.cos(a) * 16}
                    y2={26 + Math.sin(a) * 16}
                    stroke="var(--color-accent)"
                    strokeWidth="0.6"
                    className="opacity-25"
                />
            );
        })}
        <defs>
            <radialGradient id="prayGlow">
                <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
        </defs>
    </svg>
);

export default function OracionPage() {
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Peticiones de Oración | MMM Chile",
        "description": "Comparte tu necesidad de oración con la iglesia. Nuestro equipo de intercesión estará orando por ti.",
        "url": "https://mmmchile.cl/oracion",
        "publisher": {
            "@type": "Organization",
            "name": "Movimiento Misionero Mundial Chile",
            "url": "https://mmmchile.cl"
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-warm-bg text-gray-800">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
            />
            {/* BREADCRUMB */}
            <div className="max-w-[1100px] mx-auto px-6 pt-[90px] pb-0">
                <Breadcrumb items={[{ label: 'Petición de Oración' }]} />
            </div>

            {/* HERO */}
            <section className="text-center pt-10 pb-10 px-6 relative overflow-hidden bg-gradient-to-b from-[#FDF8F0] via-[#F8EFE0] to-[#FDF8F0]" aria-label="Bienvenida a la sección de oración">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(212,168,67,0.1)_0%,transparent_60%)]" />
                <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.04] rounded-full animate-[spin_180s_linear_infinite]"
                    style={{ background: "conic-gradient(from 0deg, transparent 0deg, var(--color-accent) 1.5deg, transparent 3deg, transparent 20deg, var(--color-accent) 21.5deg, transparent 23deg, transparent 40deg, var(--color-accent) 41.5deg, transparent 43deg, transparent 60deg, var(--color-accent) 61.5deg, transparent 63deg, transparent 80deg, var(--color-accent) 81.5deg, transparent 83deg, transparent 100deg, var(--color-accent) 101.5deg, transparent 103deg, transparent 120deg, var(--color-accent) 121.5deg, transparent 123deg, transparent 140deg, var(--color-accent) 141.5deg, transparent 143deg, transparent 160deg, var(--color-accent) 161.5deg, transparent 163deg, transparent 180deg, var(--color-accent) 181.5deg, transparent 183deg, transparent 200deg, var(--color-accent) 201.5deg, transparent 203deg, transparent 220deg, var(--color-accent) 221.5deg, transparent 223deg, transparent 240deg, var(--color-accent) 241.5deg, transparent 243deg, transparent 260deg, var(--color-accent) 261.5deg, transparent 263deg, transparent 280deg, var(--color-accent) 281.5deg, transparent 283deg, transparent 300deg, var(--color-accent) 301.5deg, transparent 303deg, transparent 320deg, var(--color-accent) 321.5deg, transparent 323deg, transparent 340deg, var(--color-accent) 341.5deg, transparent 343deg)" }} />

                <div className="relative z-10 mb-2">
                    <HandsPraying />
                </div>
                <h1 className="font-serif text-[clamp(28px,5vw,44px)] text-primary leading-tight max-w-[600px] mx-auto mb-3 font-medium relative z-10">
                    No Estás Solo.<br />Estamos Orando por Ti.
                </h1>
                <p className="text-[clamp(15px,2vw,17px)] text-muted max-w-[480px] mx-auto leading-relaxed relative z-10">
                    Comparte tu necesidad y nuestro equipo de intercesión orará por ti esta semana.
                </p>
            </section>

            {/* MAIN CONTENT: FORM + SIDEBAR */}
            <main className="max-w-[1100px] mx-auto px-6 pb-[60px] pt-10 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 md:gap-10 items-start" aria-label="Formulario y recursos de oración">

                {/* FORM LEFT */}
                <PrayerForm />

                {/* SIDEBAR RIGHT */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-20 md:grid md:grid-cols-2 lg:flex" aria-label="Recursos y enlaces de fe">
                    <div className="md:col-span-2 lg:col-none">
                        <VerseCards />
                    </div>

                    <Link href="/conoce-a-jesus" className="block bg-white rounded-2xl p-6 border border-border border-l-4 border-l-accent transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] bg-gradient-to-br from-accent/5 to-white group" aria-label="¿Quieres conocer al Dios que escucha tus oraciones? Haz clic para conocer a Jesús">
                        <h3 className="font-serif text-[17px] text-primary font-medium mb-1.5">
                            ¿Quieres conocer al Dios que escucha tus oraciones?
                        </h3>
                        <p className="text-[13px] text-muted leading-relaxed mb-3">
                            Hay alguien que te ama profundamente y quiere tener una relación contigo.
                        </p>
                        <span className="inline-flex items-center gap-[5px] text-[13px] font-bold text-accent group-hover:gap-2.5 transition-all">
                            Conoce a Jesús <ArrowIco s={12} />
                        </span>
                    </Link>

                    <Link href="/iglesias" className="block bg-white rounded-2xl p-6 border border-border transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)] group" aria-label="¿Buscas una comunidad que ore contigo? Encuentra una iglesia cercana">
                        <h3 className="font-serif text-[17px] text-primary font-medium mb-1.5">
                            ¿Buscas una comunidad que ore contigo?
                        </h3>
                        <p className="text-[13px] text-muted leading-relaxed mb-3">
                            Encuentra una iglesia cercana donde serás recibido como familia.
                        </p>
                        <span className="inline-flex items-center gap-[5px] text-[13px] font-bold text-accent group-hover:gap-2.5 transition-all">
                            Encontrar iglesia <ArrowIco s={12} />
                        </span>
                    </Link>
                </aside>
            </main>

            {/* PRAYER WALL SERVER COMPONENT */}
            <PrayerWall />

            {/* BOTTOM CTA */}
            <section className="py-12 px-6 text-center relative bg-gradient-to-br from-accent-pale to-[#F0DDB8] overflow-hidden mt-auto" aria-label="Invitación a conocer a Jesús">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.5)_0%,transparent_60%)]" />
                <h3 className="font-serif text-[clamp(22px,3.5vw,30px)] text-primary mb-2 relative z-10">
                    El Dios que Escucha Tus Oraciones Quiere Conocerte
                </h3>
                <p className="text-[15px] text-[#5A5554] mb-6 relative z-10">
                    Si algo en tu corazón está buscando más, esta página es para ti.
                </p>
                <Link href="/conoce-a-jesus" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-primary-dark text-[15px] font-extrabold transition-all duration-200 shadow-[0_4px_16px_rgba(212,168,67,0.25)] hover:bg-accent-light hover:-translate-y-0.5 relative z-10" aria-label="Conoce a Jesús — más información">
                    Conoce a Jesús <ArrowIco />
                </Link>
            </section>

        </div>
    );
}
