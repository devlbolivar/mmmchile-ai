"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AuthConfirmHandler() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hash = window.location.hash.startsWith("#")
            ? window.location.hash.slice(1)
            : window.location.hash;
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken || !refreshToken) {
            setError("El enlace no es válido o ya expiró.");
            return;
        }

        const supabase = createBrowserSupabaseClient();
        supabase.auth
            .setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(({ error }) => {
                if (error) {
                    setError("El enlace no es válido o ya expiró.");
                    return;
                }
                router.push("/admin/reset-password");
            });
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6 text-center">
                <div>
                    <p className="text-gray-800 mb-2">{error}</p>
                    <p className="text-sm text-muted">Pide un nuevo enlace de acceso.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6">
            <p className="text-muted">Verificando enlace...</p>
        </div>
    );
}
