'use client';

import { Search } from "lucide-react";

interface BlogSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function BlogSearch({ searchQuery, setSearchQuery }: BlogSearchProps) {
    return (
        <div className="max-w-[480px] mx-auto mb-5 flex items-center gap-3 bg-white border-2 border-border rounded-xl px-4 focus-within:border-accent transition-colors">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
                type="text"
                placeholder="Buscar artículos..."
                aria-label="Buscar artículos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none text-[15px] py-3 bg-transparent text-foreground placeholder:text-[#B0A99E]"
            />
        </div>
    );
}
