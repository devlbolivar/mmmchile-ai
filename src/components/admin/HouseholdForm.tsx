"use client";

import { useState, useTransition } from "react";
import {
    createHousehold,
    updateHousehold,
    type Category,
    type HouseholdInput,
    type MemberInput,
} from "@/app/visitas/familias/actions";

type TeamMember = { id: string; full_name: string | null };

const CATEGORY_LABEL: Record<Category, string> = {
    new_visitor: "Nuevo visitante",
    new_believer: "Nuevo creyente",
    needs_visit: "Necesita visita",
};

function newMember(): MemberInput {
    return { id: crypto.randomUUID(), full_name: "", phone: "", is_primary_contact: false };
}

const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export function HouseholdForm({
    mode,
    householdId,
    initialValues,
    teamMembers,
}: {
    mode: "create" | "edit";
    householdId?: string;
    initialValues?: HouseholdInput;
    teamMembers: TeamMember[];
}) {
    const [label, setLabel] = useState(initialValues?.label ?? "");
    const [address, setAddress] = useState(initialValues?.address ?? "");
    const [comuna, setComuna] = useState(initialValues?.comuna ?? "");
    const [category, setCategory] = useState<Category>(initialValues?.category ?? "new_visitor");
    const [source, setSource] = useState(initialValues?.source ?? "");
    const [notes, setNotes] = useState(initialValues?.notes ?? "");
    const [assignedTo, setAssignedTo] = useState(initialValues?.assigned_to ?? "");
    const [members, setMembers] = useState<MemberInput[]>(
        initialValues?.members.length ? initialValues.members : [newMember()]
    );
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const updateMember = (id: string, patch: Partial<MemberInput>) => {
        setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    };

    const addMember = () => setMembers((prev) => [...prev, newMember()]);

    const removeMember = (id: string) => {
        setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload: HouseholdInput = {
            label,
            address: address || null,
            comuna: comuna || null,
            category,
            source: source || null,
            notes: notes || null,
            assigned_to: assignedTo || null,
            members,
        };

        startTransition(async () => {
            const result =
                mode === "create"
                    ? await createHousehold(payload)
                    : await updateHousehold(householdId!, payload);

            if (result && !result.success) {
                setError(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
                <label className={labelClass} htmlFor="label">
                    Nombre de la familia o persona *
                </label>
                <input
                    id="label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    required
                    placeholder='Ej. "Familia Pérez" o "María González"'
                    className={inputClass}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass} htmlFor="address">
                        Dirección
                    </label>
                    <input
                        id="address"
                        value={address ?? ""}
                        onChange={(e) => setAddress(e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass} htmlFor="comuna">
                        Comuna
                    </label>
                    <input
                        id="comuna"
                        value={comuna ?? ""}
                        onChange={(e) => setComuna(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass} htmlFor="category">
                        Categoría *
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className={inputClass}
                    >
                        {Object.entries(CATEGORY_LABEL).map(([value, text]) => (
                            <option key={value} value={value}>
                                {text}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClass} htmlFor="assigned_to">
                        Asignar a
                    </label>
                    <select
                        id="assigned_to"
                        value={assignedTo ?? ""}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Sin asignar</option>
                        {teamMembers.map((tm) => (
                            <option key={tm.id} value={tm.id}>
                                {tm.full_name || tm.id}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass} htmlFor="source">
                    Cómo llegaron
                </label>
                <input
                    id="source"
                    value={source ?? ""}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Ej. invitados por..., evento de..."
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass} htmlFor="notes">
                    Notas
                </label>
                <textarea
                    id="notes"
                    value={notes ?? ""}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className={inputClass}
                />
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-serif text-lg text-primary">Integrantes</h2>
                    <button
                        type="button"
                        onClick={addMember}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        + Agregar integrante
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="bg-card-a rounded-xl border border-border p-4 flex flex-col gap-3"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    value={member.full_name}
                                    onChange={(e) =>
                                        updateMember(member.id, { full_name: e.target.value })
                                    }
                                    placeholder="Nombre completo *"
                                    required
                                    className={inputClass}
                                />
                                <input
                                    value={member.phone ?? ""}
                                    onChange={(e) => updateMember(member.id, { phone: e.target.value })}
                                    placeholder="Teléfono"
                                    className={inputClass}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={member.is_primary_contact}
                                        onChange={(e) =>
                                            updateMember(member.id, {
                                                is_primary_contact: e.target.checked,
                                            })
                                        }
                                    />
                                    Contacto principal
                                </label>
                                <button
                                    type="button"
                                    onClick={() => removeMember(member.id)}
                                    disabled={members.length === 1}
                                    className="text-sm text-red-600 hover:underline disabled:opacity-40 disabled:no-underline"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-accent text-primary-dark font-bold hover:bg-accent-light transition-all disabled:opacity-60"
            >
                {isPending
                    ? "Guardando..."
                    : mode === "create"
                        ? "Crear familia"
                        : "Guardar cambios"}
            </button>
        </form>
    );
}
