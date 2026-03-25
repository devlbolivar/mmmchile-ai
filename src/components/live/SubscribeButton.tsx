'use client';

import { trackEvent } from '@/lib/analytics';

interface SubscribeButtonProps {
    channelUrl: string;
}

export default function SubscribeButton({ channelUrl }: SubscribeButtonProps) {
    const handleClick = () => {
        trackEvent('live_subscribe_click', {
            event_category: 'live',
        });
    };

    return (
        <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label="Suscribirme al canal de YouTube de MMM Chile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13px] font-medium transition-all duration-300 hover:brightness-90 hover:-translate-y-px"
            style={{
                background: '#FF0000',
                fontFamily: 'DM Sans, sans-serif',
                textDecoration: 'none',
            }}
        >
            <svg
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Suscribirme al canal
        </a>
    );
}
