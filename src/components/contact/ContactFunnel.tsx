import { Church, Heart, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ContactFunnel() {
    return (
        <div className="bg-gradient-to-br from-[#F5E6C4] to-[#F0DDB8] py-16 px-6 relative overflow-hidden">
            {/* Decorative center radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.5)_0%,transparent_60%)] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <h3 className="font-serif text-[26px] md:text-[32px] text-primary mb-3 font-medium">
                    ¿Buscas Algo Más?
                </h3>
                <p className="text-[16px] text-muted mb-10 leading-relaxed font-medium">
                    Explora nuestros recursos o encuentra la iglesia más cercana a ti
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Card 1: Find a church */}
                    <Link href="/iglesias" className="group bg-white/80 hover:bg-white backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <Church className="w-6 h-6" />
                        </div>
                        <h4 className="font-serif text-lg text-primary font-semibold mb-2">Iglesias</h4>
                        <p className="text-sm text-muted mb-4 flex-grow">
                            Encuentra la iglesia más cercana a tu hogar en todo Chile.
                        </p>
                        <span className="text-sm font-bold text-accent group-hover:text-primary transition-colors inline-flex items-center gap-1">
                            Buscar <span className="text-[10px]">▶</span>
                        </span>
                    </Link>

                    {/* Card 2: Prayer Request */}
                    <Link href="/oracion" className="group bg-white/80 hover:bg-white backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-xl">🙏</span>
                        </div>
                        <h4 className="font-serif text-lg text-primary font-semibold mb-2">Peticiones</h4>
                        <p className="text-sm text-muted mb-4 flex-grow">
                            Déjanos interceder por tu necesidad ante Dios.
                        </p>
                        <span className="text-sm font-bold text-accent group-hover:text-primary transition-colors inline-flex items-center gap-1">
                            Pedir oración <span className="text-[10px]">▶</span>
                        </span>
                    </Link>

                    {/* Card 3: Know Jesus */}
                    <Link href="/conoce-a-jesus" className="group bg-white/80 hover:bg-white backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-serif text-lg text-primary font-semibold mb-2">Salvación</h4>
                        <p className="text-sm text-muted mb-4 flex-grow">
                            Conoce el mensaje más importante para tu vida.
                        </p>
                        <span className="text-sm font-bold text-accent group-hover:text-primary transition-colors inline-flex items-center gap-1">
                            Conoce a Jesús <span className="text-[10px]">▶</span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
