'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { RadioProvider } from './RadioContext';
import FloatingRadioPlayer from './FloatingRadioPlayer';

/**
 * Client-boundary wrapper used by app/layout.tsx (Server Component).
 * Provides RadioContext to the whole app and renders the floating player.
 */
export default function RadioProviderWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isRadioApp = pathname === '/radio/app' || pathname.startsWith('/radio/app/');
    return (
        <RadioProvider>
            {children}
            {!isRadioApp && <FloatingRadioPlayer />}
        </RadioProvider>
    );
}
