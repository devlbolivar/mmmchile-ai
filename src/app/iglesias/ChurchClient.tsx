"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { List, Map as MapIcon, MessageCircle, Play } from "lucide-react";
import { calculateDistance } from "@/lib/utils/geolocation";
import type { ChurchListItem, Coordinates } from "@/lib/types/church";
import ChurchCard from "@/components/church/ChurchCard";
import ChurchFilters from "@/components/church/ChurchFilters";
import GeolocationPrompt from "@/components/church/GeolocationPrompt";
import ChurchDetail from "@/components/church/ChurchDetail";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { trackEvent } from '@/lib/analytics';

const ChurchMap = dynamic(() => import("@/components/church/ChurchMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[#E8E4DC] rounded-l-2xl flex items-center justify-center">
            <div className="text-sm text-[#6B7280] font-medium animate-pulse">Cargando mapa...</div>
        </div>
    ),
});

const WA_GENERAL = "Hola, me gustaría encontrar una iglesia cerca de mi ubicación";

interface ChurchClientProps {
    initialChurches: ChurchListItem[];
}

export default function ChurchClient({ initialChurches }: ChurchClientProps) {
    const [search, setSearch] = useState("");
    const [zone, setZone] = useState("todas");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detailChurch, setDetailChurch] = useState<ChurchListItem | null>(null);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [mobileView, setMobileView] = useState<"lista" | "mapa">("lista");
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Filter + sort churches
    const filtered = useMemo(() => {
        let list = [...initialChurches] as (ChurchListItem & { distance?: number })[];

        // Text search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.city.toLowerCase().includes(q) ||
                    (c.address && c.address.toLowerCase().includes(q))
            );
        }

        // Zone filter
        if (zone !== "todas") {
            list = list.filter((c) => c.zone === zone);
        }

        // Distance calculation + sort
        if (userLocation) {
            list = list.map((c) => ({
                ...c,
                distance:
                    c.latitude != null && c.longitude != null
                        ? Math.round(
                            calculateDistance(userLocation, {
                                latitude: c.latitude,
                                longitude: c.longitude,
                            }) * 10
                        ) / 10
                        : Infinity,
            }));
            list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }

        return list;
    }, [search, zone, userLocation, initialChurches]);

    // Scroll to card when pin selected on map
    useEffect(() => {
        if (selectedId && cardRefs.current[selectedId]) {
            cardRefs.current[selectedId]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedId]);

    const handlePinSelect = useCallback(
        (id: string) => {
            setSelectedId(id);
            if (window.innerWidth <= 900) setMobileView("lista");
        },
        []
    );

    const handleCardSelect = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    return (
        <main className="min-h-screen bg-[#F8F6F0] pt-[70px]">
            {/* ── Hero / Search Area ── */}
            <div className="px-6 pt-8 pb-0 max-w-[1400px] mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb items={[{ label: 'Iglesias' }]} />
                </div>

                <h1 className="font-serif text-[clamp(26px,4vw,38px)] text-[#1E3A5F] mb-1.5 font-normal">
                    Encuentra Tu Iglesia
                </h1>
                <p className="text-[15px] text-[#6B7280] font-normal leading-[1.5] mb-5">
                    Más de 30 congregaciones en todo Chile te esperan con los brazos abiertos
                </p>

                {/* Search + Geo row */}
                <div className="flex gap-2 mb-0 max-[500px]:flex-col">
                    <div className="flex-1">
                        <ChurchFilters
                            search={search}
                            zone={zone}
                            onSearchChange={setSearch}
                            onZoneChange={(val) => {
                                setZone(val);
                                trackEvent('buscar_iglesia', { search_term: '', zone: val, source: 'church_client' });
                            }}
                            resultCount={filtered.length}
                            hasLocation={!!userLocation}
                        />
                    </div>
                    <div className="shrink-0 self-start mt-0">
                        <GeolocationPrompt
                            userLocation={userLocation}
                            onLocationChange={setUserLocation}
                        />
                    </div>
                </div>
            </div>

            {/* ── Mobile Tabs ── */}
            <div className="hidden max-[900px]:flex px-6 pb-3 gap-0 bg-[#F8F6F0]">
                <button
                    onClick={() => setMobileView("lista")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold
                      border-[1.5px] border-[#E8E4DC] cursor-pointer font-[var(--font-karla)]
                      rounded-l-lg transition-all
                      ${mobileView === "lista"
                            ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                            : "bg-white text-[#6B7280]"
                        }`}
                >
                    <List size={18} /> Lista
                </button>
                <button
                    onClick={() => setMobileView("mapa")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-semibold
                      border-[1.5px] border-l-0 border-[#E8E4DC] cursor-pointer font-[var(--font-karla)]
                      rounded-r-lg transition-all
                      ${mobileView === "mapa"
                            ? "bg-[#1E3A5F] text-white border-[#1E3A5F]"
                            : "bg-white text-[#6B7280]"
                        }`}
                >
                    <MapIcon size={18} /> Mapa
                </button>
            </div>

            {/* ── Split View ── */}
            <div className="ig-split">
                {/* List */}
                <div className={`ig-list-col min-h-0 ${mobileView === "mapa" ? "mobile-hide" : ""}`}>
                    {filtered.length === 0 ? (
                        <div className="py-[60px] px-6 text-center text-[#6B7280]">
                            <div className="text-5xl mb-3 opacity-40">🔍</div>
                            <h3 className="font-serif text-[#1E3A5F] text-xl mb-2">No encontramos resultados</h3>
                            <p className="text-sm leading-[1.6]">
                                Intenta con otra ciudad o cambia los filtros. También puedes escribirnos por WhatsApp
                                y te ayudamos a encontrar una iglesia cerca de ti.
                            </p>
                        </div>
                    ) : (
                        filtered.map((ch) => (
                            <div key={ch._id} ref={(el) => { cardRefs.current[ch._id] = el; }}>
                                <ChurchCard
                                    church={ch}
                                    isSelected={selectedId === ch._id}
                                    onSelect={handleCardSelect}
                                    onDetail={setDetailChurch}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Map */}
                <div
                    className="ig-map-col"
                    style={mobileView === "mapa" ? { display: 'block', height: '55vh', minHeight: '300px' } : undefined}
                >
                    <ChurchMap
                        churches={filtered}
                        selectedId={selectedId}
                        userLocation={userLocation}
                        onSelect={handlePinSelect}
                        isVisible={mobileView === "mapa"}
                    />
                </div>
            </div>

            {/* ── Detail Panel ── */}
            {detailChurch && (
                <ChurchDetail church={detailChurch} onClose={() => setDetailChurch(null)} />
            )}

            {/* ── Bottom CTA ── */}
            <section className="py-12 px-6 bg-gradient-to-br from-[#F5E6C4] to-[#F0DDB8] text-center">
                <h3 className="font-serif text-[clamp(22px,3.5vw,30px)] text-[#1E3A5F] mb-2">
                    ¿No encuentras una iglesia cerca?
                </h3>
                <p className="text-[15px] text-[#6B7280] mb-6 leading-[1.6]">
                    Escríbenos y te ayudaremos a conectar con la congregación más cercana a ti
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <a
                        href={`https://wa.me/56912345600?text=${encodeURIComponent(WA_GENERAL)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-bold
                       bg-[#25D366] text-white no-underline hover:bg-[#1ea952] hover:-translate-y-0.5
                       transition-all"
                    >
                        <MessageCircle size={18} /> Escríbenos por WhatsApp
                    </a>
                    <Link
                        href="/en-vivo"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-semibold
                       bg-white text-[#1E3A5F] border-[1.5px] border-[#E8E4DC] no-underline
                       hover:border-[#D4A843] hover:text-[#D4A843] transition-all"
                    >
                        <Play size={16} /> Conéctate al culto en vivo
                    </Link>
                </div>
            </section>
        </main>
    );
}
