"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import { submitContact } from "@/app/contacto/actions/submitContact";
import { Send, CheckCircle2, AlertCircle, Loader2, Heart, MapPin, BookOpen } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

const SUBJECTS = [
    { value: "informacion-general", label: "Quiero información general" },
    { value: "quiero-visitar", label: "Quiero visitar una iglesia" },
    { value: "necesito-oracion", label: "Necesito oración" },
    { value: "quiero-servir", label: "Quiero servir/colaborar" },
    { value: "consulta-pastoral", label: "Consulta pastoral" },
    { value: "otro", label: "Otro" },
];

function validateName(v: string): string {
    if (!v.trim()) return "El nombre es obligatorio";
    if (v.trim().length < 2) return "Debe tener al menos 2 caracteres";
    return "";
}

function validateEmail(v: string): string {
    if (!v.trim()) return ""; // optional
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Correo electrónico inválido";
    return "";
}

function validateMessage(v: string): string {
    if (!v.trim()) return "El mensaje es obligatorio";
    if (v.trim().length < 10) return "Debe tener al menos 10 caracteres";
    return "";
}

const inputBase = "w-full px-4 py-3.5 bg-cream outline-none rounded-xl text-[15px] transition-all disabled:opacity-50";
const inputNormal = "border-1.5 border-[#E8E2D8] focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10";
const inputError = "border-2 border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100";

