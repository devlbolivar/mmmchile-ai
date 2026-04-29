"use client";

import { useEffect } from "react";
import { X, ChevronLeft, MapPin, Navigation, MessageCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ChurchListItem } from "@/lib/types/church";
import SingleChurchMapWrapper from "./SingleChurchMapWrapper";
import { urlForImage } from "@/lib/sanity/image";

const WA_MESSAGE = "Hola, me gustaría visitar la iglesia. ¿Podrían darme más información?";

interface ChurchDetailProps {
    church: ChurchListItem;
    onClose: () => void;
}

export default function ChurchDetail({ church, onClose }: ChurchDetailProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const waUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(WA_MESSAGE)}`
        : null;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.address}, ${church.city}, Chile`)}`;

    const pastorInitial = church.pastorName
        ? church.pastorName.split(" ").pop()?.[0] ?? "P"
        : "P";

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[200] bg-[rgba(15,32,53,0.45)] backdrop-blur-[4px] animate-[fadeIn_0.25s_ease]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 bottom-0 z-[210] w-[460px] max-w-full bg-[#F8F6F0]
                            shadow-[-8px_0_40px_rgba(0,0,0,0.12)] animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]
                            flex flex-col">

                {/* ── Sticky header ── */}
                <div className="shrink-0 bg-[rgba(248,246,240,0.95)] backdrop-blur-[10px] px-5 py-3.5
                                flex items-center justify-between border-b border-[#E8E4DC]">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7280]
                                   bg-transparent border-none cursor-pointer hover:text-[#1E3A5F] transition-colors"
                    >
                        <ChevronLeft size={16} /> Volver
                    </button>

                    <div className="flex-1 px-4 min-w-0">
                        <p className="text-[13px] font-bold text-[#1E3A5F] truncate text-center leading-tight">
                            {church.name}
                        </p>
                        <p className="text-[11px] text-[#6B7280] text-center">{church.city}</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1 bg-transparent border-none cursor-pointer text-[#6B7280]
                                   hover:text-[#1E3A5F] transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {/* Cover: photo if available, map as fallback */}
                    <div className="h-[220px] relative">
                        {church.photos && church.photos.length > 0 ? (
                            <Image
                                src={urlForImage(church.photos[0]).width(920).height(440).url()}
                                alt={church.name}
                                fill
                                className="object-cover"
                                sizes="460px"
                            />
                        ) : (
                            <SingleChurchMapWrapper church={church} />
                        )}
                    </div>

                    <div className="p-6">
                        {/* Address */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-2.5">
                                Dirección
                            </h3>
                            <div className="text-[15px] text-[#2C2C2C] leading-[1.5] mb-3 flex items-start gap-2">
                                <MapPin size={18} className="text-[#D4A843] shrink-0 mt-0.5" />
                                <span>{church.address}, {church.city}</span>
                            </div>
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-lg text-[13px]
                                           font-bold bg-[#1E3A5F] text-white no-underline hover:bg-[#2a5280]
                                           hover:-translate-y-px transition-all"
                            >
                                <Navigation size={14} /> Cómo llegar
                            </a>
                        </div>

                        {/* Schedule */}
                        {church.serviceSchedule && church.serviceSchedule.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-2.5">
                                    Horarios de Culto
                                </h3>
                                <div>
                                    {church.serviceSchedule.map((s, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center py-2.5 border-b border-[#E8E4DC] last:border-b-0"
                                        >
                                            <span className="flex-1 text-sm font-semibold text-[#1E3A5F]">{s.day}</span>
                                            <span className="text-sm text-[#2C2C2C] font-medium">{s.time} hrs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pastor */}
                        {church.pastorName && (
                            <div className="mb-2">
                                <h3 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-2.5">
                                    Pastor
                                </h3>
                                <div className="text-[15px] text-[#2C2C2C] flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2a5280]
                                                    flex items-center justify-center text-white font-serif text-base shrink-0">
                                        {pastorInitial}
                                    </div>
                                    <span className="font-semibold">{church.pastorName}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Sticky footer CTAs ── */}
                <div className="shrink-0 border-t border-[#E8E4DC] bg-[#F8F6F0] p-4 flex gap-2">
                    {waUrl && (
                        <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px]
                                       text-[14px] font-bold bg-[#25D366] text-white no-underline
                                       hover:bg-[#1ea952] transition-colors
                                       shadow-[0_4px_16px_rgba(37,211,102,0.2)]"
                        >
                            <MessageCircle size={17} /> WhatsApp
                        </a>
                    )}
                    <Link
                        href={`/iglesias/${church.slug}`}
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px]
                                   text-[14px] font-bold bg-[#1E3A5F] text-white no-underline
                                   hover:bg-[#2a5280] transition-colors
                                   shadow-[0_4px_16px_rgba(30,58,95,0.2)]"
                    >
                        <ExternalLink size={16} /> Ver página
                    </Link>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
                `,
            }} />
        </>
    );
}
