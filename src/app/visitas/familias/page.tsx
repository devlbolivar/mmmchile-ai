import { Metadata } from "next";
import Link from "next/link";
import { createSessionClient } from "@/lib/supabase/server";
import type { Category } from "@/app/visitas/familias/actions";

export const metadata: Metadata = {
    title: "Familias | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

const CATEGORY_LABEL: Record<Category, string> = {
    new_visitor: "Nuevo visitante",
    new_believer: "Nuevo creyente",
    needs_visit: "Necesita visita",
};

type HouseholdListRow = {
    id: string;
    label: string;
    category: Category;
    comuna: string | null;
    assigned_to: { id: string; full_name: string | null } | null;
    visits: { count: number }[];
};

export default async function VisitasFamiliasPage() {
    const supabase = await createSessionClient();

    const { data: households } = await supabase
        .from("households")
        .select(
            "id, label, category, comuna, assigned_to:profiles!households_assigned_to_fkey(id, full_name), visits(count)"
        )
        .order("created_at", { ascending: false })
        .returns<HouseholdListRow[]>();

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-serif text-2xl text-primary">Familias</h1>
                    <Link
                        href="/visitas/familias/nueva"
                        className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-bold text-sm hover:bg-accent-light transition-all"
                    >
                        + Nueva familia
                    </Link>
                </div>

                {!households || households.length === 0 ? (
                    <p className="text-muted">Todavía no hay familias registradas.</p>
                ) : (
                    <div className="bg-white rounded-2xl border border-border overflow-hidden overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-card-a text-left text-xs uppercase text-muted">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Categoría</th>
                                    <th className="px-4 py-3">Comuna</th>
                                    <th className="px-4 py-3">Asignado a</th>
                                    <th className="px-4 py-3">Visitas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {households.map((h) => (
                                    <tr key={h.id} className="border-t border-border hover:bg-warm-bg">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/visitas/familias/${h.id}/editar`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {h.label}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {CATEGORY_LABEL[h.category as Category] ?? h.category}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">{h.comuna || "—"}</td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {h.assigned_to?.full_name || "Sin asignar"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-700">
                                            {h.visits?.[0]?.count ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