export default function ContactForm() {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [showFunnelCTAs, setShowFunnelCTAs] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", message: "" });
    const [turnstileToken, setTurnstileToken] = useState("");
    const [website, setWebsite] = useState(""); // honeypot
    const formRef = useRef<HTMLFormElement>(null);
    const searchParams = useSearchParams();
    const sourcePage = searchParams?.get("from") || "direct";

    const hasErrors = Object.values(fieldErrors).some(Boolean);

    useEffect(() => {
        if (status === "success") {
            setShowFunnelCTAs(false);
            const t = setTimeout(() => setShowFunnelCTAs(true), 5000);
            return () => clearTimeout(t);
        }
    }, [status]);

    const smartHint = (() => {
        if (selectedSubject === "quiero-visitar") {
            return <>También puedes encontrar tu iglesia más cercana en nuestro <Link href="/iglesias" className="underline font-semibold hover:text-blue-800">buscador de iglesias</Link>.</>;
        }
        if (selectedSubject === "necesito-oracion") {
            return <>¿Sabías que puedes escribir en nuestro muro virtual? <Link href="/oracion" className="underline font-semibold hover:text-blue-800">Visita la sección de Oración</Link>.</>;
        }
        return null;
    })();

    const handleAction = async (formData: FormData) => {
        const name = formData.get("name")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const message = formData.get("message")?.toString() || "";

        const errors = {
            name: validateName(name),
            email: validateEmail(email),
            message: validateMessage(message),
        };
        setFieldErrors(errors);
        
        if (website.trim() !== "") {
            // Honeypot tripped
            setStatus("success");
            return;
        }

        if (Object.values(errors).some(Boolean)) return;

        if (!turnstileToken) {
            setStatus("error");
            setErrorMsg("Por favor, verifica que eres humano.");
            return;
        }

        setStatus("idle");
        setErrorMsg(null);
        formData.append("source_page", sourcePage);
        formData.append("turnstileToken", turnstileToken);
        trackEvent("contact_form_submit", { subject: selectedSubject });

        startTransition(async () => {
            const result = await submitContact(formData);
            if (result.success) {
                setStatus("success");
            } else {
                setStatus("error");
                setErrorMsg(result.error || "Ocurrió un error inesperado.");
            }
        });
    };

    if (status === "success") {
        return (
            <div className="bg-white rounded-[20px] p-10 border border-[#E8E2D8] shadow-sm text-center animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2E7D32]">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="font-serif text-[28px] text-primary mb-3 font-semibold">¡Mensaje Enviado!</h2>
                <p className="text-[16px] text-muted leading-relaxed max-w-[360px] mx-auto mb-8">
                    Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.
                </p>

                {/* Funnel CTAs — fade in after 5s */}
                <div className={`transition-all duration-700 overflow-hidden ${showFunnelCTAs ? "opacity-100 max-h-[300px] mb-8" : "opacity-0 max-h-0 mb-0"}`}>
                    <p className="text-sm font-semibold text-muted mb-4">¿Qué quieres hacer mientras tanto?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Link href="/oracion" className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors text-blue-800">
                            <Heart className="w-6 h-6" />
                            <span className="text-sm font-bold">Pedir Oración</span>
                        </Link>
                        <Link href="/iglesias" className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors text-primary">
                            <MapPin className="w-6 h-6" />
                            <span className="text-sm font-bold">Buscar Iglesia</span>
                        </Link>
                        <Link href="/conoce-a-jesus" className="flex flex-col items-center gap-2 p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors text-amber-800">
                            <BookOpen className="w-6 h-6" />
                            <span className="text-sm font-bold">Conoce a Jesús</span>
                        </Link>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setStatus("idle");
                        setSelectedSubject("");
                        setFieldErrors({ name: "", email: "", message: "" });
                        setShowFunnelCTAs(false);
                        formRef.current?.reset();
                    }}
                    className="px-8 py-3 rounded-xl border-2 border-[#E8E2D8] text-primary font-bold hover:border-accent hover:text-accent transition-all text-sm"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[20px] p-8 md:p-10 border border-[#E8E2D8] shadow-sm">
            <h2 className="font-serif text-[26px] text-primary mb-2 font-semibold">Envíanos un Mensaje</h2>
            <p className="text-[15px] text-muted mb-8 leading-relaxed">
                Completa el formulario y te responderemos lo antes posible. Si prefieres, escríbenos directamente por WhatsApp.
            </p>

            {status === "error" && (
                <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                    <div className="flex-grow">
                        <p className="font-semibold mb-1">Hubo un problema</p>
                        <p className="opacity-90">{errorMsg}</p>
                    </div>
                </div>
            )}

            <form ref={formRef} action={handleAction} className="space-y-5">
                {/* Honeypot field */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-xs font-bold text-muted tracking-wide">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            disabled={isPending}
                            placeholder="Tu nombre completo"
                            onBlur={(e) => setFieldErrors(prev => ({ ...prev, name: validateName(e.target.value) }))}
                            onChange={(e) => fieldErrors.name && setFieldErrors(prev => ({ ...prev, name: validateName(e.target.value) }))}
                            className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
                        />
                        {fieldErrors.name && (
                            <p className="text-xs text-red-500 font-medium">{fieldErrors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-bold text-muted tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            disabled={isPending}
                            placeholder="Para poder responderte"
                            onBlur={(e) => setFieldErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))}
                            onChange={(e) => fieldErrors.email && setFieldErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))}
                            className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
                        />
                        {fieldErrors.email && (
                            <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label htmlFor="whatsapp" className="block text-xs font-bold text-muted tracking-wide">
                            WhatsApp u otro Teléfono
                        </label>
                        <input
                            type="tel"
                            id="whatsapp"
                            name="whatsapp"
                            disabled={isPending}
                            placeholder="+56 9 1234 5678"
                            className={`${inputBase} ${inputNormal}`}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="subject" className="block text-xs font-bold text-muted tracking-wide">
                            Motivo de contacto <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="subject"
                                name="subject"
                                required
                                disabled={isPending}
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className={`${inputBase} ${inputNormal} appearance-none cursor-pointer`}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 16px center",
                                }}
                            >
                                <option value="" disabled>Selecciona un motivo</option>
                                {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        {/* Smart hint — smooth transition */}
                        <div className={`overflow-hidden transition-all duration-300 ${smartHint ? "max-h-16 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
                            <p className="text-xs text-blue-600 flex items-start gap-1">
                                <span className="text-[10px] mt-0.5">ℹ️</span>
                                <span>{smartHint}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-bold text-muted tracking-wide">
                        Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        disabled={isPending}
                        placeholder="Escribe tu consulta aquí..."
                        onBlur={(e) => setFieldErrors(prev => ({ ...prev, message: validateMessage(e.target.value) }))}
                        onChange={(e) => fieldErrors.message && setFieldErrors(prev => ({ ...prev, message: validateMessage(e.target.value) }))}
                        className={`${inputBase} ${fieldErrors.message ? inputError : inputNormal} min-h-[140px] resize-y`}
                    />
                    {fieldErrors.message && (
                        <p className="text-xs text-red-500 font-medium">{fieldErrors.message}</p>
                    )}
                </div>

                <div className="pt-2">
                    {process.env.NODE_ENV === 'development' ? (
                        <div className="p-4 bg-green-50 text-green-800 rounded-xl mb-4 text-sm border border-green-200">
                            <p className="font-semibold mb-2">Desarrollo: Turnstile omitido</p>
                            <button type="button" onClick={() => setTurnstileToken('dummy-token')} className="px-3 py-1.5 bg-green-200 hover:bg-green-300 text-green-900 rounded font-medium transition-colors">
                                Simular Captcha Válido
                            </button>
                            {turnstileToken === 'dummy-token' && <span className="ml-3 text-green-700">✓ Token simulado exitosamente</span>}
                        </div>
                    ) : (
                        <Turnstile 
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={(token) => setTurnstileToken(token)}
                            onError={() => {
                                setStatus("error");
                                setErrorMsg("No pudimos verificar que eres humano. Por favor, recarga la página.");
                            }}
                            onExpire={() => setTurnstileToken("")}
                            options={{
                                size: 'flexible',
                                theme: 'light'
                            }}
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending || hasErrors}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-primary-dark font-sans font-extrabold text-[16px] py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(212,168,67,0.25)] hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Enviar Mensaje
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-light font-medium mt-4">
                    🔒 Tu información es confidencial y solo será usada para comunicarnos contigo.
                </p>
            </form>
        </div>
    );
}
