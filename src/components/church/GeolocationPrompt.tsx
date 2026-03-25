"use client";

import { useState } from "react";
import { Crosshair, Loader2 } from "lucide-react";
import { getCurrentPosition } from "@/lib/utils/geolocation";
import type { Coordinates } from "@/lib/types/church";
import { trackEvent } from '@/lib/analytics';

interface GeolocationPromptProps {
    userLocation: Coordinates | null;
    onLocationChange: (coords: Coordinates | null) => void;
}

export default function GeolocationPrompt({ userLocation, onLocationChange }: GeolocationPromptProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (userLocation) {
            onLocationChange(null);
            return;
        }

        setLoading(true);
        try {
            const coords = await getCurrentPosition();
            trackEvent('usar_ubicacion', { source: 'geolocation_prompt' });
            onLocationChange(coords);
        } catch {
            // Fallback: Santiago
            onLocationChange({ latitude: -33.445, longitude: -70.66 });
        } finally {
            setLoading(false);
        }
    };

    const isActive = !!userLocation;

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`
        flex items-center gap-[7px] px-4 py-3 border-[1.5px] rounded-[10px]
        text-[13px] font-semibold cursor-pointer whitespace-nowrap transition-all duration-200
        font-sans
        ${isActive
                    ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                    : "bg-white text-[#1E3A5F] border-[#E8E4DC] hover:border-[#D4A843] hover:text-[#D4A843]"
                }
        disabled:opacity-60 disabled:cursor-wait
      `}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Crosshair size={18} />
            )}
            <span className="max-[500px]:inline">
                {loading ? "Buscando..." : isActive ? "Ubicación activa" : "Usar mi ubicación"}
            </span>
        </button>
    );
}
