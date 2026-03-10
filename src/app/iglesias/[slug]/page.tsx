import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SingleChurchMapWrapper from "@/components/church/SingleChurchMapWrapper";
import Link from "next/link";
import { MapPin, Navigation, MessageCircle, Clock } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import { GET_CHURCH_BY_SLUG_QUERY, GET_ALL_CHURCH_SLUGS_QUERY } from "@/lib/sanity/queries";
import type { Church } from "@/lib/types/church";
import Breadcrumb from "@/components/shared/Breadcrumb";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await sanityFetch<{ slug: string }[]>({
        query: GET_ALL_CHURCH_SLUGS_QUERY,
    });
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const church = await sanityFetch<Church>({
        query: GET_CHURCH_BY_SLUG_QUERY,
        params: { slug },
    });
    
    if (!church) return {};
    return {
        title: `${church.name} | Iglesia en ${church.city} | MMM Chile`,
        description: `Visita ${church.name} en ${church.address}, ${church.city}. Horarios de culto, contacto y cómo llegar. Movimiento Misionero Mundial Chile.`,
        openGraph: {
            title: `${church.name} — Iglesia en ${church.city}`,
            description: `Horarios, dirección y contacto de ${church.name} en ${church.city}.`,
            url: `https://mmmchile.cl/iglesias/${slug}`,
        },
        alternates: {
            canonical: `/iglesias/${slug}`,
        },
    };
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

const WA_MESSAGE = "Hola, busco una iglesia cerca de mi ubicación.";
const VISIT_MESSAGE = "Hola, me gustaría contactar a la congregación para una visita.";

