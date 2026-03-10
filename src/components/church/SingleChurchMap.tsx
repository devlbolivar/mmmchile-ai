"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { ChurchListItem } from "@/lib/types/church";

const churchIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
  <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#1E3A5F"/>
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

interface SingleChurchMapProps {
    church: ChurchListItem;
}

export default function SingleChurchMap({ church }: SingleChurchMapProps) {
    if (church.latitude == null || church.longitude == null) return null;

    const center: [number, number] = [church.latitude, church.longitude];
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`;

    return (
        <MapContainer
            center={center}
            zoom={15}
            zoomControl={true}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center} icon={churchIcon}>
                <Popup>
                    <div style={{ minWidth: 180, fontFamily: "sans-serif" }}>
                        <strong style={{ color: "#1E3A5F", display: "block", marginBottom: 4 }}>
                            {church.name}
                        </strong>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>{church.address}</span>
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#1E3A5F", marginTop: 8, display: "block" }}
                        >
                            Abrir en Google Maps →
                        </a>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
}
