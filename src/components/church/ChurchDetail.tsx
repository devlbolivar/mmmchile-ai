"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, MapPin, Navigation, MessageCircle, ChevronDown } from "lucide-react";
import type { ChurchListItem } from "@/lib/types/church";

const WA_MESSAGE = "Hola, me gustaría visitar la iglesia. ¿Podrían darme más información?";
const VISIT_MESSAGE = "Hola, quiero visitar la iglesia este domingo. ¿Pueden orientarme?";

interface ChurchDetailProps {
    church: ChurchListItem;
    onClose: () => void;
}

export default function ChurchDetail({ church, onClose }: ChurchDetailProps) {
    const [fvOpen, setFvOpen] = useState(false);

    // Prevent body scroll when panel is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const waUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(WA_MESSAGE)}`
        : null;
    const visitUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(VISIT_MESSAGE)}`
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
            <div className="fixed top-0 right-0 bottom-0 z-[210] w-[460px] max-w-full bg-[#F8F6F0] overflow-y-auto shadow-[-8px_0_40px_rgba(0,0,0,0.12)] animate-[slideIn_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                {/* Header */}
                <div className="sticky top-0 z-[5] bg-[rgba(248,246,240,0.95)] backdrop-blur-[10px] px-6 py-4 flex items-center justify-between border-b border-[#E8E4DC]">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] bg-transparent border-none cursor-pointer hover:text-[#1E3A5F] transition-colors"
                    >
                        <ChevronLeft size={16} /> Volver
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 bg-transparent border-none cursor-pointer text-[#6B7280] hover:text-[#1E3A5F] transition-colors"
                        aria-label="Cerrar"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Map placeholder */}
                    <div className="h-[200px] rounded-xl overflow-hidden mb-6 bg-[#E8E4DC] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <MapPin size={32} className="text-[#D4A843]" />
                            <span className="text-xs text-[#6B7280] font-semibold">{church.city}</span>
                        </div>
                    </div>

                    {/* Name */}
                    <h2 className="font-serif text-2xl text-[#1E3A5F] mb-1">{church.name}</h2>
                    <p className="text-sm text-[#6B7280] mb-5">{church.city}</p>

                    {/* Address */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-2.5">
                            Dirección
                        </h3>
                        <div className="text-[15px] text-[#2C2C2C] leading-[1.5] mb-3 flex items-start gap-2">
                            <MapPin size={18} className="text-[#D4A843] shrink-0 mt-0.5" />
                            <span>
                                {church.address}, {church.city}
                            </span>
                        </div>
                        {mapsUrl && (
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-[18px] py-2.5 rounded-lg text-[13px] font-bold
                           bg-[#1E3A5F] text-white no-underline hover:bg-[#2a5280] hover:-translate-y-px
                           transition-all"
                            >
                                <Navigation size={14} /> Abrir en Google Maps
                            </a>
                        )}
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
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-[#6B7280] tracking-[1px] uppercase mb-2.5">
                                Pastor
                            </h3>
                            <div className="text-[15px] text-[#2C2C2C] flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2a5280] flex items-center justify-center text-white font-serif text-base">
                                    {pastorInitial}
                                </div>
                                <span className="font-semibold">{church.pastorName}</span>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mb-6">
                        {waUrl && (
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[10px] text-[15px]
                           font-bold bg-[#25D366] text-white no-underline hover:bg-[#1ea952]
                           hover:-translate-y-px transition-all shadow-[0_4px_16px_rgba(37,211,102,0.25)]"
                            >
                                <MessageCircle size={18} /> Contactar por WhatsApp
                            </a>
                        )}
                        {visitUrl && (
                            <a
                                href={visitUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[10px] text-[15px]
                           font-bold bg-[#D4A843] text-[#0F2035] no-underline hover:bg-[#E8C976]
                           hover:-translate-y-px transition-all shadow-[0_4px_16px_rgba(212,168,67,0.25)]
                           mt-2.5"
                            >
                                Quiero visitar este domingo
                            </a>
                        )}
                    </div>

                    {/* First visit collapsible */}
                    <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
                        <button
                            onClick={() => setFvOpen(!fvOpen)}
                            className="w-full px-5 py-4 bg-transparent border-none flex items-center justify-between
                         text-sm font-semibold text-[#1E3A5F] cursor-pointer font-[var(--font-karla)]"
                        >
                            ¿Qué esperar en tu primera visita?
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${fvOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-[max-height] duration-400 ${fvOpen ? "max-h-[400px]" : "max-h-0"}`}
                        >
                            <div className="px-5 pb-5 text-sm text-[#6B7280] leading-[1.7]">
                                No necesitas traer nada especial ni vestirte de una manera particular. Llegarás a un
                                lugar cálido donde serás recibido con una sonrisa. El culto dura aproximadamente una
                                hora e incluye música, un mensaje inspirador y un momento de oración. Nadie te
                                obligará a hacer nada que no quieras. Simplemente ven como eres — estamos felices de
                                recibirte.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `,
            }} />
        </>
    );
}
