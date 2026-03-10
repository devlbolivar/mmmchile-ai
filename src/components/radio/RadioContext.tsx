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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const streamUrl =
        process.env.NEXT_PUBLIC_RADIO_STREAM_URL ?? 'https://radio.mmmchile.cl/stream';

    const play = useCallback(() => {
        if (!audioRef.current) return;
        setHasError(false);
        setIsLoading(true);
        setIsVisible(true);
        audioRef.current.src = `${streamUrl}?t=${Date.now()}`;
        audioRef.current.volume = volume;
        audioRef.current.play().catch(() => {
            setIsLoading(false);
            setHasError(true);
        });
    }, [volume, streamUrl]);

    const pause = useCallback(() => {
        if (!audioRef.current) return;
        stoppingRef.current = true; // prevents onError from treating this as a real error
        audioRef.current.pause();
        audioRef.current.src = '';
        setIsPlaying(false);
        setIsLoading(false);
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) pause(); else play();
    }, [isPlaying, play, pause]);

    const close = useCallback(() => {
        pause();
        setIsVisible(false);
        setIsMinimized(false);
    }, [pause]);

    /* Sync volume to audio element */
    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

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
                onPlaying={() => { setIsPlaying(true); setIsLoading(false); }}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                    if (stoppingRef.current) { stoppingRef.current = false; return; }
                    setIsLoading(false); setHasError(true); setIsPlaying(false);
                }}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
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
