import { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { PendingPrayerList } from "@/components/admin/PendingPrayerList";
import { logout } from "./actions";

export const metadata: Metadata = {
    title: "Aprobar Oraciones | MMM Chile",
    robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOracionesPage() {
    const { data: prayers, error } = await supabaseAdmin
        .from("prayer_requests")
        .select("id, name, is_anonymous, request, contact, created_at")
        .eq("is_public", true)
        .eq("approved", false)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching pending prayers:", error);
    }

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-10">
            <div className="max-w-[720px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-serif text-2xl text-primary">Peticiones Pendientes</h1>
                    <form action={logout}>
                        <button type="submit" className="text-sm text-muted hover:text-primary transition-colors">
                            Cerrar sesión
                        </button>
                    </form>
                </div>

                <PendingPrayerList initialPrayers={prayers ?? []} />
            </div>
        </div>
    );
}
