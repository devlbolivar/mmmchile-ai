import { Reveal } from "./Reveal";
import Link from "next/link";

export default function GospelShare() {
    return (
        <section className="py-16 px-6 text-center bg-[#1E3A5F] text-white">
            <Reveal>
                <h3 className="font-serif text-[clamp(22px,3.5vw,32px)] mb-6 font-normal">
                    Encuentra una iglesia cerca de ti
                </h3>
                <Link
                    href="/iglesias"
                    className="inline-flex items-center gap-2 py-3.5 px-8 border-2 border-white/40 rounded-xl bg-transparent text-white font-sans text-base font-semibold transition-all hover:border-[#D4A843] hover:text-[#D4A843]"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Buscar iglesia
                </Link>
            </Reveal>

            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
                <span className="text-[14px] text-white/60">
                    ¿Conoces a alguien que necesite leer esto?
                </span>

                <a
                    href="https://api.whatsapp.com/send?text=Acabo%20de%20leer%20algo%20que%20cambi%C3%B3%20mi%20perspectiva.%20Te%20invito%20a%20leerlo%3A%20https%3A%2F%2Fwww.mmmchile.cl%2Fconoce-a-jesus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg border-none bg-[#25D366] text-white font-sans text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                </a>
                <a
                    href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.mmmchile.cl%2Fconoce-a-jesus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg border-none bg-[#1877F2] text-white font-sans text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </a>
            </div>
        </section>
    );
}
