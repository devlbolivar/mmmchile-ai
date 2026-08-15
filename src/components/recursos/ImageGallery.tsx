import Image from 'next/image'
import type { RetreatImage } from '@/lib/data/retiro-damas-2026'

export default function ImageGallery({ images }: { images: RetreatImage[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-xl border border-[#1E3A5F]/10 bg-white shadow-sm">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        width={800}
                        height={800}
                        className="w-full h-auto"
                    />
                </div>
            ))}
        </div>
    )
}
