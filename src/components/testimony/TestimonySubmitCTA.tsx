import Link from 'next/link';

export default function TestimonySubmitCTA() {
    return (
        <section className="bg-gradient-to-br from-primary to-[#2a5280] rounded-3xl p-10 md:p-16 text-center shadow-xl relative overflow-hidden my-20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                    ¿Tienes un testimonio de lo que Dios ha hecho?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                    Tus historias son una herramienta poderosa de evangelización. Cuando cuentas lo que Dios hizo en ti, inspiras fe y esperanza en aquellos que están pasando por la misma lucha.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/contacto?tema=testimonio"
                        className="bg-accent text-primary-dark font-semibold px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(212,168,67,0.3)] hover:bg-accent-light hover:-translate-y-1 hover:shadow-[0_6px_28px_rgba(212,168,67,0.45)] transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        Compartir mi Testimonio
                    </Link>
                    <span className="text-white/60 text-sm italic">
                        Nos pondremos en contacto contigo para verificar y redactar la historia.
                    </span>
                </div>
            </div>
        </section>
    );
}
