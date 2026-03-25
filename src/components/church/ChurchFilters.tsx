"use client";

import { Search, X } from "lucide-react";

interface ChurchFiltersProps {
    search: string;
    zone: string;
    onSearchChange: (value: string) => void;
    onZoneChange: (zone: string) => void;
    resultCount: number;
    hasLocation: boolean;
}

const ZONE_PILLS: { label: string; value: string }[] = [
    { label: "Todas", value: "todas" },
    { label: "Zona Norte", value: "norte" },
    { label: "Zona Centro-Norte", value: "centro-norte" },
    { label: "Zona Centro", value: "centro" },
    { label: "Zona Centro-Sur", value: "centro-sur" },
    { label: "Zona Sur", value: "sur" },
];

export default function ChurchFilters({
    search,
    zone,
    onSearchChange,
    onZoneChange,
    resultCount,
    hasLocation,
}: ChurchFiltersProps) {
    return (
        <div>
            {/* Search input */}
            <div
                className="flex items-center gap-2.5 bg-white border-[1.5px] border-[#E8E4DC] rounded-[10px]
                    px-3.5 transition-colors focus-within:border-[#D4A843]"
            >
                <Search size={20} className="text-[#B0A99E] shrink-0" />
                <input
                    type="text"
                    placeholder="Busca por ciudad, comuna o dirección"
                    aria-label="Busca por ciudad, comuna o dirección"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="flex-1 border-none outline-none text-[15px] py-[13px] bg-transparent text-[#2C2C2C]
                     placeholder:text-[#B0A99E] font-sans"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange("")}
                        className="p-1 bg-transparent border-none cursor-pointer text-[#6B7280]"
                        aria-label="Limpiar búsqueda"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Zone pills */}
            <div className="flex gap-2 flex-wrap pt-3.5 pb-5">
                {ZONE_PILLS.map((pill) => (
                    <button
                        key={pill.value}
                        onClick={() => onZoneChange(pill.value)}
                        className={`
              px-4 py-2 rounded-[20px] text-[13px] font-semibold border-[1.5px] cursor-pointer
              whitespace-nowrap transition-all duration-200 font-sans
              ${zone === pill.value
                                ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                                : "bg-white text-[#6B7280] border-[#E8E4DC] hover:border-[#D4A843] hover:text-[#1E3A5F]"
                            }
            `}
                    >
                        {pill.label}
                    </button>
                ))}
            </div>

            {/* Result count */}
            <p className="text-[13px] text-[#6B7280] font-medium pb-3">
                <strong className="text-[#1E3A5F]">{resultCount}</strong>{" "}
                iglesia{resultCount !== 1 ? "s" : ""} encontrada{resultCount !== 1 ? "s" : ""}
                {hasLocation && " · ordenadas por cercanía"}
            </p>
        </div>
    );
}
