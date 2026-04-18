import { BlogPost } from "@/lib/mock-data/blog";
import { Clock } from "lucide-react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

interface ArticleHeaderProps {
    post: BlogPost;
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
    return (
        <div className="max-w-[740px] mx-auto px-6 pt-10 text-center">
            {post.category && (
                <span
                    className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wider text-white mb-4"
                    style={{ background: post.category.color || "var(--accent)" }}
                >
                    {post.category.title}
                </span>
            )}

            <h1 className="font-serif text-[clamp(28px,5vw,44px)] text-primary leading-tight mb-5 font-semibold">
                {post.title}
            </h1>

            <div className="flex items-center justify-center gap-4 flex-wrap text-[13px] text-muted-foreground mb-3">
                {post.author?.photo ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border">
                        <Image
                            src={urlForImage(post.author.photo).url()}
                            alt={post.author.name || "Foto del autor"}
                            fill
                            className="object-cover"
                            sizes="40px"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold bg-primary shrink-0">
                        {post.author?.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </div>
                )}
                <span className="font-bold text-foreground">{post.author?.name}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30" />
                <span>
                    {new Date(post.publishedAt).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="w-[3px] h-[3px] rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1.5">
                    <Clock className="w-[14px] h-[14px]" />
                    {post.readTime || 5} min lectura
                </span>
            </div>
        </div>
    );
}
