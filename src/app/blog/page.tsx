import { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { GET_ALL_POSTS_QUERY, GET_ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries";
import BlogClient from "./BlogClient";

// Temporary import for typing until we migrate fully
import { BlogPost, SanityCategory } from "@/lib/mock-data/blog";

export const metadata: Metadata = {
    title: "Blog Cristiano | Edificando tu Fe",
    description: "Artículos, estudios bíblicos y testimonios para fortalecer tu vida espiritual. Contenido fresco cada semana.",
    alternates: {
        canonical: '/blog',
    },
};

export default async function BlogPage() {
    const posts = await sanityFetch<BlogPost[]>({ query: GET_ALL_POSTS_QUERY });
    const categories = await sanityFetch<SanityCategory[]>({ query: GET_ALL_CATEGORIES_QUERY });

    return <BlogClient posts={posts} categories={categories} />;
}
