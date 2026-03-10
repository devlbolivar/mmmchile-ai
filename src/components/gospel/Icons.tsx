export const ChevronDown = ({ color = "currentColor", size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);
export const PlayCircle = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
);
export const ShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);

export const HandsLight = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
        <circle cx="60" cy="60" r="40" fill="url(#glowA)" />
        <ellipse cx="60" cy="68" rx="26" ry="12" fill="none" stroke="#D4A843" strokeWidth="1.2" opacity="0.5" />
        <path d="M44 68 Q44 52 60 42 Q76 52 76 68" fill="none" stroke="#D4A843" strokeWidth="1.5" />
        <circle cx="60" cy="50" r="8" fill="#D4A843" opacity="0.15" />
        <circle cx="60" cy="50" r="3" fill="#D4A843" opacity="0.4" />
        <defs><radialGradient id="glowA"><stop offset="0%" stopColor="#D4A843" stopOpacity="0.15" /><stop offset="100%" stopColor="#D4A843" stopOpacity="0" /></radialGradient></defs>
    </svg>
);
export const BrokenVessel = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
        <circle cx="60" cy="60" r="40" fill="url(#glowB)" />
        <path d="M45 40 L45 80 Q45 90 60 90 Q75 90 75 80 L75 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M55 40 L58 55 L52 65 L60 75" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <path d="M65 42 L62 58 L68 68" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <defs><radialGradient id="glowB"><stop offset="0%" stopColor="rgba(180,180,200,0.12)" /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
    </svg>
);
export const CrossLight = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.7 }}>
        <circle cx="60" cy="60" r="45" fill="url(#glowC)" />
        <line x1="60" y1="25" x2="60" y2="95" stroke="#D4A843" strokeWidth="2" opacity="0.5" />
        <line x1="38" y1="48" x2="82" y2="48" stroke="#D4A843" strokeWidth="2" opacity="0.5" />
        {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="60" y1="60" x2={60 + Math.cos(i * Math.PI / 3) * 40} y2={60 + Math.sin(i * Math.PI / 3) * 40}
                stroke="#D4A843" strokeWidth="0.5" opacity="0.2" />
        ))}
        <defs><radialGradient id="glowC"><stop offset="0%" stopColor="#D4A843" stopOpacity="0.2" /><stop offset="100%" stopColor="#D4A843" stopOpacity="0" /></radialGradient></defs>
    </svg>
);
export const SunriseIcon = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.7 }}>
        <circle cx="60" cy="60" r="45" fill="url(#glowD)" />
        <path d="M20 80 Q60 50 100 80" fill="none" stroke="#D4A843" strokeWidth="1.5" opacity="0.4" />
        <circle cx="60" cy="58" r="14" fill="#D4A843" opacity="0.12" />
        <circle cx="60" cy="58" r="8" fill="#D4A843" opacity="0.25" />
        {[...Array(8)].map((_, i) => {
            const a = (i * Math.PI) / 4 - Math.PI / 2;
            return <line key={i} x1={60 + Math.cos(a) * 20} y1={58 + Math.sin(a) * 20} x2={60 + Math.cos(a) * 32} y2={58 + Math.sin(a) * 32} stroke="#D4A843" strokeWidth="1" opacity="0.3" />;
        })}
        <defs><radialGradient id="glowD"><stop offset="0%" stopColor="#D4A843" stopOpacity="0.18" /><stop offset="100%" stopColor="#D4A843" stopOpacity="0" /></radialGradient></defs>
    </svg>
);
