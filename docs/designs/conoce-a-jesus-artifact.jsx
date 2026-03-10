import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════
// COLORS & DESIGN TOKENS
// ═══════════════════════════════════════════════
const C = {
    primary: "#1E3A5F",
    primaryDark: "#0F2035",
    accent: "#D4A843",
    accentLight: "#E8C976",
    accentPale: "#F5E6C4",
    cream: "#F8F6F0",
    white: "#FFFFFF",
    text: "#2C2C2C",
    textMuted: "#6B7280",
    chapter2Bg: "#2A2A35",
    chapter2Text: "#E8E4DC",
};

// ═══════════════════════════════════════════════
// INTERSECTION OBSERVER HOOK
// ═══════════════════════════════════════════════
function useInView(threshold = 0.18) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

// ═══════════════════════════════════════════════
// ANIMATED WRAPPER
// ═══════════════════════════════════════════════
const Reveal = ({ children, delay = 0, y = 50, style = {} }) => {
    const [ref, visible] = useInView(0.1);
    return (
        <div ref={ref} style={{
            ...style,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : `translateY(${y}px)`,
            transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}>{children}</div>
    );
};

// ═══════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════
const ChevronDown = ({ color = "currentColor", size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const PlayCircle = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
);
const ShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);

// Cross-shaped light SVG illustrations for chapters
const HandsLight = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
        <circle cx="60" cy="60" r="40" fill="url(#glowA)" />
        <ellipse cx="60" cy="68" rx="26" ry="12" fill="none" stroke={C.accent} strokeWidth="1.2" opacity="0.5" />
        <path d="M44 68 Q44 52 60 42 Q76 52 76 68" fill="none" stroke={C.accent} strokeWidth="1.5" />
        <circle cx="60" cy="50" r="8" fill={C.accent} opacity="0.15" />
        <circle cx="60" cy="50" r="3" fill={C.accent} opacity="0.4" />
        <defs><radialGradient id="glowA"><stop offset="0%" stopColor={C.accent} stopOpacity="0.15" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></radialGradient></defs>
    </svg>
);
const BrokenVessel = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.6 }}>
        <circle cx="60" cy="60" r="40" fill="url(#glowB)" />
        <path d="M45 40 L45 80 Q45 90 60 90 Q75 90 75 80 L75 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M55 40 L58 55 L52 65 L60 75" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <path d="M65 42 L62 58 L68 68" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <defs><radialGradient id="glowB"><stop offset="0%" stopColor="rgba(180,180,200,0.12)" /><stop offset="100%" stopColor="transparent" /></radialGradient></defs>
    </svg>
);
const CrossLight = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.7 }}>
        <circle cx="60" cy="60" r="45" fill="url(#glowC)" />
        <line x1="60" y1="25" x2="60" y2="95" stroke={C.accent} strokeWidth="2" opacity="0.5" />
        <line x1="38" y1="48" x2="82" y2="48" stroke={C.accent} strokeWidth="2" opacity="0.5" />
        {[0, 1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="60" y1="60" x2={60 + Math.cos(i * Math.PI / 3) * 40} y2={60 + Math.sin(i * Math.PI / 3) * 40}
                stroke={C.accent} strokeWidth="0.5" opacity="0.2" />
        ))}
        <defs><radialGradient id="glowC"><stop offset="0%" stopColor={C.accent} stopOpacity="0.2" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></radialGradient></defs>
    </svg>
);
const SunriseIcon = () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ opacity: 0.7 }}>
        <circle cx="60" cy="60" r="45" fill="url(#glowD)" />
        <path d="M20 80 Q60 50 100 80" fill="none" stroke={C.accent} strokeWidth="1.5" opacity="0.4" />
        <circle cx="60" cy="58" r="14" fill={C.accent} opacity="0.12" />
        <circle cx="60" cy="58" r="8" fill={C.accent} opacity="0.25" />
        {[...Array(8)].map((_, i) => {
            const a = (i * Math.PI) / 4 - Math.PI / 2;
            return <line key={i} x1={60 + Math.cos(a) * 20} y1={58 + Math.sin(a) * 20} x2={60 + Math.cos(a) * 32} y2={58 + Math.sin(a) * 32} stroke={C.accent} strokeWidth="1" opacity="0.3" />;
        })}
        <defs><radialGradient id="glowD"><stop offset="0%" stopColor={C.accent} stopOpacity="0.18" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></radialGradient></defs>
    </svg>
);

