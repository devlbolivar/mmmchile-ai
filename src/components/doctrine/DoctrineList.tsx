'use client'

import { useState } from 'react'
import { DoctrinePoint } from '@/lib/data/doctrine'
import DoctrineCard from './DoctrineCard'

export default function DoctrineList({ doctrines }: { doctrines: DoctrinePoint[] }) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(
        new Set([doctrines[0]?.id])
    )

    const allExpanded = expandedIds.size === doctrines.length

    const toggleAll = () => {
        if (allExpanded) {
            setExpandedIds(new Set())
        } else {
            setExpandedIds(new Set(doctrines.map((d) => d.id)))
        }
    }

    const toggle = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={toggleAll}
                    className="text-sm text-[#1E3A5F] font-semibold hover:text-[#D4A843] transition-colors underline underline-offset-2 decoration-dotted"
                >
                    {allExpanded ? 'Colapsar todo' : 'Expandir todo'}
                </button>
            </div>
            {doctrines.map((doctrine) => (
                <DoctrineCard
                    key={doctrine.id}
                    doctrine={doctrine}
                    isExpanded={expandedIds.has(doctrine.id)}
                    onToggle={() => toggle(doctrine.id)}
                />
            ))}
        </div>
    )
}
