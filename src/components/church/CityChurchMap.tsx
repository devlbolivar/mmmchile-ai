"use client";

import ChurchMap from "@/components/church/ChurchMap";
import type { ChurchListItem } from "@/lib/types/church";

interface CityChurchMapProps {
    churches: ChurchListItem[];
}

// Thin client wrapper so the city page (server component) can pass
// serializable props without providing a non-serializable onSelect callback.
export default function CityChurchMap({ churches }: CityChurchMapProps) {
    return (
        <ChurchMap
            churches={churches}
            selectedId={null}
            userLocation={null}
            onSelect={() => {}}
        />
    );
}
