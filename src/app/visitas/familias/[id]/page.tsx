import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { getVisitasSession } from "@/lib/supabase/visitas-session";
import { LogVisitForm } from "@/components/admin/LogVisitForm";
import type { Category } from "@/app/visitas/familias/actions";

export const metadata: Metadata = {
    title: "Familia | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

const CATEGORY_LABEL: Record<Category, string> = {
    new_visitor: "Nuevo visitante",
    new_believer: "Nuevo creyente",
    needs_visit: "Necesita visita",
};

type HouseholdRow = {
    id: string;
    label: string;
    address: string | null;
    comuna: string | null;
    category: Category;
    source: string | null;
    notes: string | null;
};

type MemberRow = {
    id: string;
    full_name: string;
    phone: string | null;
    is_primary_contact: boolean;
};

type VisitRow = {
    id: string;
    visit_date: string;
    notes: string | null;
    follow_up_needed: boolean;
    follow_up_date: string | null;
    visited_by: { full_name: string | null } | null;
    member: { full_name: string | null } | null;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeZone: "UTC" }).format(
        new Date(value)
    );
}

export default async function FamiliaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { profile } = await getVisitasSession();
    const supabase = await createSessionClient();

    const [{ data: household }, { data: members }, { data: visits }] = await Promise.all([
        supabase
            .from("households")
            .select("id, label, address, comuna, category, source, notes")
            .eq("id", id)
            .single()
            .returns<HouseholdRow>(),
        supabase
            .from("household_members")
            .select("id, full_name, phone, is_primary_contact")
            .eq("household_id", id)
            .order("is_primary_contact", { ascending: false })
            .returns<MemberRow[]>(),
        supabase
            .from("visits")
            .select(
                "id, visit_date, notes, follow_up_needed, follow_up_date, visited_by:profiles(full_name), member:household_members(full_name)"
            )
            .eq("household_id", id)
            .order("visit_date", { ascending: false })
            .order("created_at", { ascending: false })
            .returns<VisitRow[]>(),
    ]);

    // Team members only ever see households assigned to them (RLS), so a
    // null result here means either it doesn't exist or it isn't theirs —
    // both render the same 404, which is the point.
    if (!household) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-2xl mx-auto flex flex-col gap-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl text-primary mb-1">{household.label}</h1>
                        <p className="text-sm text-muted">
                            {CATEGORY_LABEL[household.category] ?? household.category}
                            {household.comuna ? ` · ${household.comuna}` : ""}
                        </p>
                    </div>
                    {profile?.role === "admin" && (
                        <Link
                            href={`/visitas/familias/${household.id}/editar`}
                            className="text-sm text-primary hover:underline whitespace-nowrap"
                        >
                            Editar
                        </Link>
                    )}
                </div>

                <div className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    {household.address && (
                        <p className="text-gray-700 mb-1">{household.address}</p>
                    )}
                    {household.source && (
                        <p className="text-sm text-muted mb-1">Cómo llegaron: {household.source}</p>
                    )}
                    {household.notes && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mt-3">{household.notes}</p>
                    )}

                    <h2 className="font-serif text-lg text-primary mt-4 mb-2">Integrantes</h2>
                    <ul className="flex flex-col gap-1">
                        {(members ?? []).map((m) => (
                            <li key={m.id} className="text-sm text-gray-700">
                                {m.full_name}
                                {m.is_primary_contact && (
                                    <span className="text-xs text-accent-light bg-primary-dark px-2 py-0.5 rounded-full ml-2">
                                        Contacto principal
                                    </span>
                                )}
                                {m.phone && <span className="text-muted"> · {m.phone}</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <LogVisitForm
                    householdId={household.id}
                    members={(members ?? []).map((m) => ({ id: m.id, full_name: m.full_name }))}
                />

                <div>
                    <h2 className="font-serif text-lg text-primary mb-3">Historial de visitas</h2>
                    {!visits || visits.length === 0 ? (
                        <p className="text-muted">Todavía no hay visitas registradas.</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {visits.map((v) => (
                                <li
                                    key={v.id}
                                    className="bg-white rounded-2xl border border-border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <span className="font-medium text-primary">
                                            {formatDate(v.visit_date)}
                                        </span>
                                        <span className="text-xs text-muted">
                                            {v.visited_by?.full_name || "—"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted mb-2">
                                        {v.member?.full_name || "Toda la familia"}
                                    </p>
                                    {v.notes && (
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                                            {v.notes}
                                        </p>
                                    )}
                                    {v.follow_up_needed && (
                                        <span className="inline-block text-xs font-medium text-primary-dark bg-accent-pale px-3 py-1 rounded-full">
                                            Seguimiento: {v.follow_up_date ? formatDate(v.follow_up_date) : "sin fecha"}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
