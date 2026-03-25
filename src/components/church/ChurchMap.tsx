"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { ChurchListItem, Coordinates } from "@/lib/types/church";

// ── Custom church marker icon (blue pin with cross) ──
const churchIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#1E3A5F"/>
  <line x1="14" y1="8" x2="14" y2="20" stroke="white" stroke-width="2"/>
  <line x1="9" y1="13" x2="19" y2="13" stroke="white" stroke-width="2"/>
</svg>`;

const selectedIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="44" viewBox="0 0 28 38">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#D4A843"/>
  <line x1="14" y1="8" x2="14" y2="20" stroke="white" stroke-width="2"/>
  <line x1="9" y1="13" x2="19" y2="13" stroke="white" stroke-width="2"/>
</svg>`;

const churchIcon = L.divIcon({
    html: churchIconSvg,
    className: "",
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
});

const selectedIcon = L.divIcon({
    html: selectedIconSvg,
    className: "",
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -44],
});

const userIcon = L.divIcon({
    html: `<div style="width:16px;height:16px;border-radius:50%;background:#3B82F6;border:3px solid white;box-shadow:0 0 0 2px rgba(59,130,246,0.4),0 0 12px rgba(59,130,246,0.3)"></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

// ── Map recenterer ──
function MapCenterUpdater({
    center,
    zoom,
}: {
    center: [number, number];
    zoom: number;
}) {
    const map = useMap();
    const prevCenter = useRef(center);

    useEffect(() => {
        if (
            prevCenter.current[0] !== center[0] ||
            prevCenter.current[1] !== center[1]
        ) {
            map.flyTo(center, zoom, { duration: 1.2 });
            prevCenter.current = center;
        }
    }, [center, zoom, map]);

    return null;
}

// ── Invalidate size on mount and whenever the map becomes visible ──
function InvalidateSize({ isVisible }: { isVisible: boolean }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => map.invalidateSize(), 200);
        return () => clearTimeout(timer);
    }, [map]);
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => map.invalidateSize(), 50);
            return () => clearTimeout(timer);
        }
    }, [isVisible, map]);
    return null;
}

// ── WhatsApp message ──
const WA_MESSAGE = "Hola, me gustaría visitar la iglesia. ¿Podrían darme más información?";

interface ChurchMapProps {
    churches: ChurchListItem[];
    selectedId: string | null;
    userLocation: Coordinates | null;
    onSelect: (id: string) => void;
    isVisible?: boolean;
}

export default function ChurchMap({
    churches,
    selectedId,
    userLocation,
    onSelect,
    isVisible = true,
}: ChurchMapProps) {
    const defaultCenter: [number, number] = [-33.45, -70.65];
    const center: [number, number] = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : defaultCenter;
    const zoom = userLocation ? 12 : 5;

    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <MapContainer
                center={center}
                zoom={zoom}
                zoomControl={true}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenterUpdater center={center} zoom={zoom} />
                <InvalidateSize isVisible={isVisible} />

                {/* User location marker */}
                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={userIcon}
                    />
                )}

                {/* Church markers */}
                {churches.map((church) => {
                    if (church.latitude == null || church.longitude == null) return null;
                    const isSelected = church._id === selectedId;
                    const waUrl = church.whatsapp
                        ? `https://wa.me/${church.whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(WA_MESSAGE)}`
                        : null;
                    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`;

                    return (
                        <Marker
                            key={church._id}
                            position={[church.latitude, church.longitude]}
                            icon={isSelected ? selectedIcon : churchIcon}
                            eventHandlers={{
                                click: () => onSelect(church._id),
                            }}
                        >
                            <Popup>
                                <div className="font-sans min-w-[200px]">
                                    <h4 className="text-sm font-bold text-[#1E3A5F] mb-1">{church.name}</h4>
                                    <p className="text-xs text-[#6B7280] mb-2.5 leading-[1.4]">
                                        {church.address}, {church.city}
                                    </p>
                                    <div className="flex gap-1.5">
                                        <a
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-[7px] rounded-md
                               text-[11px] font-bold bg-[#1E3A5F] text-white no-underline
                               hover:bg-[#2a5280] transition-colors"
                                        >
                                            Cómo llegar
                                        </a>
                                        {waUrl && (
                                            <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 flex items-center justify-center gap-1 px-2 py-[7px] rounded-md
                                 text-[11px] font-bold bg-[#25D366] text-white no-underline
                                 hover:bg-[#1ea952] transition-colors"
                                            >
                                                WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
