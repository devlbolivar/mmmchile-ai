"use server";

import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

type Role = "admin" | "team_member";

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
