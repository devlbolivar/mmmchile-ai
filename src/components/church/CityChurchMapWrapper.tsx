"use client";

import dynamic from "next/dynamic";
import type { ChurchListItem } from "@/lib/types/church";

const CityChurchMap = dynamic(() => import("./CityChurchMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#E8E4DC] flex items-center justify-center">
            <div className="text-sm text-[#6B7280] animate-pulse">Cargando mapa...</div>
        </div>
    ),
});

interface Props {
    churches: ChurchListItem[];
}

export default function CityChurchMapWrapper({ churches }: Props) {
    return <CityChurchMap churches={churches} />;
}
