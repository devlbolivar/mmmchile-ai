"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getVisitasSession } from "@/lib/supabase/visitas-session";

export type Category = "new_visitor" | "new_believer" | "needs_visit";

export type MemberInput = {
    id: string;
    full_name: string;
    phone: string | null;
    is_primary_contact: boolean;
};

export type HouseholdInput = {
    label: string;
    address: string | null;
    comuna: string | null;
    category: Category;
    source: string | null;
    notes: string | null;
    assigned_to: string | null;
    members: MemberInput[];
};

function validate(input: HouseholdInput) {
    if (!input.label.trim()) return "El nombre de la familia es obligatorio.";
    if (input.members.length === 0) return "Agrega al menos un integrante.";
    if (input.members.some((m) => !m.full_name.trim())) {
        return "Cada integrante necesita un nombre.";
    }
    return null;
}

function householdFields(input: HouseholdInput) {
    return {
        label: input.label.trim(),
        address: input.address?.trim() || null,
        comuna: input.comuna?.trim() || null,
        category: input.category,
        source: input.source?.trim() || null,
        notes: input.notes?.trim() || null,
        assigned_to: input.assigned_to || null,
    };
}

export async function createHousehold(input: HouseholdInput) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const { user } = await getVisitasSession();
    const supabase = await createSessionClient();

    const { data: household, error } = await supabase
        .from("households")
        .insert({ ...householdFields(input), created_by: user?.id ?? null })
        .select("id")
        .single();

    if (error || !household) {
        return { success: false, error: "No se pudo crear la familia." };
    }

    const { error: membersError } = await supabase.from("household_members").insert(
        input.members.map((m) => ({
            id: m.id,
            household_id: household.id,
            full_name: m.full_name.trim(),
            phone: m.phone?.trim() || null,
            is_primary_contact: m.is_primary_contact,
        }))
    );

    if (membersError) {
        return {
            success: false,
            error: "La familia se creó, pero hubo un error al guardar los integrantes.",
        };
    }

    revalidatePath("/visitas/familias");
    redirect("/visitas/familias");
}

export async function updateHousehold(householdId: string, input: HouseholdInput) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const validationError = validate(input);
    if (validationError) return { success: false, error: validationError };

    const supabase = await createSessionClient();

    const { error } = await supabase
        .from("households")
        .update(householdFields(input))
        .eq("id", householdId);

    if (error) {
        return { success: false, error: "No se pudo actualizar la familia." };
    }

    const { data: existingMembers } = await supabase
        .from("household_members")
        .select("id")
        .eq("household_id", householdId);

    const submittedIds = new Set(input.members.map((m) => m.id));
    const idsToDelete = (existingMembers ?? [])
        .map((m) => m.id)
        .filter((id) => !submittedIds.has(id));

    const { error: upsertError } = await supabase.from("household_members").upsert(
        input.members.map((m) => ({
            id: m.id,
            household_id: householdId,
            full_name: m.full_name.trim(),
            phone: m.phone?.trim() || null,
            is_primary_contact: m.is_primary_contact,
        }))
    );

    if (upsertError) {
        return { success: false, error: "No se pudieron guardar los integrantes." };
    }

    if (idsToDelete.length > 0) {
        await supabase.from("household_members").delete().in("id", idsToDelete);
    }

    revalidatePath("/visitas/familias");
    redirect("/visitas/familias");
}
