import { BlogPost } from "@/lib/mock-data/blog";
import ArticleCard from "./ArticleCard";

interface RelatedPostsProps {
    posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="max-w-[900px] mx-auto my-12 px-6 pb-16">
            <h3 className="font-serif text-2xl text-primary mb-6 text-center font-semibold">
                Artículos Relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {posts.map(post => (
                    <ArticleCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}
