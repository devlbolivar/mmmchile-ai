import { Metadata } from "next";
import { signInWithGoogle } from "@/app/auth/actions";

export const metadata: Metadata = {
    title: "Ingreso | Equipo de Visitas | MMM Chile",
    robots: { index: false, follow: false },
};

export default function VisitasLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-bg px-6">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center">
                <h1 className="font-serif text-2xl text-primary mb-2">Equipo de Visitas</h1>
                <p className="text-sm text-muted mb-6">
                    Ingresa con tu cuenta de Google para continuar.
                </p>

                <form action={signInWithGoogle}>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <GoogleIcon />
                        Ingresar con Google
                    </button>
                </form>
            </div>
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
                fill="#4CAF50"
                d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"
            />
            <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C41.8 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
        </svg>
    );
}
