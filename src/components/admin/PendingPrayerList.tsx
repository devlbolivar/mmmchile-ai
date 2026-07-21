"use client";

import { useState, useTransition } from "react";
import { approvePrayer, rejectPrayer } from "@/app/admin/oraciones/actions";

type PendingPrayer = {
    id: string;
    name: string;
    is_anonymous: boolean;
    request: string;
    contact: string | null;
    created_at: string;
};

export function PendingPrayerList({ initialPrayers }: { initialPrayers: PendingPrayer[] }) {
    const [prayers, setPrayers] = useState(initialPrayers);
    const [isPending, startTransition] = useTransition();
    const [errorId, setErrorId] = useState<string | null>(null);

    const handleApprove = (id: string) => {
        setErrorId(null);
        startTransition(async () => {
            const result = await approvePrayer(id);
            if (result?.success) {
                setPrayers((prev) => prev.filter((p) => p.id !== id));
            } else {
                setErrorId(id);
            }
        });
    };

    const handleReject = (id: string) => {
        setErrorId(null);
        startTransition(async () => {
            const result = await rejectPrayer(id);
            if (result?.success) {
                setPrayers((prev) => prev.filter((p) => p.id !== id));
            } else {
                setErrorId(id);
            }
        });
    };

    if (prayers.length === 0) {
        return (
            <p className="text-center text-muted py-16">
                No hay peticiones pendientes de aprobación 🙌
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-4">
            {prayers.map((p) => (
                <li key={p.id} className="bg-white rounded-2xl border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-primary">
                            {p.is_anonymous ? "Anónimo" : p.name}
                        </span>
                        <span className="text-xs text-muted">
                            {new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(p.created_at))}
                        </span>
                    </div>
                    <p className="text-gray-800 mb-4 whitespace-pre-wrap">{p.request}</p>
                    {errorId === p.id && (
                        <p className="text-sm text-red-600 mb-3">Ocurrió un error, intenta de nuevo.</p>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleApprove(p.id)}
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg bg-accent text-primary-dark font-bold text-sm hover:bg-accent-light transition-all disabled:opacity-60"
                        >
                            Aprobar
                        </button>
                        <button
                            onClick={() => handleReject(p.id)}
                            disabled={isPending}
                            className="px-4 py-2 rounded-lg bg-white border border-border text-gray-700 font-bold text-sm hover:border-red-300 hover:text-red-600 transition-all disabled:opacity-60"
                        >
                            Rechazar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
