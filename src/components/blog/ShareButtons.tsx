'use client';

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export default function ShareButtons({ title, url: propUrl }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(propUrl || window.location.href);
        }
    }, [propUrl]);

    const handleCopy = () => {
        if (currentUrl) {
            navigator.clipboard?.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareWA = () => {
        if (currentUrl) {
            const url = `https://wa.me/?text=${encodeURIComponent("Lee este artículo: " + title + " → " + currentUrl)}`;
            window.open(url, "_blank");
        }
    };

    const shareFB = () => {
        if (currentUrl) {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
            window.open(url, "_blank");
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4 pb-8 border-b border-border max-w-[740px] mx-auto flex-wrap">
            <button
                onClick={shareWA}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold hover:-translate-y-[1px] transition-all bg-[#25D366]/10 text-[#1a9e4a]"
            >
                WhatsApp
            </button>
            <button
                onClick={shareFB}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold hover:-translate-y-[1px] transition-all bg-[#1877F2]/10 text-[#1877F2]"
            >
                Facebook
            </button>
            <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold hover:-translate-y-[1px] transition-all ${copied ? "bg-accent text-primary-foreground" : "bg-primary/5 text-primary"
                    }`}
            >
                <Link2 className="w-3.5 h-3.5" />
                {copied ? "¡Copiado!" : "Copiar link"}
            </button>
        </div>
    );
}
