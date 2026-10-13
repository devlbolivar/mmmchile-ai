'use client'

import * as LucideIcons from 'lucide-react'
import { DoctrinePoint } from '@/lib/data/doctrine'

interface DoctrineCardProps {
    doctrine: DoctrinePoint
    isExpanded: boolean
    onToggle: () => void
}

export default function DoctrineCard({ doctrine, isExpanded, onToggle }: DoctrineCardProps) {
    const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[doctrine.icon] || LucideIcons.HelpCircle

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
        }
    }

    return (
        <div
            id={doctrine.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 scroll-mt-24 transition-all duration-300 hover:shadow-md"
        >
            <div
                className="p-5 md:p-6 flex items-start gap-4 cursor-pointer hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#D4A843] focus:ring-inset transition-colors"
                onClick={onToggle}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-controls={`sect-${doctrine.id}`}
            >
                <div className="bg-[#1E3A5F]/10 p-3 rounded-lg text-[#1E3A5F] shrink-0 mt-1">
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1 md:mb-2">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1E3A5F]">
                            {doctrine.order}. {doctrine.title}
                        </h3>
                        <div className={`text-[#D4A843] transition-transform duration-300 ml-4 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                            <LucideIcons.ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </div>
                    <p className="text-[#6B7280] text-sm md:text-base">{doctrine.bibleReferences.join(' ')}</p>
                </div>
            </div>

            <div
                id={`sect-${doctrine.id}`}
                className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                aria-hidden={!isExpanded}
            >
                <div className="overflow-hidden">
                    <div className="p-5 md:p-6 pt-0 border-t border-gray-100 mt-2">
                        <p className="text-[#6B7280] leading-relaxed mb-6 mt-4">
                            {doctrine.fullExplanation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
