"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { ChevronDown } from "./Icons";

const faqData = [
    {
        q: "¿Necesito ir a una iglesia?",
        a: "Ir a una iglesia no es un requisito para iniciar una relación con Dios, pero sí es una parte hermosa del camino. La iglesia es una comunidad donde encontrarás apoyo, enseñanza y amistades que te acompañarán en tu crecimiento. Cuando estés listo, te ayudamos a encontrar una cerca de ti."
    },
    {
        q: "¿Qué pasa después de esta oración?",
        a: "Hacer esta oración es un primer paso hermoso, pero es solo el comienzo. A partir de aquí, puedes empezar a leer la Biblia (te recomendamos el Evangelio de Juan), hablar con Dios todos los días como hablarías con un amigo, y conectarte con una comunidad de fe. No estás solo en esto — queremos caminar contigo."
    },
    {
        q: "¿Puedo hablar con alguien?",
        a: "¡Por supuesto! Tenemos personas preparadas y dispuestas a escucharte, responder tus preguntas y acompañarte. Puedes escribirnos por WhatsApp o dejarnos tus datos en el formulario, y nos comunicaremos contigo de forma confidencial."
    },
];

export default function GospelFAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section className="py-20 px-6 bg-[#F8F6F0]">
            <div className="max-w-[620px] mx-auto">
                <Reveal>
                    <h3 className="font-serif text-[clamp(24px,3.5vw,36px)] text-[#1E3A5F] text-center mb-9 font-medium">
                        ¿Aún tienes preguntas?
                    </h3>
                </Reveal>

                {faqData.map((faq, i) => (
                    <Reveal key={i} delay={0.05 + i * 0.08}>
                        <div className="bg-white rounded-xl mb-3 border border-[#E8E4DC] overflow-hidden transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                            <button
                                className="w-full py-5 px-6 bg-transparent border-none flex items-center justify-between font-sans text-base font-semibold text-[#1E3A5F] cursor-pointer text-left gap-3"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span>{faq.q}</span>
                                <span className={`shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : "rotate-0"}`}>
                                    <ChevronDown color="#1E3A5F" size={20} />
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-400 ease-in-out ${openFaq === i ? "max-h-[300px]" : "max-h-0"}`}
                            >
                                <div className="px-6 pb-5 text-[15px] leading-[1.7] text-gray-500">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
