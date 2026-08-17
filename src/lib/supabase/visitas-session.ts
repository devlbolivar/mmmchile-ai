import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";

export type VisitasProfile = {
    id: string;
    full_name: string | null;
    role: "admin" | "team_member" | null;
    approved: boolean;
};

// Memoized per request: safe to call from a layout and a page without
// double-hitting Supabase. The middleware already enforces the actual
// gate (logged in + approved) — this just exposes the resolved profile.
export const getVisitasSession = cache(async () => {
    const supabase = await createSessionClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { user: null, profile: null };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, role, approved")
        .eq("id", user.id)
        .single();

    return { user, profile: profile as VisitasProfile | null };
});
