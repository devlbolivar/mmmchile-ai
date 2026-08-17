"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { logVisit } from "@/app/visitas/familias/[id]/actions";

type Member = { id: string; full_name: string };

const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

// The device's local calendar date, built from components rather than
// toISOString() (which is UTC and can land on the wrong day near midnight).
function todayLocal() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function LogVisitForm({
    householdId,
    members,
}: {
    householdId: string;
    members: Member[];
}) {
    // Uncontrolled on purpose: "today" depends on the visitor's local clock,
    // which server-rendered HTML can't know. defaultValue (unlike value)
    // isn't reconciled during hydration, so there's no mismatch to suppress.
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [memberId, setMemberId] = useState("");
    const [notes, setNotes] = useState("");
    const [followUpNeeded, setFollowUpNeeded] = useState(false);
    const [followUpDate, setFollowUpDate] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    // The SSR-rendered defaultValue reflects the server's clock; correct it
    // to the visitor's actual local date once mounted (matters near a day
    // boundary when server and browser timezones disagree).
    useEffect(() => {
        if (dateInputRef.current) dateInputRef.current.value = todayLocal();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result = await logVisit(householdId, {
                visit_date: dateInputRef.current?.value || "",
                member_id: memberId || null,
                notes: notes || null,
                follow_up_needed: followUpNeeded,
                follow_up_date: followUpNeeded ? followUpDate || null : null,
            });

            if (result.success) {
                if (dateInputRef.current) dateInputRef.current.value = todayLocal();
                setMemberId("");
                setNotes("");
                setFollowUpNeeded(false);
                setFollowUpDate("");
            } else {
                setError(result.error);
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-4"
        >
            <h2 className="font-serif text-lg text-primary">Registrar visita</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass} htmlFor="visit_date">
                        Fecha *
                    </label>
                    <input
                        id="visit_date"
                        type="date"
                        ref={dateInputRef}
                        defaultValue={todayLocal()}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass} htmlFor="member_id">
                        A quién
                    </label>
                    <select
                        id="member_id"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Toda la familia</option>
                        {members.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass} htmlFor="notes">
                    Notas
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className={inputClass}
                />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                    type="checkbox"
                    checked={followUpNeeded}
                    onChange={(e) => setFollowUpNeeded(e.target.checked)}
                />
                Necesita seguimiento
            </label>

            {followUpNeeded && (
                <div>
                    <label className={labelClass} htmlFor="follow_up_date">
                        Fecha de seguimiento *
                    </label>
                    <input
                        id="follow_up_date"
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-accent text-primary-dark font-bold hover:bg-accent-light transition-all disabled:opacity-60"
            >
                {isPending ? "Guardando..." : "Registrar visita"}
            </button>
        </form>
    );
}
