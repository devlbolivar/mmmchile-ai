import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/mock-data/blog";
import { ArrowRight, Clock } from "lucide-react";
import { urlForImage } from "@/lib/sanity/image";

interface FeaturedPostProps {
    post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 md:grid-cols-[1.2fr_1fr] min-h-[340px] bg-white border border-border rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative overflow-hidden h-[220px] md:h-auto w-full bg-muted">
                {post.coverImage ? (
                    <Image 
                        src={urlForImage(post.coverImage).url()} 
                        alt={post.title} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ background: post.coverGradient || "var(--primary)" }}
                    >
                        <span className="font-serif text-[100px] text-white/5 select-none">✦</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center p-8 md:p-9">
                {post.category && (
                    <span
                        className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider text-white mb-4 w-fit"
                        style={{ background: post.category.color || "#0F2035" }}
                    >
                        {post.category.title}
                    </span>
                )}

                <h2 className="font-serif text-2xl md:text-3xl text-primary leading-tight mb-3 font-semibold decoration-accent group-hover:underline">
                    {post.title}
                </h2>

                <p className="text-[15px] text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold bg-primary shrink-0">
                        {post.author?.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </div>
                    <div>
                        <div className="font-bold text-foreground">{post.author?.name}</div>
                        <div className="flex items-center gap-1.5">
                            {new Date(post.publishedAt).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                            <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30" />
                            <Clock className="w-3 h-3" /> {post.readTime || 5} min lectura
                        </div>
                    </div>
                </div>

                <span className="inline-flex items-center gap-1.5 text-accent font-bold text-sm mt-4 transition-all duration-300 group-hover:gap-2.5">
                    Leer artículo <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </Link>
    );
}
