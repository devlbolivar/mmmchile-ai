import Image from 'next/image'
import type { RetreatImage } from '@/lib/data/retiro-damas-2026'

export default function ImageGallery({ images }: { images: RetreatImage[] }) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {images.map((image) => (
                <a
                    key={image.id}
                    href={image.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-[#1E3A5F]/10 bg-white shadow-sm"
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="w-full h-auto"
                    />
                </a>
            ))}
        </div>
    )
}
