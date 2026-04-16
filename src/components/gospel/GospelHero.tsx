import { Reveal } from "./Reveal";
import { ChevronDown } from "./Icons";
import Image from "next/image";

export default function GospelHero() {
    return (
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/gospel_hero_bg.png"
                    alt="Amanecer de esperanza"
                    fill
                    priority
                    quality={90}
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/40 via-transparent to-[#F8F6F0]" />
            </div>

            <Reveal delay={0.15} className="relative z-10 px-6 mt-16 md:mt-0">
                <h1 className="font-serif text-[clamp(34px,6vw,62px)] text-white drop-shadow-xl leading-[1.2] max-w-[700px] mx-auto font-medium">
                    Hay Alguien que Te Conoce<br />y Te Ama
                </h1>
            </Reveal>

            <Reveal delay={0.35} className="relative z-10 px-6 mt-5 max-w-[480px] mx-auto">
                <p className="text-[clamp(16px,2.2vw,19px)] text-white/90 drop-shadow-md leading-relaxed font-light">
                    Esta página podría cambiar tu vida. Tómate unos minutos para leerla.
                </p>
            </Reveal>

            <div className="absolute bottom-9 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-10 text-[#D4A843]">
                <ChevronDown size={30} color="currentColor" />
            </div>
        </section>
    );
}
