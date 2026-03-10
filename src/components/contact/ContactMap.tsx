"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Dynamic import for Leaflet map to prevent SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface ContactMapProps {
    // Sede central Santiago
    latitude?: number;
    longitude?: number;
    address?: string;
}

export default function ContactMap({
    latitude = -33.4707141310025,
    longitude = -70.64568537291355,
    address = "General Gana 924, Santiago, Chile"
}: ContactMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [L, setL] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
        // Dynamically import Leaflet only on the client side
        import('leaflet').then((leaflet) => {
            // Fix Leaflet's default icon path issues
            delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
            leaflet.Icon.Default.mergeOptions({
                iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || '/images/marker-icon-2x.png',
                iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || '/images/marker-icon.png',
                shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || '/images/marker-shadow.png',
            });
            setL(leaflet);
        });
    }, []);

    const customIcon = L ? new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }) : null;

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="font-serif text-2xl text-primary font-semibold">Templo Central</h2>
                    <p className="text-muted text-sm mt-1">{address}</p>
                </div>
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-[#2a5280] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                    <Navigation className="w-4 h-4" />
                    Cómo llegar
                </a>
            </div>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-sm relative z-0">
                {!isMounted || !L ? (
                    <div className="w-full h-full bg-[#e8edf2] flex flex-col items-center justify-center animate-pulse">
                        <MapPin className="w-8 h-8 text-primary/40 mb-2" />
                        <span className="text-sm font-medium text-primary/60">Cargando mapa...</span>
                    </div>
                ) : (
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={15}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        {customIcon && (
                            <Marker position={[latitude, longitude]} icon={customIcon}>
                                <Popup>
                                    <div className="font-sans">
                                        <strong className="font-semibold text-primary block mb-1">Templo Central - Sede Nacional</strong>
                                        <span className="text-sm text-muted">{address}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}
