"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const FAQS = [
    {
        q: "¿Cómo puedo visitar una iglesia por primera vez?",
        a: "Solo llega el domingo a las 11:00 AM. No necesitas inscribirte ni vestirte de una forma especial. Serás recibido con cariño. Puedes buscar la iglesia más cercana en nuestra página de iglesias.",
        link: "/iglesias"
    },
    {
        q: "¿Ofrecen consejería pastoral?",
        a: "Sí, nuestros pastores están disponibles para consejería individual y matrimonial. Puedes escribirnos por WhatsApp o completar el formulario indicando que necesitas consejería, y te conectaremos con un pastor en tu zona."
    },
    {
        q: "¿Cómo puedo compartir mi testimonio?",
        a: "Nos encanta escuchar historias de transformación. Puedes enviarnos tu testimonio por el formulario de contacto seleccionando el motivo 'Compartir testimonio', o escríbenos por WhatsApp."
    },
    {
        q: "¿Tienen actividades para jóvenes o niños?",
        a: "Sí, la mayoría de nuestras iglesias tienen ministerios de jóvenes y escuela dominical para niños. Los horarios varían por iglesia — contacta la iglesia más cercana para detalles."
    },

];

export default function ContactFAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="font-serif text-[28px] md:text-[34px] text-primary mb-3 font-semibold">
                    Preguntas Frecuentes
                </h2>
                <p className="text-[15px] text-muted">
                    Respuestas rápidas a las consultas más comunes
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {FAQS.map((faq, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[14px] border border-[#E8E2D8] overflow-hidden transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
                    >
                        <button
                            className="w-full px-6 py-5 bg-transparent border-none flex items-center justify-between text-left cursor-pointer"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                            <span className="font-sans text-[15px] font-bold text-primary pe-4">
                                {faq.q}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-muted transition-transform duration-300 shrink-0 ${openFaq === i ? "rotate-180" : ""}`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-[max-height] duration-400 ease-in-out ${openFaq === i ? "max-h-[300px]" : "max-h-0"
                                }`}
                        >
                            <div className="px-6 pb-5 text-[14px] leading-relaxed text-muted">
                                <p>{faq.a}</p>
                                {faq.link && (
                                    <Link
                                        href={faq.link}
                                        className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-bold text-accent hover:text-accent-light transition-colors"
                                    >
                                        Ver más <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
