import Link from "next/link";
import { BlogPost } from "@/lib/mock-data/blog";
import { ArrowRight } from "lucide-react";

interface BlogSidebarProps {
    popularPosts: BlogPost[];
}

export default function BlogSidebar({ popularPosts }: BlogSidebarProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Popular */}
            <div className="bg-white border border-border rounded-2xl p-6 overflow-hidden">
                <h3 className="font-serif text-[18px] text-primary mb-4 font-semibold">Más Leídos</h3>
                <div className="flex flex-col">
                    {popularPosts.map((post, i) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post.slug}`}
                            className="group flex gap-3 py-3 border-b border-border last:border-b-0 hover:bg-accent/5 -mx-2 px-2 rounded-lg transition-colors"
                        >
                            <span className="font-serif text-[22px] font-bold text-accent/50 leading-none min-w-[24px]">
                                {i + 1}
                            </span>
                            <div>
                                <div className="text-[14px] font-semibold text-primary leading-tight group-hover:text-accent transition-colors">
                                    {post.title}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-1">
                                    {post.category?.title || "General"}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-white border border-border rounded-2xl p-6 text-center">
                <h3 className="font-serif text-[18px] text-primary mb-1 font-semibold">¿Tienes preguntas?</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                    Escríbenos por WhatsApp
                </p>
                <a
                    href="https://wa.me/56975587223?text=Hola,%20tengo%20una%20pregunta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-white text-sm font-extrabold hover:bg-[#1ea952] hover:-translate-y-[1px] transition-all"
                >
                    Contactar
                </a>
            </div>

            {/* Prayer */}
            <div className="bg-primary text-white rounded-2xl p-6">
                <h3 className="font-serif text-[18px] mb-2 font-semibold text-white">¿Necesitas Oración?</h3>
                <p className="text-[14px] text-white/70 leading-relaxed mb-4">
                    Comparte tu necesidad y oraremos por ti. No estás solo.
                </p>
                <Link
                    href="/oracion"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white/15 text-white text-[13px] font-bold border border-white/20 hover:bg-white/25 transition-colors"
                >
                    Pedir oración <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Evangelism Promo */}
            <div className="bg-white border text-primary border-border rounded-2xl p-6 border-l-[3px] border-l-accent relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[radial-gradient(circle,rgba(212,168,67,0.08)_0%,transparent_70%)] rounded-full" />
                <h3 className="font-serif text-[18px] mb-2 font-semibold relative z-10">Conoce a Jesús</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4 relative z-10">
                    La decisión más importante de tu vida comienza con una pregunta. ¿Quieres saber más?
                </p>
                <Link
                    href="/conoce-a-jesus"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-accent text-primary-foreground text-[13px] font-extrabold hover:bg-[#E8C976] hover:-translate-y-[1px] transition-all relative z-10"
                >
                    Saber más <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}
