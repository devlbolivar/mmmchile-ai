import { FileText, Headphones, Video, ImageIcon, Download, Clock } from 'lucide-react'
import type { RetreatResource } from '@/lib/data/retiro-damas-2026'

const iconByType = {
    pdf: FileText,
    audio: Headphones,
    video: Video,
    image: ImageIcon,
}

export default function ResourceCard({ resource }: { resource: RetreatResource }) {
    const Icon = iconByType[resource.type]
    const available = Boolean(resource.fileUrl)

    return (
        <div className="flex items-start gap-4 rounded-xl border border-[#1E3A5F]/10 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1E3A5F]/5 text-[#1E3A5F]">
                <Icon size={20} />
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[#2D2D2D]">{resource.title}</h3>
                <p className="mt-1 text-sm text-[#6B7280]">{resource.description}</p>
            </div>

            {available ? (
                <a
                    href={resource.fileUrl}
                    download
                    className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1E3A5F] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a5280]"
                >
                    <Download size={15} />
                    Descargar
                </a>
            ) : (
                <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#F8F6F0] px-3 py-2 text-sm font-medium text-[#6B7280]">
                    <Clock size={15} />
                    Próximamente
                </span>
            )}
        </div>
    )
}
