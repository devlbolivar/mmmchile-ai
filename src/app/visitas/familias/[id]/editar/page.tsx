import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { HouseholdForm } from "@/components/admin/HouseholdForm";

export const metadata: Metadata = {
    title: "Editar familia | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default async function EditarFamiliaPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createSessionClient();

    const [{ data: household }, { data: members }, { data: teamMembers }] = await Promise.all([
        supabase.from("households").select("*").eq("id", id).single(),
        supabase
            .from("household_members")
            .select("id, full_name, phone, is_primary_contact")
            .eq("household_id", id)
            .order("is_primary_contact", { ascending: false }),
        supabase
            .from("profiles")
            .select("id, full_name")
            .eq("role", "team_member")
            .eq("approved", true)
            .order("full_name", { ascending: true }),
    ]);

    if (!household) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-serif text-2xl text-primary mb-8">Editar familia</h1>
                <HouseholdForm
                    mode="edit"
                    householdId={household.id}
                    initialValues={{
                        label: household.label,
                        address: household.address,
                        comuna: household.comuna,
                        category: household.category,
                        source: household.source,
                        notes: household.notes,
                        assigned_to: household.assigned_to,
                        members: members ?? [],
                    }}
                    teamMembers={teamMembers ?? []}
                />
            </div>
        </div>
    );
}