// ═══════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans: 'Source Sans 3', system-ui, sans-serif;
    --primary: ${C.primary};
    --accent: ${C.accent};
    --cream: ${C.cream};
  }

  html { scroll-behavior: smooth; }
  body { font-family: var(--sans); color: ${C.text}; overflow-x: hidden; }

  /* ─── MINIMAL HEADER ─── */
  .gp-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 32px; transition: all 0.4s;
  }
  .gp-header.scrolled {
    background: rgba(248,246,240,0.92); backdrop-filter: blur(14px);
    box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  }
  .gp-header.dark-section {
    background: rgba(42,42,53,0.92); backdrop-filter: blur(14px);
  }
  .gp-logo {
    font-family: var(--serif); font-size: 20px; text-decoration: none;
    display: flex; align-items: center; gap: 8px; transition: color 0.4s;
  }
  .gp-logo .mark {
    display: inline-flex; width: 30px; height: 30px; border-radius: 6px;
    align-items: center; justify-content: center; font-size: 14px;
    border: 1.5px solid var(--accent); transition: border-color 0.4s;
  }
  .gp-back {
    font-size: 14px; text-decoration: none; font-weight: 500;
    display: flex; align-items: center; gap: 6px; transition: color 0.4s;
  }

  /* ─── PROGRESS DOTS ─── */
  .progress-dots {
    position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
    z-index: 90; display: flex; flex-direction: column; gap: 14px;
  }
  .prog-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: rgba(30,58,95,0.15); border: 1.5px solid rgba(30,58,95,0.2);
    cursor: pointer; transition: all 0.4s;
    position: relative;
  }
  .prog-dot.active {
    background: var(--accent); border-color: var(--accent);
    box-shadow: 0 0 0 4px rgba(212,168,67,0.2);
  }
  .prog-dot .prog-label {
    position: absolute; right: 22px; top: 50%; transform: translateY(-50%);
    white-space: nowrap; font-size: 12px; font-weight: 500;
    color: ${C.textMuted}; opacity: 0; transition: opacity 0.3s;
    pointer-events: none;
  }
  .prog-dot:hover .prog-label { opacity: 1; }

  /* ─── HERO ─── */
  .gp-hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
    position: relative; overflow: hidden;
    background: linear-gradient(165deg, ${C.accentPale} 0%, ${C.cream} 40%, ${C.white} 100%);
  }
  .gp-hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(212,168,67,0.12) 0%, transparent 70%);
  }
  .hero-rays {
    position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
    width: 800px; height: 800px; opacity: 0.06;
    background: conic-gradient(from 0deg, transparent 0deg, ${C.accent} 2deg, transparent 4deg,
      transparent 30deg, ${C.accent} 32deg, transparent 34deg,
      transparent 60deg, ${C.accent} 62deg, transparent 64deg,
      transparent 90deg, ${C.accent} 92deg, transparent 94deg,
      transparent 120deg, ${C.accent} 122deg, transparent 124deg,
      transparent 150deg, ${C.accent} 152deg, transparent 154deg,
      transparent 180deg, ${C.accent} 182deg, transparent 184deg,
      transparent 210deg, ${C.accent} 212deg, transparent 214deg,
      transparent 240deg, ${C.accent} 242deg, transparent 244deg,
      transparent 270deg, ${C.accent} 272deg, transparent 274deg,
      transparent 300deg, ${C.accent} 302deg, transparent 304deg,
      transparent 330deg, ${C.accent} 332deg, transparent 334deg);
    border-radius: 50%;
    animation: rotate-slow 120s linear infinite;
  }
  @keyframes rotate-slow { to { transform: translateX(-50%) rotate(360deg); } }

  .gp-hero h1 {
    font-family: var(--serif); font-size: clamp(34px, 6vw, 62px);
    color: ${C.primary}; line-height: 1.2; max-width: 700px;
    padding: 0 24px; font-weight: 500; position: relative;
  }
  .gp-hero .hero-sub {
    font-size: clamp(16px, 2.2vw, 19px); color: ${C.textMuted};
    max-width: 480px; margin: 20px auto 0; line-height: 1.7;
    padding: 0 24px; font-weight: 300;
  }
  .scroll-cue {
    position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
    animation: float 2.8s ease-in-out infinite; cursor: pointer;
  }
  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; }
    50% { transform: translateX(-50%) translateY(12px); opacity: 1; }
  }

  /* ─── CHAPTER SHARED ─── */
  .chapter {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; position: relative; overflow: hidden;
    padding: 80px 24px;
  }
  .chapter-inner {
    max-width: 680px; width: 100%; position: relative; z-index: 2;
  }
  .chapter-num {
    font-family: var(--serif); font-weight: 300; opacity: 0.07;
    position: absolute; top: -60px; left: -30px; line-height: 1;
    pointer-events: none; user-select: none;
  }
  .chapter-illust {
    display: flex; justify-content: center; margin-bottom: 24px;
  }
  .chapter-title {
    font-family: var(--serif); font-size: clamp(28px, 4.5vw, 44px);
    line-height: 1.2; margin-bottom: 28px; font-weight: 500;
  }
  .chapter-body p {
    font-size: 18px; line-height: 1.85; margin-bottom: 20px; font-weight: 300;
  }

  /* ─── VERSE CARD ─── */
  .verse-card {
    margin: 36px 0; padding: 28px 32px; border-radius: 14px;
    position: relative; overflow: hidden;
  }
  .verse-card::before {
    content: '"'; font-family: var(--serif); font-size: 80px;
    position: absolute; top: -8px; left: 16px; opacity: 0.08; line-height: 1;
  }
  .verse-text {
    font-family: var(--serif); font-style: italic; font-size: 19px;
    line-height: 1.7; margin-bottom: 12px; position: relative;
  }
  .verse-ref {
    font-family: var(--sans); font-size: 14px; font-weight: 600;
    letter-spacing: 0.5px; opacity: 0.7;
  }
  .verse-bar {
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    border-radius: 3px;
  }

  /* ─── CHAPTER BACKGROUNDS ─── */
  .ch-1 { background: linear-gradient(180deg, ${C.white} 0%, ${C.cream} 100%); }
  .ch-1 .chapter-num { font-size: clamp(140px, 22vw, 240px); color: ${C.accent}; }
  .ch-1 .chapter-title { color: ${C.primary}; }
  .ch-1 .chapter-body p { color: ${C.text}; }
  .ch-1 .verse-card { background: rgba(30,58,95,0.04); border-left: 3px solid ${C.accent}; }
  .ch-1 .verse-text { color: ${C.primary}; }
  .ch-1 .verse-ref { color: ${C.accent}; }

  .ch-2 { background: linear-gradient(180deg, #2A2A35 0%, #1F1F28 100%); }
  .ch-2 .chapter-num { font-size: clamp(140px, 22vw, 240px); color: rgba(255,255,255,0.5); }
  .ch-2 .chapter-title { color: ${C.chapter2Text}; }
  .ch-2 .chapter-body p { color: rgba(232,228,220,0.75); }
  .ch-2 .verse-card { background: rgba(255,255,255,0.04); border-left: 3px solid rgba(255,255,255,0.2); }
  .ch-2 .verse-text { color: ${C.chapter2Text}; }
  .ch-2 .verse-ref { color: rgba(255,255,255,0.4); }

  .ch-3 { background: linear-gradient(180deg, #1F1F28 0%, ${C.primary} 30%, #2A4A6F 100%); }
  .ch-3 .chapter-num { font-size: clamp(140px, 22vw, 240px); color: ${C.accent}; }
  .ch-3 .chapter-title { color: ${C.accentPale}; }
  .ch-3 .chapter-body p { color: rgba(248,246,240,0.8); }
  .ch-3 .verse-card { background: rgba(212,168,67,0.08); border-left: 3px solid ${C.accent}; }
  .ch-3 .verse-text { color: ${C.cream}; }
  .ch-3 .verse-ref { color: ${C.accent}; }

  .ch-4 { background: linear-gradient(180deg, ${C.cream} 0%, ${C.white} 100%); }
  .ch-4 .chapter-num { font-size: clamp(140px, 22vw, 240px); color: ${C.accent}; }
  .ch-4 .chapter-title { color: ${C.primary}; }
  .ch-4 .chapter-body p { color: ${C.text}; }
  .ch-4 .verse-card { background: linear-gradient(135deg, rgba(212,168,67,0.06), rgba(30,58,95,0.04)); border-left: 3px solid ${C.accent}; }
  .ch-4 .verse-text { color: ${C.primary}; }
  .ch-4 .verse-ref { color: ${C.accent}; }

  /* ─── PRAYER SECTION ─── */
  .prayer-section {
    padding: 100px 24px; text-align: center; position: relative;
    background: linear-gradient(165deg, ${C.accentPale} 0%, #F0DDB8 50%, ${C.accentPale} 100%);
    overflow: hidden;
  }
  .prayer-section::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.5) 0%, transparent 70%);
  }
  .prayer-inner { max-width: 620px; margin: 0 auto; position: relative; z-index: 2; }
  .prayer-title {
    font-family: var(--serif); font-size: clamp(28px, 4.5vw, 42px);
    color: ${C.primary}; margin-bottom: 12px; font-weight: 500;
  }
  .prayer-subtitle {
    font-size: 17px; color: ${C.textMuted}; line-height: 1.7;
    margin-bottom: 40px; font-weight: 300;
  }
  .prayer-card {
    background: rgba(255,255,255,0.7); backdrop-filter: blur(10px);
    border-radius: 18px; padding: 40px 36px; border: 1px solid rgba(212,168,67,0.25);
    box-shadow: 0 8px 40px rgba(212,168,67,0.1);
  }
  .prayer-text {
    font-family: var(--serif); font-style: italic; font-size: 20px;
    line-height: 1.8; color: ${C.primary}; font-weight: 400;
  }
  .prayer-audio-btn {
    display: inline-flex; align-items: center; gap: 10px; margin-top: 24px;
    padding: 12px 24px; border-radius: 30px; border: 1.5px solid ${C.accent};
    background: rgba(255,255,255,0.6); color: ${C.primary};
    font-family: var(--sans); font-size: 15px; font-weight: 500;
    cursor: pointer; transition: all 0.3s;
  }
  .prayer-audio-btn:hover { background: ${C.accent}; color: ${C.primaryDark}; }
  .prayer-response {
    margin-top: 40px; padding-top: 32px;
    border-top: 1px solid rgba(212,168,67,0.25);
  }
  .prayer-response p {
    font-size: 17px; color: ${C.textMuted}; margin-bottom: 16px;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${C.accent}; color: ${C.primaryDark};
    padding: 16px 36px; border-radius: 10px; border: none;
    font-family: var(--sans); font-size: 16px; font-weight: 700;
    cursor: pointer; transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(212,168,67,0.3);
  }
  .btn-primary:hover { background: ${C.accentLight}; transform: translateY(-2px); box-shadow: 0 6px 28px rgba(212,168,67,0.4); }

  /* ─── DECISION FORM ─── */
  .decision-section {
    padding: 80px 24px; text-align: center;
    background: ${C.white};
  }
  .decision-inner { max-width: 520px; margin: 0 auto; }
  .decision-title {
    font-family: var(--serif); font-size: clamp(26px, 4vw, 38px);
    color: ${C.primary}; margin-bottom: 8px; font-weight: 500;
  }
  .decision-subtitle {
    font-size: 16px; color: ${C.textMuted}; margin-bottom: 36px; line-height: 1.6;
  }
  .form-group { margin-bottom: 18px; text-align: left; }
  .form-label {
    display: block; font-size: 13px; font-weight: 600;
    color: ${C.textMuted}; margin-bottom: 6px; letter-spacing: 0.3px;
  }
  .form-input {
    width: 100%; padding: 14px 16px; border: 1.5px solid #E0DCD4;
    border-radius: 10px; font-size: 15px; font-family: var(--sans);
    background: ${C.cream}; color: ${C.text}; outline: none;
    transition: border-color 0.3s;
  }
  .form-input:focus { border-color: ${C.accent}; }
  .form-select {
    width: 100%; padding: 14px 16px; border: 1.5px solid #E0DCD4;
    border-radius: 10px; font-size: 15px; font-family: var(--sans);
    background: ${C.cream}; color: ${C.text}; outline: none;
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 14px center;
  }
  .form-select:focus { border-color: ${C.accent}; }
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0; border-bottom: 1px solid #EDE9E0;
  }
  .toggle-label { font-size: 15px; color: ${C.text}; }
  .toggle-switch {
    position: relative; width: 48px; height: 26px; cursor: pointer;
  }
  .toggle-track {
    width: 100%; height: 100%; border-radius: 13px;
    background: #D1CCC4; transition: background 0.3s;
  }
  .toggle-track.on { background: ${C.accent}; }
  .toggle-thumb {
    position: absolute; top: 3px; left: 3px; width: 20px; height: 20px;
    border-radius: 50%; background: white; transition: transform 0.3s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }
  .toggle-thumb.on { transform: translateX(22px); }
  .form-submit {
    width: 100%; margin-top: 8px; padding: 16px;
    background: ${C.accent}; color: ${C.primaryDark};
    border: none; border-radius: 10px; font-size: 16px; font-weight: 700;
    font-family: var(--sans); cursor: pointer; transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(212,168,67,0.25);
  }
  .form-submit:hover { background: ${C.accentLight}; transform: translateY(-1px); }
  .form-trust {
    margin-top: 14px; font-size: 13px; color: ${C.textMuted}; line-height: 1.5;
  }

  /* ─── FAQ ─── */
  .faq-section {
    padding: 80px 24px; background: ${C.cream};
  }
  .faq-inner { max-width: 620px; margin: 0 auto; }
  .faq-title {
    font-family: var(--serif); font-size: clamp(24px, 3.5vw, 36px);
    color: ${C.primary}; text-align: center; margin-bottom: 36px; font-weight: 500;
  }
  .faq-item {
    background: white; border-radius: 12px; margin-bottom: 12px;
    border: 1px solid #E8E4DC; overflow: hidden;
    transition: box-shadow 0.3s;
  }
  .faq-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
  .faq-question {
    width: 100%; padding: 20px 24px; background: none; border: none;
    display: flex; align-items: center; justify-content: space-between;
    font-family: var(--sans); font-size: 16px; font-weight: 600;
    color: ${C.primary}; cursor: pointer; text-align: left; gap: 12px;
  }
  .faq-chevron { transition: transform 0.3s; flex-shrink: 0; }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-answer {
    max-height: 0; overflow: hidden; transition: max-height 0.4s ease, padding 0.4s ease;
  }
  .faq-answer.open { max-height: 300px; }
  .faq-answer-inner {
    padding: 0 24px 20px; font-size: 15px; line-height: 1.7;
    color: ${C.textMuted};
  }

  /* ─── BOTTOM CTA ─── */
  .bottom-cta {
    padding: 64px 24px; text-align: center;
    background: ${C.primary}; color: white;
  }
  .bottom-cta h3 {
    font-family: var(--serif); font-size: clamp(22px, 3.5vw, 32px);
    margin-bottom: 24px; font-weight: 400;
  }
  .btn-outline-light {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px; border: 2px solid rgba(255,255,255,0.4);
    border-radius: 10px; background: transparent; color: white;
    font-family: var(--sans); font-size: 16px; font-weight: 600;
    cursor: pointer; transition: all 0.3s;
  }
  .btn-outline-light:hover { border-color: ${C.accent}; color: ${C.accent}; }
  .share-row {
    display: flex; align-items: center; justify-content: center;
    gap: 16px; margin-top: 32px; flex-wrap: wrap;
  }
  .share-text { font-size: 14px; color: rgba(255,255,255,0.6); }
  .share-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 8px; border: none;
    font-family: var(--sans); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: transform 0.2s;
  }
  .share-btn:hover { transform: translateY(-2px); }
  .share-wa { background: #25D366; color: white; }
  .share-fb { background: #1877F2; color: white; }

  /* ─── MINI FOOTER ─── */
  .gp-footer {
    padding: 24px; background: ${C.primaryDark}; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.4);
  }
  .gp-footer a { color: ${C.accent}; text-decoration: none; }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 768px) {
    .progress-dots { display: none; }
    .gp-header { padding: 12px 20px; }
    .chapter { padding: 60px 20px; }
    .chapter-num { left: -10px; top: -40px; }
    .prayer-card { padding: 28px 22px; }
    .verse-card { padding: 22px 20px; }
  }

  /* ─── HIDDEN FORM STATE ─── */
  .form-reveal { 
    max-height: 0; overflow: hidden; transition: max-height 0.6s ease; 
  }
  .form-reveal.visible { max-height: 1200px; }
