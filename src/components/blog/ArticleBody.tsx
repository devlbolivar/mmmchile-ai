import { BlogPost } from "@/lib/mock-data/blog";
import { CustomPortableText } from "@/lib/sanity/portable-text";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity/image";

interface ArticleBodyProps {
    post: BlogPost;
}

export default function ArticleBody({ post }: ArticleBodyProps) {
    const content = post.body;

    if (!content) return null;

    return (
        <div className="max-w-[700px] mx-auto px-6 py-10">
            <div className="prose prose-lg prose-[#1E3A5F] max-w-none">
                <CustomPortableText value={content} />
            </div>

            {/* AUTHOR BIO */}
            <div className="max-w-[700px] mx-auto mt-12 p-8 flex flex-col sm:flex-row gap-5 items-center bg-white border border-border rounded-2xl text-center sm:text-left">
                {post.author?.photo ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border">
                        <Image
                            src={urlForImage(post.author.photo).url()}
                            alt={post.author.name || "Foto del autor"}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-serif text-[24px] shrink-0 bg-gradient-to-br from-primary to-[#2a5280]">
                        {post.author?.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                    </div>
                )}
                <div>
                    <div className="font-extrabold text-[16px] text-primary">{post.author?.name}</div>
                    <div className="text-[13px] text-muted-foreground mt-0.5">{post.author?.role}</div>
                </div>
            </div>
        </div>
    );
}
