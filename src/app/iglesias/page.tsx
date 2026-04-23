import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { GET_ALL_CHURCHES_QUERY } from "@/lib/sanity/queries";
import ChurchClient from "./ChurchClient";
import type { ChurchListItem } from "@/lib/types/church";

export const metadata: Metadata = {
    title: "Encuentra tu Iglesia Cristiana en Chile | MMM",
    description: "Encuentra tu iglesia más cercana. Más de 30 congregaciones en todo Chile te esperan con los brazos abiertos.",
    alternates: {
        canonical: 'https://mmmchile.cl/iglesias',
    },
    openGraph: {
        title: "Encuentra tu Iglesia Cristiana en Chile",
        description: "Más de 30 congregaciones del Movimiento Misionero Mundial en todo Chile. Encuentra la más cercana a ti.",
        url: "https://mmmchile.cl/iglesias",
        siteName: "Movimiento Misionero Mundial Chile",
        locale: "es_CL",
        type: "website",
        images: [
            {
                url: "https://mmmchile.cl/iglesias/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Encuentra tu Iglesia Cristiana en Chile — MMM",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Encuentra tu Iglesia Cristiana en Chile",
        description: "Más de 30 congregaciones del Movimiento Misionero Mundial en todo Chile. Encuentra la más cercana a ti.",
        images: ["https://mmmchile.cl/iglesias/opengraph-image"],
    },
};

export default async function IglesiasPage() {
    const churches = await sanityFetch<ChurchListItem[]>({ query: GET_ALL_CHURCHES_QUERY });

    return <ChurchClient initialChurches={churches} />;
}
