import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { getVisitasSession } from "@/lib/supabase/visitas-session";
import type { Category } from "@/app/visitas/familias/actions";

export const metadata: Metadata = {
    title: "Mis familias | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

const CATEGORY_LABEL: Record<Category, string> = {
    new_visitor: "Nuevo visitante",
    new_believer: "Nuevo creyente",
    needs_visit: "Necesita visita",
};

type MyHouseholdRow = {
    id: string;
    label: string;
    category: Category;
    comuna: string | null;
    visits: { visit_date: string }[];
};

export default async function VisitasHomePage() {
    const { user, profile } = await getVisitasSession();

    if (profile?.role === "admin") {
        redirect("/visitas/familias");
    }

    const supabase = await createSessionClient();
    const { data: households } = await supabase
        .from("households")
        .select("id, label, category, comuna, visits(visit_date)")
        .eq("assigned_to", user!.id)
        .order("visit_date", { referencedTable: "visits", ascending: false })
        .limit(1, { referencedTable: "visits" })
        .order("label", { ascending: true })
        .returns<MyHouseholdRow[]>();

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-2xl text-primary mb-2">
                    Hola, {profile?.full_name || "equipo"}
                </h1>
                <p className="text-muted mb-8">Estas son tus familias asignadas.</p>

                {!households || households.length === 0 ? (
                    <p className="text-muted">Todavía no tienes familias asignadas.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {households.map((h) => {
                            const lastVisit = h.visits[0]?.visit_date;
                            return (
                                <li
                                    key={h.id}
                                    className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-medium text-primary">{h.label}</p>
                                        <p className="text-sm text-muted">
                                            {CATEGORY_LABEL[h.category] ?? h.category}
                                            {h.comuna ? ` · ${h.comuna}` : ""}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-nowrap">
                                        {lastVisit
                                            ? `Última visita: ${new Intl.DateTimeFormat("es-CL", {
                                                dateStyle: "medium",
                                                timeZone: "UTC",
                                            }).format(new Date(lastVisit))}`
                                            : "Sin visitas"}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
