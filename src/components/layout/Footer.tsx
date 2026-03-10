import Link from "next/link";
import CTAButton from "../shared/CTAButton";
import FooterRadio from "./FooterRadio";

const FacebookIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const InstagramIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
);

const YoutubeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0F2035" />
    </svg>
);



export default function Footer() {
    return (
        <footer className="bg-[#0F2035] text-white/70 pt-16 px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-[1120px] mx-auto">
                <div>
                    <h4 className="font-serif text-white text-[18px] mb-5 font-normal">MMM Chile</h4>
                    <p className="text-[14px] leading-[1.7] mb-4">
                        Llevando esperanza, fe y propósito a cada rincón de Chile a través del mensaje transformador del Evangelio.
                    </p>
                    <div className="flex gap-3">
                        {[
                            { href: "https://web.facebook.com/MMMCHILEORG/", label: "Facebook", Icon: FacebookIcon },
                            { href: "https://www.instagram.com/chile_mmm/", label: "Instagram", Icon: InstagramIcon },
                            { href: "https://www.youtube.com/@KoinoniaMMMChileOficial", label: "YouTube", Icon: YoutubeIcon },
                        ].map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 transition-all duration-300 hover:bg-[#D4A843] hover:text-[#0F2035]"
                                aria-label={label}
                            >
                                <Icon />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-serif text-white text-[18px] mb-5 font-normal">Enlaces Rápidos</h4>
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/conoce-a-jesus" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Conoce a Jesús</Link></li>
                        <li><Link href="/iglesias" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Encontrar Iglesia</Link></li>
                        <li><Link href="/oracion" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Pedir Oración</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-serif text-white text-[18px] mb-5 font-normal">Recursos</h4>
                    <ul className="flex flex-col gap-2">
                        <li><Link href="/blog" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Blog y Artículos</Link></li>
                        <li><Link href="/testimonios" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Testimonios</Link></li>
                        <li><Link href="/doctrina" className="text-white/60 hover:text-[#D4A843] text-[14px] transition-colors">Nuestra Doctrina</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-serif text-white text-[18px] mb-5 font-normal">Radio en Vivo</h4>
                    <FooterRadio />
                    <div className="mt-4">
                        <CTAButton href="/contacto" variant="outline" className="w-full !py-2 !text-[13px]">
                            Escríbenos
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className="max-w-[1120px] mx-auto mt-10 pt-5 border-t border-white/10 flex justify-between items-center text-[13px] flex-wrap gap-2">
                <p>© {new Date().getFullYear()} Movimiento Misionero Mundial Chile. Todos los derechos reservados.</p>
                <div className="flex gap-4">
                    <Link href="/privacidad" className="text-white/50 hover:text-[#D4A843] transition-colors">Privacidad</Link>
                    <Link href="/terminos" className="text-white/50 hover:text-[#D4A843] transition-colors">Términos</Link>
                </div>
            </div>
        </footer>
    );
}
