import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CityChurchMapWrapper from "@/components/church/CityChurchMapWrapper";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Navigation } from "lucide-react";
import { churchesSeed } from "@/lib/data/churches-seed";
import Breadcrumb from "@/components/shared/Breadcrumb";
function normalizeCity(city: string): string {
    return city
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}

function dayToSchemaOrg(day: string): string {
    const map: Record<string, string> = {
        Domingo: "Sunday",
        Lunes: "Monday",
        Martes: "Tuesday",
        "Miércoles": "Wednesday",
        Jueves: "Thursday",
        Viernes: "Friday",
        "Sábado": "Saturday",
    };
    return `https://schema.org/${map[day] ?? day}`;
}

interface Props {
    params: Promise<{ ciudad: string }>;
}

export function generateStaticParams() {
    const cities = [...new Set(churchesSeed.map((c) => c.city))];
    return cities.map((city) => ({ ciudad: normalizeCity(city) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ciudad } = await params;
    const cityChurches = churchesSeed.filter((c) => normalizeCity(c.city) === ciudad);
    if (cityChurches.length === 0) return {};
    const cityName = cityChurches[0].city;
    return {
        title: `Iglesia Cristiana en ${cityName} | MMM Chile`,
        description: `Encuentra iglesias del Movimiento Misionero Mundial en ${cityName}, Chile. Horarios de culto, dirección y contacto de cada congregación.`,
        openGraph: {
            title: `Iglesia Cristiana en ${cityName} | MMM Chile`,
            description: `Congregaciones del Movimiento Misionero Mundial en ${cityName}, Chile.`,
            url: `https://mmmchile.cl/iglesias/ciudad/${ciudad}`,
        },
        alternates: {
            canonical: `/iglesias/ciudad/${ciudad}`,
        },
    };
}

export default async function CiudadPage({ params }: Props) {
    const { ciudad } = await params;
    const cityChurches = churchesSeed.filter((c) => normalizeCity(c.city) === ciudad);
    if (cityChurches.length === 0) notFound();

    const cityName = cityChurches[0].city;

    const jsonLd = cityChurches.map((church) => ({
        "@context": "https://schema.org",
        "@type": ["Church", "LocalBusiness"],
        name: church.name,
        description: `Congregación del Movimiento Misionero Mundial en ${cityName}, Chile.`,
        address: {
            "@type": "PostalAddress",
            streetAddress: church.address,
            addressLocality: cityName,
            addressCountry: "CL",
        },
        ...(church.latitude && church.longitude
            ? { geo: { "@type": "GeoCoordinates", latitude: church.latitude, longitude: church.longitude } }
            : {}),
        ...(church.phone ? { telephone: church.phone } : {}),
        url: `https://mmmchile.cl/iglesias/${church.slug}`,
        ...(church.serviceSchedule?.length
            ? {
                openingHoursSpecification: church.serviceSchedule.map((s) => ({
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: dayToSchemaOrg(s.day),
                    opens: s.time,
                    closes: s.time,
                })),
            }
            : {}),
    }));

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-[#F8F6F0] pt-[70px]">
                {/* Hero */}
                <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb
                            items={[
                                { label: 'Iglesias', href: '/iglesias' },
                                { label: cityName },
                            ]}
                        />
                    </div>

                    <p className="text-sm font-bold text-[#D4A843] uppercase tracking-wider mb-2">
                        Movimiento Misionero Mundial
                    </p>
                    <h1 className="font-serif text-[clamp(28px,4vw,44px)] text-[#1E3A5F] mb-3 font-normal leading-tight">
                        Iglesia Cristiana en {cityName}
                    </h1>
                    <p className="text-[16px] text-[#6B7280] leading-[1.6] max-w-2xl">
                        {cityChurches.length > 1
                            ? `Encontramos ${cityChurches.length} congregaciones del Movimiento Misionero Mundial en ${cityName}. Todas te esperan con los brazos abiertos.`
                            : `La iglesia del Movimiento Misionero Mundial en ${cityName} te espera con los brazos abiertos.`}
                    </p>
                </div>

                {/* Map */}
                <div className="max-w-5xl mx-auto px-6 pb-10">
                    <div className="h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm relative">
                        <CityChurchMapWrapper churches={cityChurches} />
                    </div>
                </div>

                {/* Churches list */}
                <div className="max-w-5xl mx-auto px-6 pb-14">
                    <h2 className="font-serif text-2xl text-[#1E3A5F] mb-6">
                        {cityChurches.length > 1 ? "Congregaciones en " + cityName : "Nuestra Iglesia"}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-5">
                        {cityChurches.map((church) => {
                            const waUrl = church.whatsapp
                                ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, me gustaría información sobre la iglesia.")}`
                                : null;
                            const mapsUrl =
                                church.latitude && church.longitude
                                    ? `https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`
                                    : null;
                            return (
                                <div
                                    key={church._id}
                                    className="bg-white rounded-2xl border border-[#E8E4DC] p-5 flex flex-col"
                                >
                                    <h3 className="font-serif text-lg text-[#1E3A5F] mb-1">{church.name}</h3>

                                    {church.address && (
                                        <div className="flex items-start gap-1.5 text-sm text-[#6B7280] mb-3">
                                            <MapPin size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                                            <span>{church.address}</span>
                                        </div>
                                    )}

                                    {church.serviceSchedule && church.serviceSchedule.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-[#6B7280] tracking-wider uppercase mb-2">
                                                Horarios
                                            </p>
                                            <div className="space-y-1">
                                                {church.serviceSchedule.map((s, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm">
                                                        <Clock size={12} className="text-[#D4A843] shrink-0" />
                                                        <span className="font-semibold text-[#1E3A5F]">{s.day}</span>
                                                        <span className="text-[#6B7280]">{s.time} hrs</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {church.pastorName && (
                                        <p className="text-sm text-[#6B7280] mb-4">
                                            Pastor:{" "}
                                            <span className="font-semibold text-[#2D2D2D]">{church.pastorName}</span>
                                        </p>
                                    )}

                                    <div className="flex gap-2 mt-auto">
                                        <Link
                                            href={`/iglesias/${church.slug}`}
                                            className="flex-1 flex items-center justify-center py-2.5 rounded-lg
                                                       text-sm font-bold bg-[#1E3A5F] text-white no-underline
                                                       hover:bg-[#2a5280] transition-colors text-center"
                                        >
                                            Ver ficha
                                        </Link>
                                        {waUrl && (
                                            <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Contactar por WhatsApp"
                                                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg
                                                           text-sm font-bold bg-[#25D366] text-white no-underline
                                                           hover:bg-[#1ea952] transition-colors"
                                            >
                                                <MessageCircle size={14} />
                                            </a>
                                        )}
                                        {mapsUrl && (
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Cómo llegar"
                                                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg
                                                           text-sm font-bold bg-[#E8E4DC] text-[#1E3A5F] no-underline
                                                           hover:bg-[#DDD9D1] transition-colors"
                                            >
                                                <Navigation size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Informative section */}
                <section className="bg-white border-t border-[#E8E4DC] py-14 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-2xl text-[#1E3A5F] mb-5">
                            El Movimiento Misionero Mundial en {cityName}
                        </h2>
                        <div className="text-[15px] text-[#6B7280] leading-[1.9] space-y-4">
                            <p>
                                El{" "}
                                <strong className="text-[#2D2D2D]">
                                    Movimiento Misionero Mundial (MMM)
                                </strong>{" "}
                                está presente en {cityName} con una comunidad de fe que se reúne para adorar, crecer
                                espiritualmente y servir a la comunidad local. Nuestras iglesias son lugares de
                                bienvenida para cualquier persona, sin importar su trasfondo o historia.
                            </p>
                            <p>
                                Cada domingo celebramos cultos donde encuentras música de adoración en vivo, mensajes
                                bíblicos prácticos para la vida diaria, y una comunidad que se apoya mutuamente.
                                También tenemos reuniones entre semana para quienes desean profundizar en su fe.
                            </p>
                            <p>
                                Si estás buscando un nuevo comienzo, atravesando un momento difícil, o simplemente
                                tienes curiosidad sobre la fe cristiana, te invitamos a visitarnos.{" "}
                                <strong className="text-[#1E3A5F]">
                                    La entrada es libre y siempre hay un lugar para ti.
                                </strong>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-10 px-6 bg-gradient-to-br from-[#F5E6C4] to-[#F0DDB8] text-center">
                    <h3 className="font-serif text-[clamp(20px,3vw,28px)] text-[#1E3A5F] mb-2">
                        ¿Quieres conocer más?
                    </h3>
                    <p className="text-[15px] text-[#6B7280] mb-5">
                        Escríbenos y te ayudamos a dar tu primer paso
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <Link
                            href="/conoce-a-jesus"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-[15px]
                                       font-bold bg-[#1E3A5F] text-white no-underline hover:bg-[#2a5280]
                                       transition-colors"
                        >
                            Conoce a Jesús
                        </Link>
                        <Link
                            href="/iglesias"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] text-[15px]
                                       font-semibold bg-white text-[#1E3A5F] border border-[#E8E4DC]
                                       no-underline hover:border-[#D4A843] transition-colors"
                        >
                            Ver todas las iglesias
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
