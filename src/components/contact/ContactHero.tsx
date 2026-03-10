import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ContactHero() {
    return (
        <section className="text-center pt-16 px-6 pb-0 relative overflow-hidden bg-cream">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-xs text-muted mb-6">
                <Link href="/" className="hover:text-accent transition-colors font-medium">Inicio</Link>
                <ChevronRight className="w-3 h-3 text-muted/50" />
                <span className="text-primary font-semibold">Contacto</span>
            </nav>

            <div className="max-w-xl mx-auto opacity-0 translate-y-8 animate-[fadeUp_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <h1 className="font-serif text-4xl md:text-[44px] text-primary leading-tight mb-3 font-semibold">
                    Estamos Aquí para Ti
                </h1>
                <p className="text-[17px] text-muted max-w-[500px] mx-auto mb-9 leading-relaxed">
                    Ya sea que tengas preguntas, necesites oración, o quieras visitarnos, queremos escucharte.
                </p>
            </div>
        </section>
    );
}
