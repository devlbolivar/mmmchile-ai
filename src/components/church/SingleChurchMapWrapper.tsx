"use client";

import dynamic from "next/dynamic";
import type { ChurchListItem } from "@/lib/types/church";

const SingleChurchMap = dynamic(() => import("./SingleChurchMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#E8E4DC] flex items-center justify-center">
            <div className="text-sm text-[#6B7280] animate-pulse">Cargando mapa...</div>
        </div>
    ),
});

interface Props {
    church: ChurchListItem;
}

export default function SingleChurchMapWrapper({ church }: Props) {
    return <SingleChurchMap church={church} />;
}
