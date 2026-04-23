import { supabaseAdmin } from "@/lib/supabase";
import { PrayerWallList } from "./PrayerWallList";

function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Hace un momento";

    const diffInMinutes = Math.round(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;

    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;

    const diffInDays = Math.round(diffInHours / 24);
    if (diffInDays === 1) return `Ayer`;
    if (diffInDays < 30) return `Hace ${diffInDays} días`;

    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(date);
}

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
        date: getRelativeTime(p.created_at),
        prayCount: p.pray_count ?? 0,
        color: colors[i % colors.length],
    })) ?? [];

    return (
        <div className="w-full relative">
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
