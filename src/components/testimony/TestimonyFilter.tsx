'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'sanidad', label: 'Sanidad' },
    { id: 'restauracion', label: 'Restauración Familiar' },
    { id: 'provision', label: 'Provisión' },
    { id: 'liberacion', label: 'Liberación' },
    { id: 'salvacion', label: 'Salvación' },
    { id: 'otro', label: 'Otro' }
];

export default function TestimonyFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('categoria') || 'todos';

    const handleFilter = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId === 'todos') {
            params.delete('categoria');
        } else {
            params.set('categoria', categoryId);
        }

        // Replace current URL with new params without scroll disruption
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => {
                const isActive = currentCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => handleFilter(cat.id)}
                        className={`
              px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
              ${isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-muted border border-[#E8E4DC] hover:border-accent hover:text-primary hover:bg-cream'
                            }
            `}
                    >
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
