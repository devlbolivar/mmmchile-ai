'use client';

import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";

interface ShareButtonsProps {
    title: string;
    url?: string;
    description?: string;
}

export default function ShareButtons({ title, url: propUrl, description }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [mountedUrl, setMountedUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined" && !propUrl) {
            setMountedUrl(window.location.href);
        }
    }, [propUrl]);

    const activeUrl = propUrl || mountedUrl;

    const handleCopy = () => {
        if (activeUrl) {
            navigator.clipboard?.writeText(activeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWhatsAppShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!activeUrl) { e.preventDefault(); return; }
        e.preventDefault();
        const text = description
            ? `${title}\n\n${description}\n\n${activeUrl}`
            : `${title}\n\n${activeUrl}`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    };

    const fbAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const fbWebUrl = activeUrl
        ? fbAppId
            ? `https://www.facebook.com/dialog/share?app_id=${fbAppId}&href=${encodeURIComponent(activeUrl)}&display=popup`
            : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(activeUrl)}`
        : '#';

    const handleFacebookShare = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!activeUrl) return;

        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            try {
                await navigator.share({ title, text: description, url: activeUrl });
            } catch {
                // usuario canceló
            }
        } else {
            window.open(fbWebUrl, '_blank', 'width=600,height=400');
        }
    };
        
    return (
        <div className="flex items-center justify-center gap-2 mt-4 pb-8 border-b border-border max-w-[740px] mx-auto flex-wrap">
            <a
                href="#"
                rel="noopener noreferrer"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold hover:-translate-y-[1px] transition-all bg-[#25D366]/10 text-[#1a9e4a]"
            >
                WhatsApp
            </a>
            <a
                href={fbWebUrl}
                rel="noopener noreferrer"
                onClick={handleFacebookShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold hover:-translate-y-[1px] transition-all bg-[#1877F2]/10 text-[#1877F2]"
            >
                Facebook
            </a>
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
