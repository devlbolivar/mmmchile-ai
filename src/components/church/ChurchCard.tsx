"use client";

import { MapPin, Clock, MessageCircle, ChevronRight } from "lucide-react";
import type { ChurchListItem } from "@/lib/types/church";
import { getNextService, formatDistance } from "@/lib/data/churches-seed";
import { trackEvent } from '@/lib/analytics';

interface ChurchCardProps {
    church: ChurchListItem & { distance?: number };
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDetail: (church: ChurchListItem) => void;
}

const WA_MESSAGE = "Hola, me gustaría visitar la iglesia. ¿Podrían darme más información?";

export default function ChurchCard({ church, isSelected, onSelect, onDetail }: ChurchCardProps) {
    const nextService = church.serviceSchedule ? getNextService(church.serviceSchedule) : undefined;
    const waUrl = church.whatsapp
        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(WA_MESSAGE)}`
        : undefined;

    return (
        <div
            onClick={() => {
                trackEvent('ver_detalle_iglesia', { church_id: church._id, church_name: church.name, source: 'church_list' });
                onSelect(church._id);
            }}
            className={`
        relative p-[18px_20px] rounded-xl cursor-pointer border mb-2 bg-white
        transition-all duration-250
        ${isSelected
                    ? "border-[#D4A843] border-l-[3px] bg-[#FDFCF9]"
                    : "border-transparent hover:border-[#E8E4DC] hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                }
      `}
        >
            {/* Distance badge */}
            {church.distance != null && church.distance !== Infinity && (
                <span className="absolute top-[18px] right-5 text-xs font-bold text-[#D4A843] bg-[rgba(212,168,67,0.1)] px-2.5 py-[3px] rounded-xl">
                    {formatDistance(church.distance)}
                </span>
            )}

            <h3 className="font-bold text-[15px] text-[#1E3A5F] mb-[2px]">{church.name}</h3>

            <p className="text-[13px] text-[#6B7280] mb-1.5">{church.city}</p>

            {church.address && (
                <p className="text-[13px] text-[#6B7280] flex items-center gap-1 mb-2">
                    <MapPin size={13} className="shrink-0 text-[#6B7280]" />
                    {church.address}
                </p>
            )}

            {nextService && (
                <p className="flex items-center gap-[5px] text-[13px] text-[#1E3A5F] font-medium">
                    <Clock size={14} className="shrink-0" />
                    Próximo culto: {nextService.day} {nextService.time} hrs
                </p>
            )}

            <div className="flex gap-2 mt-2.5">
                {waUrl && (
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-[5px] px-3.5 py-[7px] rounded-lg text-xs font-semibold
                       bg-[rgba(37,211,102,0.1)] text-[#1a9e4a] hover:bg-[rgba(37,211,102,0.2)] transition-colors"
                    >
                        <MessageCircle size={14} />
                        WhatsApp
                    </a>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('ver_detalle_iglesia_button', { church_id: church._id, church_name: church.name });
                        onDetail(church);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-[7px] rounded-lg text-xs font-semibold
                     bg-[rgba(30,58,95,0.06)] text-[#1E3A5F] hover:bg-[rgba(30,58,95,0.12)]
                     transition-colors border-none cursor-pointer font-sans"
                >
                    Ver detalles <ChevronRight size={12} />
                </button>
            </div>
        </div>
    );
}
