import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Encuentra una Iglesia",
    description: "Encuentra la congregación del Movimiento Misionero Mundial más cercana a ti en Chile.",
    alternates: {
        canonical: '/iglesias',
    },
    openGraph: {
        title: "Encuentra Tu Iglesia | MMM Chile",
        description:
            "Más de 30 iglesias del Movimiento Misionero Mundial en todo Chile. Encuentra la congregación más cercana a ti.",
        url: "https://mmmchile.cl/iglesias",
    },
};

export default function IglesiasLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Leaflet CSS loaded via CDN link for maximum reliability */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
            {children}
        </>
    );
}
