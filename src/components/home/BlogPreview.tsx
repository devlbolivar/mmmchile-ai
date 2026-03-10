import React from 'react';
import Link from 'next/link';
import CTAButton from '../shared/CTAButton';
import { sanityFetch } from '@/lib/sanity/client';
import { GET_LATEST_POSTS_QUERY } from '@/lib/sanity/queries';
import { BlogPost } from '@/lib/mock-data/blog';

const ArrowRight = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);

export default async function BlogPreview() {
    const blogs = await sanityFetch<BlogPost[]>({ query: GET_LATEST_POSTS_QUERY });

    return (
        <section className="py-[100px] px-6 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="font-serif text-[clamp(28px,4vw,42px)] text-[#1E3A5F] mb-3">
                        Reflexiones para Tu Vida
                    </h2>
                    <p className="text-[#6B7280] text-[17px] max-w-[520px] mx-auto font-normal">
                        Artículos que responden preguntas reales con esperanza real
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {blogs.map((b, i) => {
                        const bgStyle = { background: "linear-gradient(135deg, #1E3A5F 0%, #2a5280 100%)" }; // Default gradient since image support isn't ready

                        return (
                            <Link href={`/blog/${b.slug}`} key={b._id || i} className="group block">
                                <div className="rounded-[16px] overflow-hidden bg-white border border-[#E8E4DC] transition-all duration-350 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full flex flex-col">
                                    <div className="h-[200px] relative overflow-hidden shrink-0">
                                        <div
                                            className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                                            style={bgStyle}
                                        >
                                            <span className="font-serif text-[48px] text-white/10">✦</span>
                                        </div>
                                        {b.category && (
                                            <span className="absolute top-3.5 left-3.5 z-10 bg-[#0F2035]/85 text-[#D4A843] px-3 py-1 rounded-full text-[12px] font-semibold tracking-[0.5px] backdrop-blur-[4px]" style={b.category.color ? { backgroundColor: b.category.color } : {}}>
                                                {b.category.title}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col grow">
                                        <h3 className="font-serif text-[20px] text-[#1E3A5F] mb-2 leading-[1.35]">
                                            {b.title}
                                        </h3>
                                        <p className="text-[#6B7280] text-[14px] leading-[1.6] mb-4 grow">
                                            {b.excerpt}
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 text-[#D4A843] font-semibold text-[14px] transition-all duration-300 group-hover:gap-2.5 mt-auto">
                                            Leer más <ArrowRight />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="text-center mt-11">
                    <CTAButton href="/blog" variant="primary" className="!px-7 !py-3.5">
                        Ver todos los artículos →
                    </CTAButton>
                </div>
            </div>
        </section>
    );
}
