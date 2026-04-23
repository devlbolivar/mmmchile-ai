"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { submitDecision } from "@/app/conoce-a-jesus/actions/submitDecision";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { trackEvent } from '@/lib/analytics';

export default function DecisionForm() {
    const [showForm, setShowForm] = useState(false);
    const [contactToggle, setContactToggle] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const [website, setWebsite] = useState(""); // honeypot

    const [formData, setFormData] = useState({
        nombre: "",
        ciudad: "",
        contacto: "",
        siguiente: ""
    });

    const handleInput = (field: string, val: string) => {
        setFormData(prev => ({ ...prev, [field]: val }));
    };

    const isValidContact = (val: string) => {
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phone = /^[\d\s\+\-\(\)]{7,15}$/;
        return email.test(val.trim()) || phone.test(val.trim());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!formData.nombre.trim()) {
            setErrorMsg("Por favor, ingresa tu nombre.");
            return;
        }

        if (contactToggle && !formData.contacto.trim()) {
            setErrorMsg("Por favor, ingresa tu WhatsApp o email para poder contactarte.");
            return;
        }

        if (formData.contacto.trim() && !isValidContact(formData.contacto)) {
            setErrorMsg("Por favor, ingresa un email o número de teléfono válido.");
            return;
        }

        if (website.trim() !== "") {
            // Honeypot tripped
            setSubmitted(true);
            return;
        }

        if (!turnstileToken) {
            setErrorMsg("Por favor, verifica que eres humano.");
            return;
        }

        setLoading(true);
        const result = await submitDecision({
            ...formData,
            quiereContacto: contactToggle,
            turnstileToken
        });

        if (result.success) {
            trackEvent('decision_fe', { 
                quiere_contacto: contactToggle,
                siguiente_paso: formData.siguiente || 'no_seleccionado'
            });
            setSubmitted(true);
        } else {
            setErrorMsg(result.error || "Ocurrió un error. Inténtalo más tarde.");
        }
        setLoading(false);
    };

    return (
        <section className="bg-white pb-20 pt-10 px-6 text-center">

            {/* The pre-form CTA */}
            {!showForm && !submitted && (
                <div className="max-w-[620px] mx-auto border-t border-[#D4A843]/25 pt-10 mb-10">
                    <Reveal>
                        <p className="text-[17px] text-gray-500 mb-4">¿Hiciste esta oración?</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 bg-[#D4A843] text-[#0F2035] px-9 py-4 rounded-xl font-bold font-sans text-base transition-all shadow-[0_4px_20px_rgba(212,168,67,0.3)] hover:bg-[#E8C976] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(212,168,67,0.4)]"
                        >
                            Sí, quiero dar mis primeros pasos
                        </button>
                        <p className="mt-8 text-base text-gray-500 max-w-md mx-auto">
                            ¿Aún no estás listo? No hay prisa. Puedes volver a esta página cuando quieras.
                        </p>
                    </Reveal>
                </div>
            )}

            {/* The Form Area */}
            <div className={`transition-all duration-700 overflow-hidden ${showForm ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="max-w-[520px] mx-auto pt-5 pb-10">
                    {!submitted ? (
                        <>
                            <Reveal>
                                <h2 className="font-serif text-[clamp(26px,4vw,38px)] text-[#1E3A5F] mb-2 font-medium">
                                    ¡El cielo celebra contigo! 🎉
                                </h2>
                                <p className="text-base text-gray-500 mb-9 leading-[1.6]">
                                    Queremos acompañarte en tus primeros pasos de fe. Déjanos tus datos y nos pondremos en contacto contigo.
                                </p>
                            </Reveal>

                            <form onSubmit={handleSubmit} className="text-left space-y-4">
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

                                <div>
                                    <label htmlFor="nombre" className="block text-[13px] font-semibold text-gray-500 mb-1.5 tracking-[0.3px]">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        placeholder="Tu nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={e => handleInput("nombre", e.target.value)}
                                        className="w-full p-3.5 border-[1.5px] border-[#E0DCD4] rounded-xl text-[15px] font-sans bg-[#F8F6F0] text-[#2C2C2C] outline-none transition-colors focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ciudad" className="block text-[13px] font-semibold text-gray-500 mb-1.5 tracking-[0.3px]">
                                        Ciudad / Comuna
                                    </label>
                                    <input
                                        id="ciudad"
                                        type="text"
                                        placeholder="¿Dónde vives?"
                                        value={formData.ciudad}
                                        onChange={e => handleInput("ciudad", e.target.value)}
                                        className="w-full p-3.5 border-[1.5px] border-[#E0DCD4] rounded-xl text-[15px] font-sans bg-[#F8F6F0] text-[#2C2C2C] outline-none transition-colors focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20"
                                    />
                                </div>

                                <div className="flex items-center justify-between py-3.5 border-b border-[#EDE9E0]">
                                    <span className="text-[15px] text-[#2C2C2C]">¿Te gustaría que te contactemos?</span>
                                    <div
                                        role="switch"
                                        aria-checked={contactToggle}
                                        aria-label="Permitir contacto"
                                        tabIndex={0}
                                        className="relative w-12 h-[26px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4A843] rounded-full"
                                        onClick={() => setContactToggle(!contactToggle)}
                                        onKeyDown={(e) => {
                                            if (e.key === " " || e.key === "Enter") {
                                                e.preventDefault();
                                                setContactToggle(!contactToggle);
                                            }
                                        }}
                                    >
                                        <div className={`w-full h-full rounded-full transition-colors duration-300 ${contactToggle ? "bg-[#D4A843]" : "bg-[#D1CCC4]"}`} />
                                        <div className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-transform duration-300 ${contactToggle ? "translate-x-[22px]" : "translate-x-0"}`} />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contacto" className="block text-[13px] font-semibold text-gray-500 mb-1.5 tracking-[0.3px]">
                                        WhatsApp o Email{contactToggle && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <input
                                        id="contacto"
                                        type="text"
                                        placeholder="+56 9 1234 5678 o tu@email.com"
                                        value={formData.contacto}
                                        onChange={e => handleInput("contacto", e.target.value)}
                                        className="w-full p-3.5 border-[1.5px] border-[#E0DCD4] rounded-xl text-[15px] font-sans bg-[#F8F6F0] text-[#2C2C2C] outline-none transition-colors focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20"
                                    />
                                    {contactToggle && (
                                        <p className="mt-1.5 text-[12px] text-gray-400">Lo usaremos solo para comunicarnos contigo.</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="siguiente" className="block text-[13px] font-semibold text-gray-500 mb-1.5 tracking-[0.3px]">
                                        ¿Qué te gustaría hacer ahora?
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="siguiente"
                                            value={formData.siguiente}
                                            onChange={e => handleInput("siguiente", e.target.value)}
                                            className="w-full p-3.5 border-[1.5px] border-[#E0DCD4] rounded-xl text-[15px] font-sans bg-[#F8F6F0] text-[#2C2C2C] outline-none appearance-none cursor-pointer transition-colors focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20"
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="iglesia">Visitar una iglesia</option>
                                            <option value="lectura">Recibir un plan de lectura bíblica</option>
                                            <option value="hablar">Hablar con alguien</option>
                                            <option value="info">Solo quiero información</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {errorMsg && (
                                    <div className="bg-red-50 text-red-700 border border-red-200 text-sm px-4 py-3 rounded-lg mt-2 flex items-start gap-2 text-left">
                                        <svg className="shrink-0 w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

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
                                            onError={() => setErrorMsg("No pudimos verificar que eres humano. Por favor, recarga la página.")}
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
                                    disabled={loading}
                                    className="w-full mt-2 p-4 bg-[#D4A843] text-[#0F2035] border-none rounded-xl text-base font-bold font-sans cursor-pointer transition-all shadow-[0_4px_16px_rgba(212,168,67,0.25)] hover:bg-[#E8C976] hover:-translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0F2035]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enviando información...
                                        </>
                                    ) : (
                                        "Dar el primer paso"
                                    )}
                                </button>

                                <p className="mt-3.5 text-[13px] text-gray-500 leading-[1.5]">
                                    🔒 Tu información es confidencial. Solo la usaremos para acompañarte en tu decisión y conectarte con una iglesia cercana.
                                </p>
                            </form>
                        </>
                    ) : (
                        <Reveal>
                            <div className="py-10 text-center">
                                <div className="text-[56px] mb-4">🙏</div>
                                <h2 className="font-serif text-[clamp(26px,4vw,38px)] text-[#1E3A5F] mb-3 font-medium">
                                    ¡Gracias, {formData.nombre}!
                                </h2>
                                <p className="text-base text-gray-500 mb-8 leading-[1.6]">
                                    Hemos recibido tu información. Alguien de nuestro equipo se comunicará contigo pronto para acompañarte en tus primeros pasos.
                                    ¡El cielo está de fiesta!
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/iglesias" className="w-full sm:w-auto bg-[#1E3A5F] text-white px-8 py-4 rounded-xl font-bold font-sans transition-all hover:bg-[#2A4A6F] hover:-translate-y-0.5 shadow-md">
                                        Encuentra una iglesia
                                    </Link>
                                    <a
                                        href="https://wa.me/56975587223"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold font-sans flex items-center justify-center gap-2 transition-all hover:bg-[#1fbc5b] hover:-translate-y-0.5 shadow-md"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        Escríbenos al WhatsApp
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}
