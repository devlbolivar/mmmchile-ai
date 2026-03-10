import React from 'react';

export default function WhatsappCTA() {
    return (
        <section className="bg-[linear-gradient(135deg,#F8F0E0,#F8F6F0)] py-20 px-6 text-center">
            <div className="max-w-[1120px] mx-auto">
                <h2 className="font-serif text-[clamp(28px,4vw,36px)] text-[#1E3A5F] mb-3">
                    ¿Tienes preguntas? Escríbenos
                </h2>
                <p className="text-[#6B7280] text-[16px] max-w-[500px] mx-auto mb-8 font-normal">
                    Estamos aquí para ayudarte. Si deseas saber más sobre nosotros, horarios de reuniones, o tienes alguna duda, envíanos un mensaje por WhatsApp y con gusto te responderemos.
                </p>

                <a
                    href="https://wa.me/56975587223?text=Hola,%20me%20gustaría%20saber%20más%20información."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white text-[16px] font-extrabold rounded-xl hover:bg-[#1ea952] hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg m-auto"
                >
                    Hablar por WhatsApp
                </a>
            </div>
        </section>
    );
}
