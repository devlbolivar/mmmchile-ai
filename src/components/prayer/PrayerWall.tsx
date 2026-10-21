import { supabaseAdmin } from "@/lib/supabase";
import { PrayerWallList } from "./PrayerWallList";

// Keep cached output stable as time passes; display the actual publication date.
const prayerDateFormatter = new Intl.DateTimeFormat('es-CL', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Santiago',
});

export async function PrayerWall() {
    const { data: prayers, error } = await supabaseAdmin
        .from("prayer_requests")
        .select("id, name, is_anonymous, request, pray_count, created_at")
        .eq("is_public", true)
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching prayer requests:", error);
    }

    const colors = ["#F0F4F8", "#FDF6EA", "#FFFFFF", "#F4F0F8"];

    const formattedPrayers = prayers?.map((p, i) => ({
        id: p.id,
        name: p.is_anonymous ? "Anónimo" : (p.name || "Anónimo"),
        text: p.request,
        date: prayerDateFormatter.format(new Date(p.created_at)),
        prayCount: p.pray_count ?? 0,
        color: colors[i % colors.length],
    })) ?? [];

    return (
        <div id="muro-oracion" className="w-full relative scroll-mt-20">
            {/* Decorative Divider */}
            <div className="max-w-[1100px] mx-auto px-6 py-10">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-border via-50% to-transparent opacity-60 flex justify-center">
                    <div className="w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent h-full" />
                </div>
            </div>

            <PrayerWallList initialPrayers={formattedPrayers} />
        </div>
    );
}
