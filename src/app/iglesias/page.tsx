import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { GET_ALL_CHURCHES_QUERY } from "@/lib/sanity/queries";
import ChurchClient from "./ChurchClient";
import type { ChurchListItem } from "@/lib/types/church";

export const metadata: Metadata = {
    title: "Encuentra tu Iglesia Cristiana en Chile | MMM",
    description: "Encuentra tu iglesia más cercana. Más de 30 congregaciones en todo Chile te esperan con los brazos abiertos.",
    alternates: {
        canonical: '/iglesias',
    },
};

export default async function IglesiasPage() {
    const churches = await sanityFetch<ChurchListItem[]>({ query: GET_ALL_CHURCHES_QUERY });

    return <ChurchClient initialChurches={churches} />;
}
