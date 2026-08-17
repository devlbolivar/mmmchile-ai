"use client";

import { useState, useTransition } from "react";
import {
    approveUser,
    revokeAccess,
    updateUserRole,
} from "@/app/visitas/admin/usuarios/actions";

type Role = "admin" | "team_member";

export type UserRow = {
    id: string;
    full_name: string | null;
    email: string | null;
    role: Role | null;
    created_at: string;
};

const ROLE_LABEL: Record<Role, string> = {
    admin: "Administrador",
    team_member: "Miembro del equipo",
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium" }).format(new Date(value));
}

export function VisitasUsuariosList({
    initialPending,
    initialActive,
    currentUserId,
}: {
    initialPending: UserRow[];
    initialActive: UserRow[];
    currentUserId: string;
}) {
    const [pending, setPending] = useState(initialPending);
    const [active, setActive] = useState(initialActive);
    const [pendingRoles, setPendingRoles] = useState<Record<string, Role>>({});
    const [isPending, startTransition] = useTransition();
    const [errorId, setErrorId] = useState<string | null>(null);

    const handleApprove = (row: UserRow) => {
        const role = pendingRoles[row.id] ?? "team_member";
        setErrorId(null);
        startTransition(async () => {
            const result = await approveUser(row.id, role);
            if (result?.success) {
                setPending((prev) => prev.filter((u) => u.id !== row.id));
                setActive((prev) => [...prev, { ...row, role }]);
            } else {
                setErrorId(row.id);
            }
        });
    };

    const handleRoleChange = (row: UserRow, role: Role) => {
        setErrorId(null);
        startTransition(async () => {
            const result = await updateUserRole(row.id, role);
            if (result?.success) {
                setActive((prev) => prev.map((u) => (u.id === row.id ? { ...u, role } : u)));
            } else {
                setErrorId(row.id);
            }
        });
    };

    const handleRevoke = (row: UserRow) => {
        setErrorId(null);
        startTransition(async () => {
            const result = await revokeAccess(row.id);
            if (result?.success) {
                setActive((prev) => prev.filter((u) => u.id !== row.id));
                setPending((prev) => [...prev, row]);
            } else {
                setErrorId(row.id);
            }
        });
    };

    return (
        <div className="flex flex-col gap-10">
            <section>
                <h2 className="font-serif text-xl text-primary mb-4">
                    Pendientes de aprobación
                </h2>
                {pending.length === 0 ? (
                    <p className="text-muted">No hay usuarios pendientes.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {pending.map((row) => (
                            <li
                                key={row.id}
                                className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium text-primary">
                                        {row.full_name || "Sin nombre"}
                                    </p>
                                    <p className="text-sm text-muted">{row.email}</p>
                                    <p className="text-xs text-light mt-1">
                                        Se unió el {formatDate(row.created_at)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {errorId === row.id && (
                                        <span className="text-sm text-red-600">Error, intenta de nuevo.</span>
                                    )}
                                    <select
                                        value={pendingRoles[row.id] ?? "team_member"}
                                        onChange={(e) =>
                                            setPendingRoles((prev) => ({
                                                ...prev,
                                                [row.id]: e.target.value as Role,
                                            }))
                                        }
                                        className="px-3 py-2 rounded-lg border border-border text-sm"
                                    >
                                        <option value="team_member">Miembro del equipo</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    <button
                                        onClick={() => handleApprove(row)}
                                        disabled={isPending}
                                        className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-bold text-sm hover:bg-accent-light transition-all disabled:opacity-60"
                                    >
                                        Aprobar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="font-serif text-xl text-primary mb-4">Activos</h2>
                {active.length === 0 ? (
                    <p className="text-muted">No hay usuarios activos.</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {active.map((row) => (
                            <li
                                key={row.id}
                                className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-wrap items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium text-primary">
                                        {row.full_name || "Sin nombre"}
                                        {row.id === currentUserId && (
                                            <span className="text-xs text-muted font-normal"> (tú)</span>
                                        )}
                                    </p>
                                    <p className="text-sm text-muted">{row.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {errorId === row.id && (
                                        <span className="text-sm text-red-600">Error, intenta de nuevo.</span>
                                    )}
                                    {row.id === currentUserId ? (
                                        <span className="text-sm text-muted">
                                            {ROLE_LABEL[row.role ?? "team_member"]}
                                        </span>
                                    ) : (
                                        <>
                                            <select
                                                value={row.role ?? "team_member"}
                                                onChange={(e) =>
                                                    handleRoleChange(row, e.target.value as Role)
                                                }
                                                disabled={isPending}
                                                className="px-3 py-2 rounded-lg border border-border text-sm"
                                            >
                                                <option value="team_member">Miembro del equipo</option>
                                                <option value="admin">Administrador</option>
                                            </select>
                                            <button
                                                onClick={() => handleRevoke(row)}
                                                disabled={isPending}
                                                className="px-4 py-2 rounded-lg bg-white border border-border text-gray-700 font-bold text-sm hover:border-red-300 hover:text-red-600 transition-all disabled:opacity-60"
                                            >
                                                Revocar acceso
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
