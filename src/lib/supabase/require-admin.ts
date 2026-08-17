import { getVisitasSession } from "@/lib/supabase/visitas-session";

// Server Action guard: mirrors the RLS admin policies, so a bad app-level
// check can't do anything the database would refuse anyway.
export async function requireAdmin() {
    const { profile } = await getVisitasSession();
    if (profile?.role !== "admin") {
        return { success: false as const, error: "No autorizado." };
    }
    return null;
}