`;

// ═══════════════════════════════════════════════
// CHAPTER DATA
// ═══════════════════════════════════════════════
const chapters = [
    {
        id: "ch-1", cls: "ch-1", num: "1",
        title: "No eres un accidente",
        icon: <HandsLight />,
        paragraphs: [
            "Antes de que existiera el universo, antes de que las estrellas comenzaran a brillar, ya había un plan para tu vida. No llegaste a este mundo por casualidad — fuiste pensado, diseñado, deseado.",
            "Cada parte de ti — tu personalidad, tus sueños, incluso las cosas que te hacen diferente — tiene un propósito. Hay un Creador que te conoce más profundamente de lo que tú te conoces a ti mismo, y su intención siempre fue que vivieras una vida plena, con sentido y con amor.",
            "Tal vez nadie te lo ha dicho así antes. Pero es la verdad: eres profundamente valioso."
        ],
        verse: "Antes que te formases en el vientre te conocí, y antes que nacieses te santifiqué.",
        verseRef: "Jeremías 1:5",
    },
    {
        id: "ch-2", cls: "ch-2", num: "2",
        title: "¿Por qué siento un vacío?",
        icon: <BrokenVessel />,
        paragraphs: [
            "Si alguna vez has sentido que algo falta — aunque por fuera todo parezca estar bien — no estás solo. Esa sensación de vacío, de ansiedad persistente, de buscar algo sin saber exactamente qué… es más común de lo que imaginas.",
            "La realidad es que algo se rompió. Nos alejamos de la fuente de vida para la que fuimos creados. Ese alejamiento tiene un nombre antiguo — pecado — pero no se trata solo de 'cosas malas'. Es vivir desconectado de quien te diseñó. Es intentar llenar con éxito, relaciones, dinero o placer un espacio que fue hecho para algo más grande.",
            "Y por más que lo intentemos, ese vacío sigue ahí. Porque no se llena con cosas. Se llena con alguien."
        ],
        verse: "Por cuanto todos pecaron y están destituidos de la gloria de Dios.",
        verseRef: "Romanos 3:23",
    },
    {
        id: "ch-3", cls: "ch-3", num: "3",
        title: "El Amor Más Grande de la Historia",
        icon: <CrossLight />,
        paragraphs: [
            "Aquí es donde la historia cambia. Dios vio nuestra situación — el vacío, el dolor, la desconexión — y en lugar de dejarnos solos, hizo algo extraordinario: envió a su propio Hijo, Jesús.",
            "Jesús vivió como uno de nosotros. Conoció el cansancio, la tristeza, la injusticia. Y entonces, voluntariamente, dio su vida en una cruz para pagar el precio de todo lo que nos separaba de Dios. No porque lo mereciéramos, sino porque nos amaba.",
            "Tres días después, resucitó. Venció la muerte. Y con eso abrió un camino de regreso a casa — un camino que está disponible para ti, hoy, ahora mismo."
        ],
        verse: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
        verseRef: "Juan 3:16",
    },
    {
        id: "ch-4", cls: "ch-4", num: "4",
        title: "Una Nueva Vida Te Espera",
        icon: <SunriseIcon />,
        paragraphs: [
            "Imagina que llevas años cargando un peso enorme sobre tus hombros. Y de repente, alguien te dice: \"Puedes soltarlo. Yo lo cargo por ti.\" Eso es exactamente lo que Jesús ofrece.",
            "No necesitas ser perfecto. No necesitas tener todo resuelto. No necesitas entender cada detalle. Solo necesitas abrir la puerta. Recibir a Cristo es como aceptar un regalo — no lo puedes ganar, solo puedes recibirlo con gratitud.",
            "Hoy puede ser el primer día de una vida completamente nueva. Una vida con propósito, con paz, con esperanza real. Una vida conectada al amor que siempre buscaste."
        ],
        verse: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.",
        verseRef: "2 Corintios 5:17",
    },
];

const faqData = [
    {
        q: "¿Necesito ir a una iglesia?",
        a: "Ir a una iglesia no es un requisito para iniciar una relación con Dios, pero sí es una parte hermosa del camino. La iglesia es una comunidad donde encontrarás apoyo, enseñanza y amistades que te acompañarán en tu crecimiento. Cuando estés listo, te ayudamos a encontrar una cerca de ti."
    },
    {
        q: "¿Qué pasa después de esta oración?",
        a: "Hacer esta oración es un primer paso hermoso, pero es solo el comienzo. A partir de aquí, puedes empezar a leer la Biblia (te recomendamos el Evangelio de Juan), hablar con Dios todos los días como hablarías con un amigo, y conectarte con una comunidad de fe. No estás solo en esto — queremos caminar contigo."
    },
    {
        q: "¿Puedo hablar con alguien?",
        a: "¡Por supuesto! Tenemos personas preparadas y dispuestas a escucharte, responder tus preguntas y acompañarte. Puedes escribirnos por WhatsApp o dejarnos tus datos en el formulario, y nos comunicaremos contigo de forma confidencial."
    },
];

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function ConoceAJesus() {
    const [scrolled, setScrolled] = useState(false);
    const [activeChapter, setActiveChapter] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [contactToggle, setContactToggle] = useState(true);
    const [formData, setFormData] = useState({ nombre: "", ciudad: "", contacto: "", siguiente: "" });
    const [submitted, setSubmitted] = useState(false);

    const sectionRefs = useRef([]);
    const heroRef = useRef(null);

    // Track scroll position for header & progress dots
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);

            // Determine active chapter
            const offsets = sectionRefs.current.map(el => el ? el.getBoundingClientRect().top : 9999);
            let active = 0;
            for (let i = offsets.length - 1; i >= 0; i--) {
                if (offsets[i] < window.innerHeight * 0.5) { active = i; break; }
            }
            setActiveChapter(active);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (i) => {
        sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const isDarkSection = activeChapter === 1 || activeChapter === 2;

    const dotLabels = ["Propósito", "El Vacío", "El Amor", "Vida Nueva", "Oración"];

    const handleInput = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));

    return (
        <>
            <style>{css}</style>
            <div>
                {/* ─── HEADER ─── */}
                <header className={`gp-header ${scrolled ? (isDarkSection ? "dark-section scrolled" : "scrolled") : ""}`}>
                    <a className="gp-logo" href="/" style={{ color: scrolled && !isDarkSection ? C.primary : (scrolled && isDarkSection ? C.cream : C.primary) }}>
                        <span className="mark" style={{ color: C.accent }}>✦</span>
                        <span>MMM Chile</span>
                    </a>
                    <a className="gp-back" href="/" style={{ color: scrolled && !isDarkSection ? C.textMuted : (scrolled && isDarkSection ? "rgba(255,255,255,0.6)" : C.textMuted) }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                        Volver al inicio
                    </a>
                </header>

                {/* ─── PROGRESS DOTS ─── */}
                <div className="progress-dots">
                    {dotLabels.map((label, i) => (
                        <div key={i} className={`prog-dot ${activeChapter === i ? "active" : ""}`} onClick={() => scrollTo(i)}>
                            <span className="prog-label">{label}</span>
                        </div>
                    ))}
                </div>

                {/* ═══ HERO ═══ */}
                <section className="gp-hero" ref={heroRef}>
                    <div className="hero-rays" />
                    <Reveal delay={0.15}>
                        <h1>Hay Alguien que Te Conoce<br />y Te Ama</h1>
                    </Reveal>
                    <Reveal delay={0.35}>
                        <p className="hero-sub">
                            Esta página podría cambiar tu vida. Tómate unos minutos para leerla.
                        </p>
                    </Reveal>
                    <div className="scroll-cue" onClick={() => scrollTo(0)}>
                        <ChevronDown color={C.accent} size={30} />
                    </div>
                </section>

                {/* ═══ CHAPTERS ═══ */}
                {chapters.map((ch, i) => (
                    <section
                        key={ch.id}
                        id={ch.id}
                        className={`chapter ${ch.cls}`}
                        ref={el => sectionRefs.current[i] = el}
                    >
                        <div className="chapter-inner">
                            <div className="chapter-num">{ch.num}</div>

                            <Reveal delay={0.05}>
                                <div className="chapter-illust">{ch.icon}</div>
                            </Reveal>

                            <Reveal delay={0.15}>
                                <h2 className="chapter-title">{ch.title}</h2>
                            </Reveal>

                            <div className="chapter-body">
                                {ch.paragraphs.map((p, j) => (
                                    <Reveal key={j} delay={0.2 + j * 0.1}>
                                        <p>{p}</p>
                                    </Reveal>
                                ))}
                            </div>

                            <Reveal delay={0.2 + ch.paragraphs.length * 0.1}>
                                <div className="verse-card">
                                    <div className="verse-text">{ch.verse}</div>
                                    <div className="verse-ref">— {ch.verseRef}</div>
                                </div>
                            </Reveal>
                        </div>
                    </section>
                ))}

                {/* ═══ PRAYER SECTION ═══ */}
                <section className="prayer-section" ref={el => sectionRefs.current[4] = el}>
                    <div className="prayer-inner">
                        <Reveal>
                            <div className="prayer-title">¿Quieres dar este paso?</div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <p className="prayer-subtitle">
                                Si algo en tu corazón está resonando con estas palabras, puedes hacer esta oración ahora mismo.
                                No necesitas palabras perfectas — Dios escucha tu corazón.
                            </p>
                        </Reveal>
                        <Reveal delay={0.25}>
                            <div className="prayer-card">
                                <p className="prayer-text">
                                    Dios, reconozco que te necesito. Creo que Jesús murió por mí y resucitó. Hoy abro mi corazón y te recibo como mi Salvador. Perdona mis pecados y dame una vida nueva. En el nombre de Jesús, amén.
                                </p>
                                <button className="prayer-audio-btn">
                                    <PlayCircle /> Escuchar esta oración
                                </button>
                            </div>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <div className="prayer-response">
                                <p>¿Hiciste esta oración?</p>
                                <button className="btn-primary" onClick={() => setShowForm(true)}>
                                    Sí, quiero dar mis primeros pasos
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ═══ DECISION FORM ═══ */}
                <section className="decision-section">
                    <div className={`form-reveal ${showForm ? "visible" : ""}`}>
                        <div className="decision-inner" style={{ paddingTop: 20, paddingBottom: 40 }}>
                            {!submitted ? (
                                <>
                                    <Reveal>
                                        <div className="decision-title">¡El cielo celebra contigo! 🎉</div>
                                        <p className="decision-subtitle">
                                            Queremos acompañarte en tus primeros pasos de fe. Déjanos tus datos y te contactaremos.
                                        </p>
                                    </Reveal>
                                    <div>
                                        <div className="form-group">
                                            <label className="form-label">Nombre</label>
                                            <input className="form-input" type="text" placeholder="Tu nombre"
                                                value={formData.nombre} onChange={e => handleInput("nombre", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Ciudad / Comuna</label>
                                            <input className="form-input" type="text" placeholder="¿Dónde vives?"
                                                value={formData.ciudad} onChange={e => handleInput("ciudad", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">WhatsApp o Email</label>
                                            <input className="form-input" type="text" placeholder="+56 9 1234 5678 o tu@email.com"
                                                value={formData.contacto} onChange={e => handleInput("contacto", e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">¿Qué te gustaría hacer ahora?</label>
                                            <select className="form-select" value={formData.siguiente}
                                                onChange={e => handleInput("siguiente", e.target.value)}>
                                                <option value="">Selecciona una opción</option>
                                                <option value="iglesia">Visitar una iglesia</option>
                                                <option value="lectura">Recibir un plan de lectura bíblica</option>
                                                <option value="hablar">Hablar con alguien</option>
                                                <option value="info">Solo quiero información</option>
                                            </select>
                                        </div>
                                        <div className="toggle-row">
                                            <span className="toggle-label">¿Te gustaría que te contactemos?</span>
                                            <div className="toggle-switch" onClick={() => setContactToggle(!contactToggle)}>
                                                <div className={`toggle-track ${contactToggle ? "on" : ""}`} />
                                                <div className={`toggle-thumb ${contactToggle ? "on" : ""}`} />
                                            </div>
                                        </div>
                                        <button className="form-submit" onClick={() => setSubmitted(true)}>
                                            Enviar
                                        </button>
                                        <p className="form-trust">
                                            🔒 Tu información es confidencial. Solo la usaremos para conectarte con una iglesia cercana.
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: "40px 0", textAlign: "center" }}>
                                    <div style={{ fontSize: 56, marginBottom: 16 }}>🙏</div>
                                    <div className="decision-title">¡Gracias, {formData.nombre || "amigo"}!</div>
                                    <p className="decision-subtitle">
                                        Hemos recibido tu información. Alguien de nuestro equipo se comunicará contigo pronto para acompañarte en tus primeros pasos. ¡El cielo está de fiesta!
                                    </p>
                                    <button className="btn-primary" onClick={() => window.location.href = "/iglesias"}>
                                        Mientras tanto, encuentra una iglesia cercana
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {!showForm && (
                        <Reveal>
                            <div className="decision-inner" style={{ padding: "0 0 40px" }}>
                                <p style={{ fontSize: 16, color: C.textMuted }}>
                                    ¿Aún no estás listo? No hay prisa. Puedes volver a esta página cuando quieras.
                                </p>
                            </div>
                        </Reveal>
                    )}
                </section>

                {/* ═══ FAQ ═══ */}
                <section className="faq-section">
                    <div className="faq-inner">
                        <Reveal>
                            <h3 className="faq-title">¿Aún tienes preguntas?</h3>
                        </Reveal>
                        {faqData.map((faq, i) => (
                            <Reveal key={i} delay={0.05 + i * 0.08}>
                                <div className="faq-item">
                                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{faq.q}</span>
                                        <span className={`faq-chevron ${openFaq === i ? "open" : ""}`}>
                                            <ChevronDown color={C.primary} size={20} />
                                        </span>
                                    </button>
                                    <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                                        <div className="faq-answer-inner">{faq.a}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ═══ BOTTOM CTA ═══ */}
                <section className="bottom-cta">
                    <Reveal>
                        <h3>Encuentra una iglesia cerca de ti</h3>
                        <button className="btn-outline-light" onClick={() => window.location.href = "/iglesias"}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                            Buscar iglesia
                        </button>
                    </Reveal>
                    <div className="share-row">
                        <span className="share-text">¿Conoces a alguien que necesite leer esto?</span>
                        <button className="share-btn share-wa">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            WhatsApp
                        </button>
                        <button className="share-btn share-fb">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            Facebook
                        </button>
                    </div>
                </section>

                {/* ─── MINI FOOTER ─── */}
                <footer className="gp-footer">
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/">mmmchile.cl</a>
                </footer>
            </div>
        </>
    );
}