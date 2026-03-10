import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const categoryLabels: Record<string, string> = {
    sanidad: "Sanidad",
    restauracion: "Restauración Familiar",
    provision: "Provisión",
    liberacion: "Liberación",
    salvacion: "Salvación",
    otro: "Otro"
};

export default function TestimonyCard({ testimony }: { testimony: any }) {
    const getInitials = (name: string) => {
        return name.slice(0, 1).toUpperCase();
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-[#E8E4DC] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 h-full flex flex-col relative overflow-hidden group">
            {/* Categoria Badge */}
            <div className="absolute top-4 left-4 z-10 bg-primary/95 text-accent px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm">
                {categoryLabels[testimony.category] || categoryLabels.otro}
            </div>

            <div className="flex flex-col items-center mt-6 flex-grow">
                {/* Avatar O Foto */}
                {testimony.imageUrl && testimony.imageUrl !== '/placeholder.svg' ? (
                    <div className="w-20 h-20 rounded-full mb-5 relative overflow-hidden shadow-[0_4px_15px_rgba(30,58,95,0.2)]">
                        <Image
                            src={typeof testimony.imageUrl === 'string' ? testimony.imageUrl : testimony.imageUrl?.asset?.url || '/placeholder.svg'}
                            alt={`Foto de ${testimony.author}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-full mb-5 bg-gradient-to-br from-primary to-[#2a5280] flex items-center justify-center text-white font-serif text-3xl shadow-[0_4px_15px_rgba(30,58,95,0.2)]">
                        {getInitials(testimony.author || 'M')}
                    </div>
                )}

                {/* Cita */}
                <div className="italic text-lg text-text leading-relaxed mb-4 relative z-0">
                    <span className="font-serif text-5xl text-accent/30 absolute -top-4 -left-3 leading-none -z-10">&quot;</span>
                    {testimony.excerpt || testimony.shortVersion}
                </div>

                {/* Nombre / Ubicacion */}
                <div className="font-semibold text-primary text-base mt-2">
                    {testimony.author}
                    {testimony.location && `, ${testimony.location}`}
                </div>
            </div>

            {/* Link */}
            <div className="mt-6 flex justify-center">
                <Link
                    href={`/testimonios/${testimony.slug}`}
                    className="inline-flex items-center gap-2 text-accent font-semibold text-sm transition-all group-hover:gap-3"
                >
                    Leer historia completa <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
