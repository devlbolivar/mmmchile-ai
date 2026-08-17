import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getVisitasSession } from "@/lib/supabase/visitas-session";
import { VisitasUsuariosList, type UserRow } from "@/components/admin/VisitasUsuariosList";

export const metadata: Metadata = {
    title: "Usuarios | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default async function VisitasUsuariosPage() {
    const { user, profile } = await getVisitasSession();

    if (!user || profile?.role !== "admin") {
        redirect("/visitas");
    }

    const supabase = await createSessionClient();
    const [{ data: profiles }, { data: usersData }] = await Promise.all([
        supabase
            .from("profiles")
            .select("id, full_name, role, approved, created_at")
            .order("created_at", { ascending: true }),
        supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    ]);

    const emailById = new Map(usersData?.users.map((u) => [u.id, u.email ?? null]) ?? []);

    const pending: UserRow[] = [];
    const active: UserRow[] = [];

    for (const p of profiles ?? []) {
        const row: UserRow = {
            id: p.id,
            full_name: p.full_name,
            email: emailById.get(p.id) ?? null,
            role: p.role,
            created_at: p.created_at,
        };
        (p.approved ? active : pending).push(row);
    }

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-2xl text-primary mb-8">
                    Usuarios del equipo de visitas
                </h1>
                <VisitasUsuariosList
                    initialPending={pending}
                    initialActive={active}
                    currentUserId={user.id}
                />
            </div>
        </div>
    );
}
