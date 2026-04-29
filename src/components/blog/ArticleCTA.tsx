import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ArticleCTAProps {
    categoryName: string;
    callToAction?: string;
}

type CTAOption = { title: string; desc: string; btn: string; href: string; bgClass: string };

const CTA_BY_VALUE: Record<string, CTAOption> = {
    "conoce-a-jesus": {
        title: "¿Quieres saber más sobre Jesús?",
        desc: "Esta podría ser la decisión más importante de tu vida.",
        btn: "Conoce a Jesús",
        href: "/conoce-a-jesus",
        bgClass: "bg-gradient-to-br from-accent/5 to-primary/5"
    },
    "oracion": {
        title: "¿Tienes una necesidad de oración?",
        desc: "No estás solo. Nuestro equipo de intercesión orará por ti esta semana.",
        btn: "Pedir oración",
        href: "/oracion",
        bgClass: "bg-gradient-to-br from-accent/5 to-primary/5"
    },
    "iglesias": {
        title: "Encuentra una iglesia para crecer",
        desc: "La fe crece mejor en comunidad. Hay una iglesia esperándote cerca de ti.",
        btn: "Buscar iglesia",
        href: "/iglesias",
        bgClass: "bg-gradient-to-br from-emerald-600/5 to-primary/5"
    },
};

const CTA_BY_CATEGORY: Record<string, CTAOption> = {
    "Preguntas de Vida": CTA_BY_VALUE["conoce-a-jesus"],
    "Testimonios": {
        title: "¿Tienes un testimonio?",
        desc: "Tu historia puede inspirar a alguien más. Compártela con nosotros.",
        btn: "Compartir mi testimonio",
        href: "/testimonios",
        bgClass: "bg-gradient-to-br from-red-600/5 to-primary/5"
    },
    "Vida Cristiana": CTA_BY_VALUE["iglesias"],
};

export default function ArticleCTA({ categoryName, callToAction }: ArticleCTAProps) {
    const cta = (callToAction && CTA_BY_VALUE[callToAction])
        || CTA_BY_CATEGORY[categoryName]
        || CTA_BY_VALUE["conoce-a-jesus"];

    return (
        <div className={`max-w-[700px] mx-auto my-8 p-8 text-center rounded-2xl border border-border relative overflow-hidden ${cta.bgClass}`}>
            <h3 className="font-serif text-[22px] text-primary mb-2">{cta.title}</h3>
            <p className="text-[15px] text-muted-foreground mb-4 leading-relaxed">{cta.desc}</p>
            <Link
                href={cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-primary-foreground text-[15px] font-extrabold shadow-[0_4px_16px_rgba(212,168,67,0.25)] hover:bg-[#E8C976] hover:-translate-y-0.5 transition-all"
            >
                {cta.btn} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
