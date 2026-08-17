import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cuenta pendiente | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default function VisitasPendingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6 text-center">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h1 className="font-serif text-2xl text-primary mb-3">Cuenta pendiente</h1>
                <p className="text-gray-700">
                    Tu cuenta está pendiente de aprobación por un administrador.
                </p>
            </div>
        </div>
    );
}
