import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    /** Light variant for pages with dark/colored header areas */
    variant?: 'light' | 'dark';
}

export default function Breadcrumb({ items, variant = 'dark' }: BreadcrumbProps) {
    const allItems: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }, ...items];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? { item: `https://mmmchile.cl${item.href}` } : {}),
        })),
    };

    const isLight = variant === 'light';

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="w-full">
                <ol className="flex items-center flex-wrap gap-1">
                    {allItems.map((item, index) => {
                        const isLast = index === allItems.length - 1;
                        const isFirst = index === 0;

                        return (
                            <li key={index} className="flex items-center gap-1">
                                {isFirst ? (
                                    <span
                                        className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isLight
                                                ? 'text-white/60 hover:text-white/90'
                                                : 'text-[#6B7280] hover:text-[#1E3A5F]'
                                            }`}
                                    >
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className={`flex items-center gap-1 transition-colors ${isLight
                                                        ? 'text-white/60 hover:text-white/90'
                                                        : 'text-[#6B7280] hover:text-[#1E3A5F]'
                                                    }`}
                                            >
                                                <Home size={12} />
                                                <span>{item.label}</span>
                                            </Link>
                                        ) : (
                                            <>
                                                <Home size={12} />
                                                <span>{item.label}</span>
                                            </>
                                        )}
                                    </span>
                                ) : (
                                    <>
                                        <ChevronRight
                                            size={12}
                                            className={isLight ? 'text-white/40' : 'text-[#9CA3AF]'}
                                        />
                                        {!isLast && item.href ? (
                                            <Link
                                                href={item.href}
                                                className={`text-xs font-semibold transition-colors ${isLight
                                                        ? 'text-white/60 hover:text-white/90'
                                                        : 'text-[#6B7280] hover:text-[#1E3A5F]'
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span
                                                className={`text-xs font-semibold ${isLight ? 'text-white/90' : 'text-[#1E3A5F]'
                                                    }`}
                                                aria-current="page"
                                            >
                                                {item.label}
                                            </span>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
