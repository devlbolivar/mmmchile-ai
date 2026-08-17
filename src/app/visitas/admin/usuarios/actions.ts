"use server";

import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { getVisitasSession } from "@/lib/supabase/visitas-session";

type Role = "admin" | "team_member";

async function requireAdmin() {
    const { profile } = await getVisitasSession();
    if (profile?.role !== "admin") {
        return { success: false as const, error: "No autorizado." };
    }
    return null;
}

export async function approveUser(userId: string, role: Role) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = await createSessionClient();
    const { error } = await supabase
        .from("profiles")
        .update({ role, approved: true })
        .eq("id", userId);

    if (error) {
        return { success: false, error: "No se pudo aprobar al usuario." };
    }

    revalidatePath("/visitas/admin/usuarios");
    return { success: true };
}

export async function updateUserRole(userId: string, role: Role) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = await createSessionClient();
    const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

    if (error) {
        return { success: false, error: "No se pudo actualizar el rol." };
    }

    revalidatePath("/visitas/admin/usuarios");
    return { success: true };
}

export async function revokeAccess(userId: string) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = await createSessionClient();
    const { error } = await supabase
        .from("profiles")
        .update({ approved: false })
        .eq("id", userId);

    if (error) {
        return { success: false, error: "No se pudo revocar el acceso." };
    }

    revalidatePath("/visitas/admin/usuarios");
    return { success: true };
}
