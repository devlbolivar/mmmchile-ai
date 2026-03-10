"use client";

import { useState, useTransition } from "react";
import { submitPrayer } from "@/app/oracion/actions/submitPrayer";
import { Turnstile } from "@marsidev/react-turnstile";

const CheckIco = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

type FormView = "form" | "loading" | "success";

export function PrayerForm() {
    const [isPending, startTransition] = useTransition();
    const [view, setView] = useState<FormView>("form");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Form local state
    const [nombre, setNombre] = useState("");
    const [peticion, setPeticion] = useState("");
    const [contacto, setContacto] = useState("");
    const [showWall, setShowWall] = useState(false);
    const [wantContact, setWantContact] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState("");
    const [website, setWebsite] = useState(""); // honeypot

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!peticion.trim()) {
            setErrorMsg("La petición no puede estar vacía.");
            return;
        }

        if (website.trim() !== "") {
            // Honeypot tripped - simulated success
            resetForm();
            setView("success");
            return;
        }

        if (!turnstileToken) {
            setErrorMsg("Por favor, verifica que eres humano.");
            return;
        }

        setErrorMsg(null);

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("peticion", peticion);
        formData.append("contacto", contacto);
        formData.append("showWall", showWall ? "true" : "false");
        formData.append("showWall", showWall ? "true" : "false");
        formData.append("wantContact", wantContact ? "true" : "false");
        formData.append("turnstileToken", turnstileToken);

        startTransition(async () => {
            const res = await submitPrayer(formData);
            if (res.success) {
                setView("success");
            } else {
                setErrorMsg(res.error || "Ocurrió un error. Intenta de nuevo.");
            }
        });
    };

    const resetForm = () => {
        setNombre("");
        setPeticion("");
        setContacto("");
        setShowWall(false);
        setWantContact(false);
        setView("form");
        setErrorMsg(null);
    };

    return (
        <div
            className="relative"
            aria-live="polite"
        >
            {/* Smooth crossfade wrapper */}
            <div className={`transition-all duration-500 ease-out ${view === "success" ? "opacity-0 scale-95 h-0 overflow-hidden" : "opacity-100 scale-100"}`}>
                <div className="bg-white rounded-[20px] p-8 md:p-9 border border-border shadow-[0_8px_40px_rgba(30,58,95,0.04)]">
                    <h2 className="font-serif text-[24px] text-primary mb-1.5 font-medium">Tu Petición de Oración</h2>
                    <p className="text-[14px] text-muted mb-7 leading-relaxed">
                        Cuéntanos qué está pasando en tu vida. Todo lo que compartas es tratado con cariño y confidencialidad.
                    </p>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-5 font-medium animate-[fadeUp_0.3s_ease-out]" role="alert">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Formulario de petición de oración">
                        {/* Honeypot field - Invisible to humans, tempting for bots */}
                        <div className="absolute -z-10 opacity-0 overflow-hidden w-0 h-0" aria-hidden="true" tabIndex={-1}>
                            <label htmlFor="website">Website</label>
                            <input 
                                type="text" 
                                id="website" 
                                name="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                tabIndex={-1}
                                autoComplete="off" 
                            />
                        </div>

                        <div>
                            <label htmlFor="prayer-nombre" className="block text-[13px] font-bold text-muted mb-1.5 tracking-wide">
                                Tu nombre <span className="font-normal text-light italic">(opcional)</span>
                            </label>
                            <input
                                id="prayer-nombre"
                                type="text"
                                placeholder="Puedes ser anónimo"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                disabled={isPending}
                                aria-describedby="nombre-help"
                                className="w-full px-4 py-3 border-2 border-border rounded-xl text-[15px] bg-cream text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:bg-white focus:ring-[3px] focus:ring-accent/10 placeholder:text-[#BEB6AE] disabled:opacity-60"
                            />
                            <span id="nombre-help" className="sr-only">Puedes dejar tu nombre o ser anónimo</span>
                        </div>

                        <div>
                            <label htmlFor="prayer-peticion" className="block text-[13px] font-bold text-muted mb-1.5 tracking-wide">
                                Tu petición de oración <span className="text-red-500" aria-label="campo obligatorio">*</span>
                            </label>
                            <textarea
                                id="prayer-peticion"
                                placeholder="Cuéntanos qué necesitas. Dios escucha y nosotros oramos."
                                value={peticion}
                                onChange={(e) => setPeticion(e.target.value)}
                                disabled={isPending}
                                required
                                aria-required="true"
                                className="w-full px-4 py-3 border-2 border-border rounded-xl text-[15px] bg-cream text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:bg-white focus:ring-[3px] focus:ring-accent/10 placeholder:text-[#BEB6AE] min-h-[140px] resize-y disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label htmlFor="prayer-contacto" className="block text-[13px] font-bold text-muted mb-1.5 tracking-wide">
                                ¿Cómo te contactamos? <span className="font-normal text-light italic">(opcional)</span>
                            </label>
                            <input
                                id="prayer-contacto"
                                type="text"
                                placeholder="Email o WhatsApp, para darte seguimiento"
                                value={contacto}
                                onChange={(e) => setContacto(e.target.value)}
                                disabled={isPending}
                                className="w-full px-4 py-3 border-2 border-border rounded-xl text-[15px] bg-cream text-gray-800 outline-none transition-all duration-300 focus:border-accent focus:bg-white focus:ring-[3px] focus:ring-accent/10 placeholder:text-[#BEB6AE] disabled:opacity-60"
                            />
                        </div>

                        <div
                            role="checkbox"
                            aria-checked={showWall}
                            aria-label="Publicar petición de forma anónima en el muro de oración"
                            tabIndex={0}
                            className="flex items-start gap-3 py-2 cursor-pointer group"
                            onClick={() => { if (!isPending) setShowWall(!showWall); }}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!isPending) setShowWall(!showWall); } }}
                        >
                            <div
                                className={`w-[22px] h-[22px] rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 mt-[1px] ${showWall
                                    ? "bg-accent border-accent text-primary-dark"
                                    : "bg-cream border-border text-transparent group-hover:border-accent/50"
                                    }`}
                            >
                                <CheckIco />
                            </div>
                            <span className="text-[14px] text-gray-800 leading-snug select-none">
                                Quiero que mi petición aparezca en el muro de oración (anónimamente)
                            </span>
                        </div>

                        <div
                            role="checkbox"
                            aria-checked={wantContact}
                            aria-label="Solicitar que alguien me contacte para conversar"
                            tabIndex={0}
                            className="flex items-start gap-3 py-2 cursor-pointer group"
                            onClick={() => { if (!isPending) setWantContact(!wantContact); }}
                            onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!isPending) setWantContact(!wantContact); } }}
                        >
                            <div
                                className={`w-[22px] h-[22px] rounded-md border-2 shrink-0 flex items-center justify-center transition-all duration-200 mt-[1px] ${wantContact
                                    ? "bg-accent border-accent text-primary-dark"
                                    : "bg-cream border-border text-transparent group-hover:border-accent/50"
                                    }`}
                            >
                                <CheckIco />
                            </div>
                            <span className="text-[14px] text-gray-800 leading-snug select-none">
                                Me gustaría que alguien me contacte para conversar
                            </span>
                        </div>

                        <div className="pt-2">
                            <Turnstile 
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                                onSuccess={(token) => setTurnstileToken(token)}
                                onError={() => setErrorMsg("No pudimos verificar que eres humano. Por favor, recarga la página.")}
                                onExpire={() => setTurnstileToken("")}
                                options={{
                                    size: 'flexible',
                                    theme: 'light'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            aria-label={isPending ? "Enviando petición de oración…" : "Enviar petición de oración"}
                            className="w-full py-4 rounded-xl bg-accent text-primary-dark text-[16px] font-extrabold transition-all duration-300 ease-out
                shadow-[0_4px_20px_rgba(212,168,67,0.25)]
                hover:bg-accent-light hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(212,168,67,0.35)]
                active:translate-y-0 active:scale-[0.98]
                disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100
                mt-2 flex items-center justify-center gap-2"
                        >
                            {isPending && (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            )}
                            {isPending ? "Enviando…" : "Enviar Petición de Oración"}
                        </button>

                        <p className="mt-3 text-[13px] text-light text-center leading-relaxed" aria-hidden="true">
                            🔒 Tu petición es confidencial. Solo nuestro equipo de intercesión la verá.
                        </p>
                    </form>
                </div>
            </div>

            {/* Success state */}
            <div className={`transition-all duration-500 ease-out ${view === "success" ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 overflow-hidden pointer-events-none absolute inset-0"}`}>
                <div className="bg-white rounded-[20px] p-8 md:p-12 border border-border text-center shadow-[0_8px_40px_rgba(30,58,95,0.04)]">
                    <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center mx-auto mb-5 animate-[popIn_0.5s_cubic-bezier(0.16,1,0.3,1)_0.2s_both]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="font-serif text-[24px] text-primary mb-2 font-medium">Tu petición fue recibida</h2>
                    <p className="text-[15px] text-muted leading-relaxed max-w-[380px] mx-auto">
                        Estamos orando por ti 🙏<br /><br />
                        Nuestro equipo de intercesión recibirá tu petición y orará por ti esta semana. No estás solo en esto — Dios te escucha y nosotros también.
                    </p>
                    <button
                        onClick={resetForm}
                        aria-label="Enviar otra petición de oración"
                        className="mt-6 px-7 py-3 rounded-[10px] bg-transparent border-2 border-border text-[14px] font-bold text-primary cursor-pointer hover:border-accent hover:text-accent transition-all duration-200"
                    >
                        Enviar otra petición
                    </button>
                </div>
            </div>
        </div>
    );
}
