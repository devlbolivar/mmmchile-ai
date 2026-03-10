'use client';

import { useState, useMemo } from "react";
import { BlogPost, SanityCategory } from "@/lib/mock-data/blog";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogSearch from "@/components/blog/BlogSearch";
import FeaturedPost from "@/components/blog/FeaturedPost";
import ArticleCard from "@/components/blog/ArticleCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function BlogClient({ posts, categories }: { posts: BlogPost[], categories: SanityCategory[] }) {
    const [activeCategory, setActiveCategory] = useState("todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleCount, setVisibleCount] = useState(6);

    const featured = posts.find((p) => p.featured);
    const rest = posts.filter((p) => p._id !== featured?._id);

    const filtered = useMemo(() => {
        let list = rest;
        if (activeCategory !== "todos") {
            list = list.filter((a) => a.category.slug === activeCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.excerpt.toLowerCase().includes(q) ||
                    a.category.title.toLowerCase().includes(q)
            );
        }
        return list;
    }, [activeCategory, searchQuery, rest]);

    const popular = [...posts]
        .sort((a, b) => (a.readTime || 0) - (b.readTime || 0))
        .slice(0, 5);

    return (
        <div className="bg-[#F8F6F0] min-h-screen pb-16">
            {/* HERO SECTION */}
            <section className="pt-16 pb-12 px-6 text-center max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex justify-center mb-6">
                    <Breadcrumb items={[{ label: 'Blog' }]} />
                </div>

                <h1 className="font-serif text-[clamp(28px,5vw,44px)] text-primary font-semibold mb-3">
                    Reflexiones para Tu Vida
                </h1>
                <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Artículos sobre fe, esperanza y respuestas a las preguntas que todos nos hacemos en algún momento del camino.
                </p>

                <BlogSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <div className="mt-8">
                    <CategoryFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                    />
                </div>
            </section>

            {/* MAIN LAYOUT */}
            <section className="max-w-[1200px] mx-auto px-6 flex flex-col gap-10">

                {/* FEATURED POST (Full width above grid/sidebar) */}
                {activeCategory === "todos" && !searchQuery && featured && (
                    <FeaturedPost post={featured} />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
                    {/* LEFT COLUMN: GRID */}
                    <div className="flex flex-col gap-10">

                        {/* GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.slice(0, visibleCount).map((post) => (
                                <ArticleCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* EMPTY STATE */}
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground w-full col-span-full">
                                <div className="text-5xl mb-4 opacity-30">🔍</div>
                                <p className="font-bold text-lg text-primary">No encontramos artículos con esa búsqueda</p>
                                <p className="mt-1">Intenta con otras palabras o explora las categorías</p>
                            </div>
                        )}

                        {/* LOAD MORE */}
                        {visibleCount < filtered.length && (
                            <div className="text-center py-8">
                                <button
                                    onClick={() => setVisibleCount((v) => v + 6)}
                                    className="px-8 py-3.5 bg-white border-2 border-border rounded-xl font-bold text-primary hover:border-accent hover:text-accent transition-colors"
                                >
                                    Cargar más artículos
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR */}
                    <aside className="lg:block">
                        <div className="sticky top-24">
                            <BlogSidebar popularPosts={popular} />
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}
