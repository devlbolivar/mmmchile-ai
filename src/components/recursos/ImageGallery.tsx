import Image from 'next/image'
import { Download } from 'lucide-react'
import type { RetreatImage } from '@/lib/data/retiro-damas-2026'

export default function ImageGallery({ images }: { images: RetreatImage[] }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {images.map((image) => (
                <div
                    key={image.id}
                    className="relative overflow-hidden rounded-xl border border-[#1E3A5F]/10 bg-white shadow-sm"
                >
                    <a href={image.src} target="_blank" rel="noopener noreferrer" className="block">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            className="w-full h-auto"
                        />
                    </a>

                    <a
                        href={image.src}
                        download={`${image.id}.jpg`}
                        aria-label={`Descargar imagen: ${image.alt}`}
                        className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E3A5F]/70 text-white backdrop-blur-sm transition-colors hover:bg-[#D4A843]"
                    >
                        <Download size={20} />
                    </a>
                </div>
            ))}
        </div>
    )
}
