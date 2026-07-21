"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/app/admin/reset-password/actions";

export function ResetPasswordForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updatePassword(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <h1 className="font-serif text-2xl text-primary mb-2 text-center">Crea tu contraseña</h1>
            <p className="text-sm text-muted text-center mb-6">Este será tu acceso al panel de aprobación de oraciones.</p>

            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                Nueva contraseña
            </label>
            <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full mb-4 px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmPassword">
                Confirma la contraseña
            </label>
            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full mb-5 px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            />

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-accent text-primary-dark font-bold hover:bg-accent-light transition-all disabled:opacity-60"
            >
                {isPending ? "Guardando..." : "Guardar contraseña"}
            </button>
        </form>
    );
}
