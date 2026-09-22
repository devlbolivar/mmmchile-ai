'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

/* ── Types ── */
export interface RadioContextValue {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    isPlaying: boolean;
    isLoading: boolean;
    hasError: boolean;
    volume: number;
    isVisible: boolean;
    isMinimized: boolean;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    close: () => void;
    setVolume: (v: number) => void;
    setIsMinimized: (v: boolean) => void;
    setIsVisible: (v: boolean) => void;
}

/* ── Context ── */
const RadioContext = createContext<RadioContextValue | null>(null);

/* ── Provider ── */
export function RadioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    /** Set true when we intentionally clear src (pause) so onError is ignored. */
    const stoppingRef = useRef(false);
    const playAttemptRef = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const streamUrl =
        process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? 'https://s48.radiolize.com/radio/8000/radio.mp3';

    const play = useCallback(() => {
        if (!audioRef.current) return;
        const attempt = ++playAttemptRef.current;
        stoppingRef.current = false;
        setHasError(false);
        setIsPlaying(false);
        setIsLoading(true);
        setIsVisible(true);
        const url = new URL(streamUrl, window.location.origin);
        url.searchParams.set('t', String(Date.now()));
        audioRef.current.src = url.href;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {
            // A cancelled or superseded attempt must not show a false error.
            if (attempt !== playAttemptRef.current || stoppingRef.current) return;
            setIsLoading(false);
            setHasError(true);
        });
    }, [volume, streamUrl]);

    const pause = useCallback(() => {
        if (!audioRef.current) return;
        ++playAttemptRef.current;
        stoppingRef.current = true; // prevents onError from treating this as a real error
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(false);
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying || isLoading) pause(); else play();
    }, [isPlaying, isLoading, play, pause]);

    const close = useCallback(() => {
        pause();
        setIsVisible(false);
        setIsMinimized(false);
    }, [pause]);

    /* Sync volume to audio element */
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) return;
        const session = navigator.mediaSession;
        const handlers: [MediaSessionAction, () => void][] = [['play', play], ['pause', pause], ['stop', pause]];
        for (const [action, handler] of handlers) {
            try { session.setActionHandler(action, handler); } catch { /* Unsupported action. */ }
        }
        return () => {
            for (const [action] of handlers) {
                try { session.setActionHandler(action, null); } catch { /* Unsupported action. */ }
            }
        };
    }, [play, pause]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) return;
        if (isPlaying && 'MediaMetadata' in window) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'Radio Bethel Chile',
                artist: 'Música y la Palabra de Dios',
                album: 'Transmisión en vivo',
                artwork: [192, 512].map((size) => ({ src: `${window.location.origin}/radio/icons/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
            });
        }
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }, [isPlaying]);

    return (
        <RadioContext.Provider value={{
            audioRef, isPlaying, isLoading, hasError, volume,
            isVisible, isMinimized,
            play, pause, toggle, close,
            setVolume, setIsMinimized, setIsVisible,
        }}>
            {/* Single shared <audio> element for the whole app */}
            <audio
                ref={audioRef}
                preload="none"
                playsInline
                onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                    if (stoppingRef.current) return;
                    setIsLoading(false); setHasError(true); setIsPlaying(false);
                }}
                onWaiting={() => { if (!stoppingRef.current) setIsLoading(true); }}
                onCanPlay={() => setIsLoading(false)}
                onEnded={() => { setIsPlaying(false); setIsLoading(false); if (!stoppingRef.current) setHasError(true); }}
            />
            {children}
        </RadioContext.Provider>
    );
}

/* ── Hook ── */
export function useRadio(): RadioContextValue {
    const ctx = useContext(RadioContext);
    if (!ctx) throw new Error('useRadio must be used inside <RadioProvider>');
    return ctx;
}
