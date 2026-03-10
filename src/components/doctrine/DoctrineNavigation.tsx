'use client'

import { useState, useEffect, useRef } from 'react'
import { DoctrinePoint } from '@/lib/data/doctrine'

export default function DoctrineNavigation({ doctrines }: { doctrines: DoctrinePoint[] }) {
    const [activeId, setActiveId] = useState<string>(doctrines[0]?.id || '')
    const isScrollingByClick = useRef(false)
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingByClick.current) return

            const scrollPosition = window.scrollY + 150

            let matchedId = doctrines[0]?.id

            for (let i = doctrines.length - 1; i >= 0; i--) {
                const element = document.getElementById(doctrines[i].id)
                if (element && element.offsetTop <= scrollPosition) {
                    matchedId = doctrines[i].id
                    break
                }
            }

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
                matchedId = doctrines[doctrines.length - 1].id;
            }

            if (matchedId) {
                setActiveId(matchedId)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll() // Init

        return () => window.removeEventListener('scroll', handleScroll)
    }, [doctrines])

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement> | React.ChangeEvent<HTMLSelectElement>, id: string) => {
        if ('preventDefault' in e) e.preventDefault()

        const element = document.getElementById(id)
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100
            isScrollingByClick.current = true
            setActiveId(id)
            window.scrollTo({ top: y, behavior: 'smooth' })

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
            scrollTimeout.current = setTimeout(() => {
                isScrollingByClick.current = false
            }, 800)
        }
    }

    return (
        <div className="sticky top-24 z-10 w-full mb-8 md:mb-0">
            {/* Mobile Select */}
            <div className="md:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                <label htmlFor="doctrine-select" className="sr-only">Seleccionar punto de fe</label>
                <select
                    id="doctrine-select"
                    className="w-full p-3 border-none bg-transparent text-[#1E3A5F] font-semibold focus:ring-2 focus:ring-[#D4A843] rounded-lg outline-none"
                    value={activeId}
                    onChange={(e) => {
                        const id = e.target.value
                        handleClick(e, id)
                    }}
                >
                    {doctrines.map((doctrine) => (
                        <option key={doctrine.id} value={doctrine.id}>
                            {doctrine.order}. {doctrine.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-serif font-bold text-xl text-[#1E3A5F] mb-4 pb-3 border-b border-gray-100">
                    Índice Doctrínal
                </h3>
                <ul className="space-y-1">
                    {doctrines.map((doctrine) => (
                        <li key={doctrine.id}>
                            <a
                                href={`#${doctrine.id}`}
                                onClick={(e) => handleClick(e, doctrine.id)}
                                className={`block py-2.5 px-3 rounded-lg text-sm transition-colors border-l-4 ${activeId === doctrine.id
                                    ? 'bg-[#1E3A5F]/5 text-[#1E3A5F] font-semibold border-[#D4A843]'
                                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#2D2D2D] border-transparent'
                                    }`}
                            >
                                {doctrine.order}. {doctrine.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
