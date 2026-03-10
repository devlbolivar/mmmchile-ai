"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, MapPin, Copy, Clock, Check } from "lucide-react";

function trackEvent(name: string) {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", name, {});
    }
}

const WA_URL = "https://wa.me/56975587223";

export default function ContactInfo() {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard?.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Mobile: big full-width WhatsApp button + secondary links */}
            <div className="lg:hidden flex flex-col gap-3">
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("contact_whatsapp_click")}
                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1fbc5b] text-white w-full py-4 rounded-2xl font-bold text-[16px] transition-colors shadow-md"
                >
                    <MessageCircle className="w-5 h-5" />
                    Escríbenos por WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-3">
                    <a
                        href="tel:+56975587223"
                        onClick={() => trackEvent("contact_phone_click")}
                        className="flex items-center justify-center gap-2 text-primary font-medium border border-[#E8E2D8] rounded-xl py-3 text-sm bg-white hover:border-accent transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        +56 9 7558 7223
                    </a>
                    <a
                        href="mailto:secretariammmchile@gmail.com"
                        onClick={() => trackEvent("contact_email_click")}
                        className="flex items-center justify-center gap-2 text-primary font-medium border border-[#E8E2D8] rounded-xl py-3 text-sm bg-white hover:border-accent transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </a>
                </div>
            </div>

            {/* Desktop: WhatsApp banner card */}
            <div className="hidden lg:block bg-white rounded-[18px] p-6 border border-[#E8E2D8] relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#25D366]" />
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-[14px] bg-[#25D366]/10 flex items-center justify-center text-[#1a9e4a] shrink-0">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-serif text-lg text-primary font-semibold mb-1">Escríbenos por WhatsApp</h3>
                        <p className="text-sm text-muted mb-4">La forma más rápida de contactarnos.</p>
                        <a
                            href={WA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent("contact_whatsapp_click")}
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fbc5b] text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chatear ahora
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact info card */}
            <div className="bg-white rounded-[18px] p-7 border border-[#E8E2D8]">
                <h3 className="font-serif text-[18px] text-primary mb-4 font-semibold">Información de Contacto</h3>

                <div className="flex items-start gap-3 py-3 border-b border-[#E8E2D8]">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted tracking-wide mb-0.5">TELÉFONO</div>
                        <a
                            href="tel:+56975587223"
                            onClick={() => trackEvent("contact_phone_click")}
                            className="text-sm font-semibold text-primary hover:text-accent transition-colors block leading-snug"
                        >
                            +56 9 7558 7223
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-3 py-3 border-b border-[#E8E2D8]">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted tracking-wide mb-0.5">CORREO ELECTRÓNICO</div>
                        <a
                            href="mailto:secretariammmchile@gmail.com"
                            onClick={() => trackEvent("contact_email_click")}
                            className="text-sm font-semibold text-primary hover:text-accent transition-colors block leading-snug break-all"
                        >
                            secretariammmchile@gmail.com
                        </a>
                        <button
                            className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-accent hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                            onClick={() => copyToClipboard("secretariammmchile@gmail.com", "em")}
                        >
                            {copiedField === "em"
                                ? <><Check className="w-3 h-3 text-[#25D366]" /> <span className="text-[#25D366]">¡Copiado!</span></>
                                : <><Copy className="w-3 h-3" /> Copiar email</>
                            }
                        </button>
                    </div>
                </div>

                <div className="flex items-start gap-3 py-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-muted tracking-wide mb-0.5">DIRECCIÓN CENTRAL</div>
                        <div className="text-sm font-semibold text-primary leading-snug">General Gana #924</div>
                        <div className="text-xs text-light mt-0.5">Santiago Centro, Chile</div>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=General+Gana+924+Santiago"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-accent hover:underline"
                        >
                            Cómo llegar <MapPin className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Hours card */}
            <div className="bg-primary rounded-[18px] p-7 text-white relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-[radial-gradient(circle,rgba(212,168,67,0.12)_0%,transparent_70%)] rounded-full" />
                <h3 className="font-serif text-[18px] mb-4 font-medium relative flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Horarios de Atención
                </h3>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between py-2 border-b border-white/10 text-sm">
                        <span className="text-white/70 font-medium">Lunes a Domingos</span>
                        <span className="font-bold text-accent">9:00 AM — 7:00 PM</span>
                    </div>
                </div>
                <p className="mt-3 text-xs text-white/45 leading-relaxed">
                    Los domingos nuestras iglesias abren sus puertas para los cultos.
                    Puedes revisar los horarios específicos en el buscador de iglesias.
                </p>
            </div>
        </div>
    );
}
