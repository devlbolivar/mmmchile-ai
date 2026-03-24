import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/mock-data/blog";
import { Clock } from "lucide-react";
import { urlForImage } from "@/lib/sanity/image";

interface ArticleCardProps {
    post: BlogPost;
}

export default function ArticleCard({ post }: ArticleCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col bg-white border border-border rounded-2xl overflow-hidden hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative h-[180px] overflow-hidden shrink-0 w-full bg-muted">
                {post.coverImage ? (
                    <Image
                        src={urlForImage(post.coverImage).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                        style={{ background: post.coverGradient || "var(--primary)" }}
                    >
                        <span className="font-serif text-[56px] text-white/5 select-none">✦</span>
                    </div>
                )}
                <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider text-white z-10"
                    style={{ background: post.category.color }}
                >
                    {post.category.title}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-[17px] text-primary leading-snug mb-2 font-semibold group-hover:text-accent transition-colors">
                    {post.title}
                </h3>

                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-2 pb-1 flex-1">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-auto">
                    <span className="flex items-center gap-1">
                        <Clock className="w-[14px] h-[14px]" />
                        {post.readTime || 5} min
                    </span>
                    <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30" />
                    <span>
                        {new Date(post.publishedAt).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                </div>
            </div>
        </Link>
    );
}
