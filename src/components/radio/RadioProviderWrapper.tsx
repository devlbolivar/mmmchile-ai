'use client';

import { type ReactNode } from 'react';
import { RadioProvider } from './RadioContext';
import FloatingRadioPlayer from './FloatingRadioPlayer';

/**
 * Client-boundary wrapper used by app/layout.tsx (Server Component).
 * Provides RadioContext to the whole app and renders the floating player.
 */
export default function RadioProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <RadioProvider>
            {children}
            <FloatingRadioPlayer />
        </RadioProvider>
    );
}
