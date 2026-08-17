import { Metadata } from "next";
import { getVisitasSession } from "@/lib/supabase/visitas-session";

export const metadata: Metadata = {
    title: "Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default async function VisitasHomePage() {
    const { profile } = await getVisitasSession();

    return (
        <div className="min-h-screen bg-warm-bg px-6 py-16">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-serif text-2xl text-primary mb-2">
                    Hola, {profile?.full_name || "equipo"}
                </h1>
                <p className="text-muted">
                    Rol: {profile?.role === "admin" ? "Administrador" : "Miembro del equipo"}
                </p>
            </div>
        </div>
    );
}