export default async function ChurchSlugPage({ params }: Props) {
    const { slug } = await params;
    const church = await sanityFetch<Church>({
        query: GET_CHURCH_BY_SLUG_QUERY,
        params: { slug },
    });
    
    if (!church) notFound();

    const waUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(WA_MESSAGE)}`
        : null;
    const visitUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(VISIT_MESSAGE)}`
        : null;
    const mapsUrl =
        church.latitude != null && church.longitude != null
            ? `https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`
            : null;

    const pastorInitial = church.pastorName
        ? church.pastorName.split(" ").pop()?.[0] ?? "P"
        : "P";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["Church", "LocalBusiness"],
        name: church.name,
        description: `Congregación del Movimiento Misionero Mundial en ${church.city}, Chile.`,
        address: {
            "@type": "PostalAddress",
            streetAddress: church.address,
            addressLocality: church.city,
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
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-[#F8F6F0] pt-[70px]">
                {/* Breadcrumb */}
                <div className="max-w-4xl mx-auto px-6 pt-6">
                    <Breadcrumb
                        items={[
                            { label: 'Iglesias', href: '/iglesias' },
                            { label: church.city, href: `/iglesias/ciudad/${church.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}` },
                            { label: church.name },
                        ]}
                    />
                </div>

                {/* Map */}
                <div className="max-w-4xl mx-auto px-6 pt-4">
                    <div className="h-[280px] md:h-[360px] rounded-2xl overflow-hidden shadow-sm relative">
                        <SingleChurchMapWrapper church={church} />
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 py-8 grid md:grid-cols-[1fr_300px] gap-8">
                    {/* Left column */}
                    <div>
                        <h1 className="font-serif text-[clamp(26px,4vw,36px)] text-[#1E3A5F] mb-1 font-normal leading-tight">
                            {church.name}
                        </h1>
                        <p className="text-[#6B7280] text-[15px] mb-7">{church.city}, Chile</p>

                        {/* Address */}
                        <div className="mb-8">
                            <h2 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-3">
                                Dirección
                            </h2>
                            <div className="flex items-start gap-2 text-[15px] text-[#2D2D2D] mb-3">
                                <MapPin size={18} className="text-[#D4A843] shrink-0 mt-0.5" />
                                <span>{church.address}, {church.city}</span>
                            </div>
                            {mapsUrl && (
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold
                                               bg-[#1E3A5F] text-white no-underline hover:bg-[#2a5280] transition-colors"
                                >
                                    <Navigation size={14} /> Cómo llegar
                                </a>
                            )}
                        </div>

                        {/* Schedule table */}
                        {church.serviceSchedule && church.serviceSchedule.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-3">
                                    Horarios de Culto
                                </h2>
                                <table className="w-full border-collapse">
                                    <tbody>
                                        {church.serviceSchedule.map((s, i) => (
                                            <tr key={i} className="border-b border-[#E8E4DC] last:border-b-0">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-[#D4A843]" />
                                                        <span className="text-sm font-semibold text-[#1E3A5F]">{s.day}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-sm text-[#2D2D2D] font-medium">
                                                    {s.time} hrs
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pastor */}
                        {church.pastorName && (
                            <div className="mb-8">
                                <h2 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-3">
                                    Pastor
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2a5280]
                                                    flex items-center justify-center text-white font-serif text-lg">
                                        {pastorInitial}
                                    </div>
                                    <span className="text-[15px] font-semibold text-[#2D2D2D]">
                                        {church.pastorName}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* First visit */}
                        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6">
                            <h2 className="font-serif text-xl text-[#1E3A5F] mb-3">
                                ¿Qué esperar en tu primera visita?
                            </h2>
                            <p className="text-[15px] text-[#6B7280] leading-[1.8]">
                                No necesitas traer nada especial ni vestirte de una manera particular. Llegarás a un
                                lugar cálido donde serás recibido con una sonrisa. El culto dura aproximadamente una
                                hora e incluye música, un mensaje inspirador y un momento de oración. Nadie te
                                obligará a hacer nada que no quieras.{" "}
                                <strong className="text-[#1E3A5F]">Simplemente ven como eres</strong> — estamos
                                felices de recibirte.
                            </p>
                        </div>
                    </div>

                    {/* Right column — sticky action card */}
                    <div>
                        <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 sticky top-[90px]">
                            <h3 className="font-serif text-lg text-[#1E3A5F] mb-4">¿Listo para visitar?</h3>
                            {waUrl && (
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[10px]
                                               text-[15px] font-bold bg-[#25D366] text-white no-underline
                                               hover:bg-[#1ea952] transition-colors
                                               shadow-[0_4px_16px_rgba(37,211,102,0.2)] mb-2.5"
                                >
                                    <MessageCircle size={18} /> Contactar por WhatsApp
                                </a>
                            )}
                            {visitUrl && (
                                <a
                                    href={visitUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[10px]
                                               text-[15px] font-bold bg-[#D4A843] text-[#0F2035] no-underline
                                               hover:bg-[#e8c760] transition-colors
                                               shadow-[0_4px_16px_rgba(212,168,67,0.2)]"
                                >
                                    Quiero visitar este domingo
                                </a>
                            )}
                            <div className="mt-4 pt-4 border-t border-[#E8E4DC] text-center">
                                <Link
                                    href="/conoce-a-jesus"
                                    className="text-sm text-[#D4A843] font-semibold no-underline hover:underline"
                                >
                                    ¿Quieres conocer a Jesús? →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <section className="py-10 px-6 bg-gradient-to-br from-[#F5E6C4] to-[#F0DDB8] text-center mt-4">
                    <h3 className="font-serif text-[clamp(20px,3vw,28px)] text-[#1E3A5F] mb-2">
                        ¿Buscas otra iglesia cerca de ti?
                    </h3>
                    <p className="text-[15px] text-[#6B7280] mb-5">
                        Tenemos más de 30 congregaciones en todo Chile
                    </p>
                    <Link
                        href="/iglesias"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-bold
                                   bg-[#1E3A5F] text-white no-underline hover:bg-[#2a5280] transition-colors"
                    >
                        Ver todas las iglesias
                    </Link>
                </section>
            </main>
        </>
    );
}
