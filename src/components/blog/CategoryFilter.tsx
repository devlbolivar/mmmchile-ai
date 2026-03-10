'use client';

import { SanityCategory } from "@/lib/mock-data/blog";

interface CategoryFilterProps {
    categories: SanityCategory[];
    activeCategory: string;
    onSelectCategory: (slug: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-8">
            <button
                onClick={() => onSelectCategory("todos")}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${activeCategory === "todos"
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-muted-foreground hover:border-accent hover:text-primary"
                    }`}
            >
                Todos
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.slug}
                    onClick={() => onSelectCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${activeCategory === cat.slug
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-white text-muted-foreground hover:border-accent hover:text-primary"
                        }`}
                >
                    {cat.title}
                </button>
            ))}
        </div>
    );
}
