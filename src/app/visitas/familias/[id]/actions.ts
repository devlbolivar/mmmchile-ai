"use server";

import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { getVisitasSession } from "@/lib/supabase/visitas-session";

export type LogVisitInput = {
    visit_date: string;
    member_id: string | null;
    notes: string | null;
    follow_up_needed: boolean;
    follow_up_date: string | null;
};

type LogVisitResult = { success: true } | { success: false; error: string };

// Deliberately does not check "is this household assigned to me" here —
// that's exactly what visits_insert_team_member (RLS) enforces. This just
// checks there's a session; an unauthorized insert fails at the DB level
// and comes back as a Postgres/PostgREST error we turn into a message.
export async function logVisit(
    householdId: string,
    input: LogVisitInput
): Promise<LogVisitResult> {
    const { user } = await getVisitasSession();
    if (!user) {
        return { success: false, error: "Debes iniciar sesión." };
    }

    if (!input.visit_date) {
        return { success: false, error: "La fecha de visita es obligatoria." };
    }
    if (input.follow_up_needed && !input.follow_up_date) {
        return { success: false, error: "Indica la fecha de seguimiento." };
    }

    const supabase = await createSessionClient();
    const { error } = await supabase.from("visits").insert({
        household_id: householdId,
        member_id: input.member_id,
        visited_by: user.id,
        visit_date: input.visit_date,
        notes: input.notes?.trim() || null,
        follow_up_needed: input.follow_up_needed,
        follow_up_date: input.follow_up_needed ? input.follow_up_date : null,
    });

    if (error) {
        return {
            success: false,
            error: "No se pudo registrar la visita. Es posible que esta familia no esté asignada a ti.",
        };
    }

    revalidatePath(`/visitas/familias/${householdId}`);
    revalidatePath("/visitas/familias");
    revalidatePath("/visitas");
    return { success: true };
}
