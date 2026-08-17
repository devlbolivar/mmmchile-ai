import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { getVisitasSession } from "@/lib/supabase/visitas-session";
import { HouseholdForm } from "@/components/admin/HouseholdForm";

export const metadata: Metadata = {
    title: "Nueva familia | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default async function NuevaFamiliaPage() {
    const { profile } = await getVisitasSession();
    if (profile?.role !== "admin") {
        redirect("/visitas");
    }

    const supabase = await createSessionClient();
    const { data: teamMembers } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "team_member")
        .eq("approved", true)
        .order("full_name", { ascending: true });

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-serif text-2xl text-primary mb-8">Nueva familia</h1>
                <HouseholdForm mode="create" teamMembers={teamMembers ?? []} />
            </div>
        </div>
    );
}
