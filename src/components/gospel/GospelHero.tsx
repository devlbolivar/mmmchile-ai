import { Reveal } from "./Reveal";
import { ChevronDown } from "./Icons";

export default function GospelHero() {
    return (
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#F5E6C4] via-[#F8F6F0] to-white">
            {/* Background Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,168,67,0.12)_0%,transparent_70%)] pointer-events-none" />

            <Reveal delay={0.15} className="relative z-10 px-6">
                <h1 className="font-serif text-[clamp(34px,6vw,62px)] text-[#1E3A5F] leading-[1.2] max-w-[700px] mx-auto font-medium">
                    Hay Alguien que Te Conoce<br />y Te Ama
                </h1>
            </Reveal>

            <Reveal delay={0.35} className="relative z-10 px-6 mt-5 max-w-[480px] mx-auto">
                <p className="text-[clamp(16px,2.2vw,19px)] text-gray-500 leading-relaxed font-light">
                    Esta página podría cambiar tu vida. Tómate unos minutos para leerla.
                </p>
            </Reveal>

            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-10 text-[#D4A843]">
                <ChevronDown size={30} color="currentColor" />
            </div>
        </section>
    );
}
