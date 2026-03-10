import { useState, useEffect, useRef } from "react";

const COLORS = {
    primary: "#1E3A5F",
    primaryDark: "#0F2035",
    accent: "#D4A843",
    accentLight: "#E8C976",
    cream: "#F8F6F0",
    white: "#FFFFFF",
    text: "#2C2C2C",
    textLight: "#6B7280",
    whatsapp: "#25D366",
};

// ─── Subtle cross SVG pattern ───
const CrossPattern = ({ opacity = 0.04, color = COLORS.primary }) => (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }}>
        <defs>
            <pattern id="crossPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="30" y1="18" x2="30" y2="42" stroke={color} strokeWidth="1.2" />
                <line x1="22" y1="28" x2="38" y2="28" stroke={color} strokeWidth="1.2" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crossPattern)" />
    </svg>
);

// ─── Icons ───
const HeartIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const PeopleIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const PrayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    </svg>
);
const BookIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);
const ArrowRight = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
);
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const WhatsAppIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);
const MapPinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
);
const PlayIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const RadioIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>
);

// ─── Scroll Animation Hook ───
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

const FadeIn = ({ children, delay = 0, direction = "up", style = {} }) => {
    const [ref, visible] = useInView(0.1);
    const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
    return (
        <div ref={ref} style={{
            ...style,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : transforms[direction],
            transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}>{children}</div>
    );
};

// ─── Styles ───
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --primary: ${COLORS.primary};
    --primary-dark: ${COLORS.primaryDark};
    --accent: ${COLORS.accent};
    --accent-light: ${COLORS.accentLight};
    --cream: ${COLORS.cream};
    --text: ${COLORS.text};
    --text-light: ${COLORS.textLight};
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  body { font-family: var(--sans); color: var(--text); line-height: 1.6; }

  /* ─── NAV ─── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px; transition: all 0.4s ease;
  }
  .nav.scrolled {
    background: rgba(15,32,53,0.95); backdrop-filter: blur(12px);
    padding: 10px 40px; box-shadow: 0 2px 20px rgba(0,0,0,0.15);
  }
  .nav-logo {
    font-family: var(--serif); font-size: 22px; color: white;
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .nav-logo .cross-mark {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border: 2px solid var(--accent);
    border-radius: 6px; font-size: 18px; color: var(--accent);
  }
  .nav-links { display: flex; gap: 28px; align-items: center; }
  .nav-links a {
    color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px;
    font-weight: 500; letter-spacing: 0.3px; transition: color 0.3s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta {
    background: var(--accent) !important; color: var(--primary-dark) !important;
    padding: 8px 20px !important; border-radius: 6px; font-weight: 600 !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
  }
  .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,168,67,0.4); }

  .mobile-menu-btn {
    display: none; background: none; border: none; cursor: pointer;
    padding: 8px; color: white;
  }

  /* ─── HERO ─── */
  .hero {
    position: relative; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; text-align: center; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #1a2a4a 0%, #2d1f3d 40%, #3a2518 70%, #1a2a4a 100%);
  }
  .hero-bg::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(212,168,67,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 30%, rgba(180,140,200,0.06) 0%, transparent 50%);
  }
  /* Simulated warm bokeh circles */
  .bokeh {
    position: absolute; border-radius: 50%; filter: blur(40px); opacity: 0.12;
    animation: float 8s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(15,32,53,0.7) 0%, rgba(15,32,53,0.5) 50%, rgba(15,32,53,0.8) 100%);
  }
  .hero-content {
    position: relative; z-index: 2; max-width: 800px; padding: 0 24px;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    color: var(--accent); margin-bottom: 24px;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; width: 30px; height: 1px; background: var(--accent); opacity: 0.6;
  }
  .hero h1 {
    font-family: var(--serif); font-size: clamp(36px, 6vw, 64px); color: white;
    line-height: 1.15; margin-bottom: 20px; font-weight: 400;
  }
  .hero-subtitle {
    font-size: clamp(16px, 2.2vw, 20px); color: rgba(255,255,255,0.8);
    max-width: 560px; margin: 0 auto 40px; line-height: 1.7; font-weight: 300;
  }
  .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .btn-gold {
    background: var(--accent); color: var(--primary-dark); padding: 16px 32px;
    border: none; border-radius: 8px; font-size: 16px; font-weight: 600;
    font-family: var(--sans); cursor: pointer; transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(212,168,67,0.3);
  }
  .btn-gold:hover { background: var(--accent-light); transform: translateY(-2px); box-shadow: 0 6px 28px rgba(212,168,67,0.45); }
  .btn-outline {
    background: transparent; color: white; padding: 16px 32px;
    border: 2px solid rgba(255,255,255,0.5); border-radius: 8px;
    font-size: 16px; font-weight: 500; font-family: var(--sans);
    cursor: pointer; transition: all 0.3s;
  }
  .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.08); }

  .scroll-arrow {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 2; animation: bounce 2.5s ease-in-out infinite; cursor: pointer;
  }
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.6; }
    50% { transform: translateX(-50%) translateY(12px); opacity: 1; }
  }

  /* ─── SECTIONS SHARED ─── */
  .section { padding: 100px 24px; position: relative; }
  .section-inner { max-width: 1120px; margin: 0 auto; }
  .section-title {
    font-family: var(--serif); font-size: clamp(28px, 4vw, 42px);
    color: var(--primary); text-align: center; margin-bottom: 12px;
  }
  .section-title.light { color: white; }
  .section-subtitle {
    text-align: center; color: var(--text-light); font-size: 17px;
    max-width: 520px; margin: 0 auto 52px; font-weight: 400;
  }
  .section-subtitle.light { color: rgba(255,255,255,0.7); }

  /* ─── INTENT CARDS ─── */
  .intent-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  .intent-card {
    background: white; border-radius: 16px; padding: 36px 28px;
    border: 1px solid #E8E4DC; cursor: pointer;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden;
  }
  .intent-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent); transform: scaleX(0); transition: transform 0.35s;
    transform-origin: left;
  }
  .intent-card:hover::before { transform: scaleX(1); }
  .intent-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(30,58,95,0.1);
    border-color: var(--accent);
  }
  .intent-icon {
    width: 56px; height: 56px; border-radius: 12px;
    background: linear-gradient(135deg, rgba(30,58,95,0.06), rgba(212,168,67,0.08));
    display: flex; align-items: center; justify-content: center;
    color: var(--primary); margin-bottom: 20px;
  }
  .intent-card h3 {
    font-family: var(--serif); font-size: 22px; color: var(--primary); margin-bottom: 8px;
  }
  .intent-card p { color: var(--text-light); font-size: 15px; margin-bottom: 16px; line-height: 1.6; }
  .intent-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--accent); font-weight: 600; font-size: 14px;
    transition: gap 0.3s;
  }
  .intent-card:hover .intent-link { gap: 10px; }

  /* ─── TESTIMONIES ─── */
  .testimony-track {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }
  .testimony-card {
    background: white; border-radius: 16px; padding: 36px 28px;
    text-align: center; border: 1px solid #E8E4DC;
    transition: all 0.3s;
  }
  .testimony-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.06); transform: translateY(-3px); }
  .testimony-avatar {
    width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 20px;
    background: linear-gradient(135deg, var(--primary), #2a5280);
    display: flex; align-items: center; justify-content: center;
    color: white; font-family: var(--serif); font-size: 26px;
    box-shadow: 0 4px 15px rgba(30,58,95,0.2);
  }
  .testimony-quote {
    font-style: italic; font-size: 17px; color: var(--text);
    line-height: 1.7; margin-bottom: 16px; position: relative;
  }
  .testimony-quote::before {
    content: '"'; font-family: var(--serif); font-size: 48px;
    color: var(--accent); opacity: 0.4; line-height: 0;
    display: block; margin-bottom: -8px;
  }
  .testimony-name { font-weight: 600; color: var(--primary); font-size: 15px; }
  .testimony-link {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--accent); font-weight: 600; font-size: 14px;
    margin-top: 12px; transition: gap 0.3s; cursor: pointer;
  }
  .testimony-link:hover { gap: 10px; }

  /* ─── BLOG ─── */
  .blog-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 28px;
  }
  .blog-card {
    border-radius: 16px; overflow: hidden; background: white;
    border: 1px solid #E8E4DC; transition: all 0.35s; cursor: pointer;
  }
  .blog-card:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.08); transform: translateY(-4px); }
  .blog-img {
    height: 200px; position: relative; overflow: hidden;
  }
  .blog-img-inner {
    width: 100%; height: 100%; transition: transform 0.5s;
  }
  .blog-card:hover .blog-img-inner { transform: scale(1.05); }
  .blog-tag {
    position: absolute; top: 14px; left: 14px; z-index: 2;
    background: rgba(15,32,53,0.85); color: var(--accent);
    padding: 4px 12px; border-radius: 20px; font-size: 12px;
    font-weight: 600; letter-spacing: 0.5px; backdrop-filter: blur(4px);
  }
  .blog-body { padding: 24px; }
  .blog-body h3 {
    font-family: var(--serif); font-size: 20px; color: var(--primary);
    margin-bottom: 8px; line-height: 1.35;
  }
  .blog-body p { color: var(--text-light); font-size: 14px; line-height: 1.6; margin-bottom: 14px; }
  .blog-readmore {
    display: inline-flex; align-items: center; gap: 6px;
    color: var(--accent); font-weight: 600; font-size: 14px;
    transition: gap 0.3s;
  }
  .blog-card:hover .blog-readmore { gap: 10px; }

  /* ─── CHURCH FINDER ─── */
  .finder-layout {
    display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
  }
  .chile-map {
    width: 100%; max-width: 280px; margin: 0 auto;
    position: relative;
  }
  .map-dot {
    position: absolute; width: 10px; height: 10px; background: var(--accent);
    border-radius: 50%; transform: translate(-50%, -50%);
    box-shadow: 0 0 0 3px rgba(212,168,67,0.3);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 0 3px rgba(212,168,67,0.3); }
    50% { box-shadow: 0 0 0 8px rgba(212,168,67,0.1); }
  }
  .search-box {
    display: flex; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px; overflow: hidden; margin-bottom: 28px;
  }
  .search-box input {
    flex: 1; padding: 14px 18px; background: transparent; border: none;
    color: white; font-size: 15px; font-family: var(--sans); outline: none;
  }
  .search-box input::placeholder { color: rgba(255,255,255,0.5); }
  .search-box button {
    padding: 14px 18px; background: var(--accent); border: none;
    cursor: pointer; display: flex; align-items: center; color: var(--primary-dark);
  }
  .church-mini-card {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px; padding: 16px; margin-bottom: 12px;
    transition: background 0.3s; cursor: pointer;
  }
  .church-mini-card:hover { background: rgba(255,255,255,0.1); }
  .church-mini-card h4 { color: white; font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .church-mini-card p { color: rgba(255,255,255,0.6); font-size: 13px; display: flex; align-items: center; gap: 4px; }
  .church-mini-link {
    color: var(--accent); font-size: 13px; font-weight: 600; margin-top: 6px;
    display: inline-flex; align-items: center; gap: 4px;
  }

  /* ─── LIVE STREAM ─── */
  .live-banner {
    background: linear-gradient(135deg, var(--primary) 0%, #1a4a7a 50%, var(--primary) 100%);
    padding: 60px 24px; text-align: center; position: relative; overflow: hidden;
  }
  .live-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
    padding: 6px 16px; border-radius: 20px; margin-bottom: 16px;
    font-size: 13px; font-weight: 600; color: white; letter-spacing: 0.5px;
  }
  .live-dot {
    width: 8px; height: 8px; background: #EF4444; border-radius: 50%;
    animation: live-pulse 1.5s ease-in-out infinite;
  }
  @keyframes live-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .live-title {
    font-family: var(--serif); font-size: clamp(24px, 3.5vw, 36px);
    color: white; margin-bottom: 8px;
  }
  .live-schedule { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px; }
  .live-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .btn-live-radio {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    color: white; padding: 12px 24px; border-radius: 8px;
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;
    font-family: var(--sans);
  }
  .btn-live-radio:hover { background: rgba(255,255,255,0.2); }
  .btn-live-video {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: var(--primary-dark);
    padding: 12px 24px; border-radius: 8px; border: none;
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;
    font-family: var(--sans);
  }
  .btn-live-video:hover { background: var(--accent-light); }

  /* ─── NEWSLETTER ─── */
  .newsletter { background: linear-gradient(135deg, #F8F0E0, var(--cream)); text-align: center; }
  .newsletter-form {
    display: flex; max-width: 480px; margin: 0 auto;
    border-radius: 10px; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .newsletter-form input {
    flex: 1; padding: 16px 20px; border: 2px solid #E8E4DC;
    border-right: none; border-radius: 10px 0 0 10px; font-size: 15px;
    font-family: var(--sans); outline: none; background: white;
    transition: border-color 0.3s;
  }
  .newsletter-form input:focus { border-color: var(--accent); }
  .newsletter-form button {
    padding: 16px 28px; background: var(--accent); color: var(--primary-dark);
    border: none; font-size: 15px; font-weight: 700; cursor: pointer;
    font-family: var(--sans); transition: background 0.3s;
    white-space: nowrap;
  }
  .newsletter-form button:hover { background: var(--accent-light); }
  .newsletter-proof {
    margin-top: 16px; font-size: 13px; color: var(--text-light);
  }

  /* ─── FOOTER ─── */
  .footer { background: var(--primary-dark); color: rgba(255,255,255,0.7); padding: 64px 24px 24px; }
  .footer-grid {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 40px; max-width: 1120px; margin: 0 auto;
  }
  .footer h4 {
    font-family: var(--serif); color: white; font-size: 18px;
    margin-bottom: 20px; font-weight: 400;
  }
  .footer p { font-size: 14px; line-height: 1.7; margin-bottom: 16px; }
  .footer-links a {
    display: block; color: rgba(255,255,255,0.6); text-decoration: none;
    font-size: 14px; padding: 4px 0; transition: color 0.3s;
  }
  .footer-links a:hover { color: var(--accent); }
  .social-icons { display: flex; gap: 12px; }
  .social-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.08); display: flex;
    align-items: center; justify-content: center;
    color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.3s;
  }
  .social-icon:hover { background: var(--accent); color: var(--primary-dark); }
  .footer-radio {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 14px; display: flex; align-items: center; gap: 12px;
  }
  .radio-play-btn {
    width: 40px; height: 40px; border-radius: 50%; background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0; color: var(--primary-dark);
  }
  .footer-bottom {
    max-width: 1120px; margin: 40px auto 0; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; flex-wrap: wrap; gap: 8px;
  }
  .footer-bottom a { color: rgba(255,255,255,0.5); text-decoration: none; }
  .footer-bottom a:hover { color: var(--accent); }

  /* ─── WHATSAPP FAB ─── */
  .whatsapp-fab {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    width: 60px; height: 60px; border-radius: 50%;
    background: #25D366; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 20px rgba(37,211,102,0.4);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .whatsapp-fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.5); }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    .nav-links { display: none; }
    .mobile-menu-btn { display: block; }
    .finder-layout { grid-template-columns: 1fr; text-align: center; }
    .chile-map { margin-bottom: 32px; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .hero-ctas { flex-direction: column; align-items: center; }
    .btn-gold, .btn-outline { width: 100%; max-width: 320px; text-align: center; }
    .blog-grid, .testimony-track { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
    .section { padding: 64px 20px; }
    .nav { padding: 12px 20px; }
  }
`;

// ─── CHILE MAP SVG (simplified) ───
const ChileMapSVG = () => {
    const cities = [
        { name: "Arica", top: "2%", left: "55%" },
        { name: "Iquique", top: "8%", left: "52%" },
        { name: "Antofagasta", top: "17%", left: "50%" },
        { name: "La Serena", top: "30%", left: "42%" },
        { name: "Valparaíso", top: "42%", left: "38%" },
        { name: "Santiago", top: "45%", left: "44%" },
        { name: "Rancagua", top: "49%", left: "43%" },
        { name: "Concepción", top: "60%", left: "40%" },
        { name: "Temuco", top: "68%", left: "42%" },
        { name: "Puerto Montt", top: "76%", left: "40%" },
        { name: "Punta Arenas", top: "95%", left: "38%" },
    ];
    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 200, height: 500, margin: "0 auto" }}>
            {/* Simplified Chile shape */}
            <svg viewBox="0 0 100 500" style={{ width: "100%", height: "100%" }}>
                <path
                    d="M55 5 Q60 10, 52 30 Q48 50, 50 70 Q52 90, 48 120 Q44 150, 42 180 Q38 210, 40 240 Q42 270, 40 300 Q38 330, 42 360 Q44 390, 40 420 Q38 440, 40 460 Q42 475, 38 490 L35 495 Q30 490, 35 460 Q32 430, 34 400 Q30 370, 32 340 Q28 310, 30 280 Q28 250, 32 220 Q34 190, 38 160 Q40 130, 42 100 Q44 70, 48 40 Q50 20, 55 5"
                    fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                />
            </svg>
            {cities.map((city, i) => (
                <div key={i} className="map-dot" style={{ top: city.top, left: city.left, animationDelay: `${i * 0.2}s` }} title={city.name} />
            ))}
        </div>
    );
};

// ═══════════════════════════════════════
// ─── MAIN COMPONENT ─────────────────
// ═══════════════════════════════════════
export default function MMMChileHomepage() {
    const [scrolled, setScrolled] = useState(false);
    const [email, setEmail] = useState("");
    const [searchCity, setSearchCity] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const testimonies = [
        { initials: "C", name: "Carlos M., Santiago", quote: "Estaba hundido en la depresión. Un día entré a una iglesia sin esperanza, y encontré algo que cambió todo. Hoy tengo paz." },
        { initials: "M", name: "María P., Concepción", quote: "Mi matrimonio estaba destruido. A través de la comunidad y la fe, restauramos lo que creíamos perdido para siempre." },
        { initials: "D", name: "Diego R., Antofagasta", quote: "Las adicciones me tenían atrapado. Encontré libertad real y un propósito que nunca imaginé que existiera." },
    ];

    const blogs = [
        { tag: "Preguntas de Vida", title: "¿Existe Dios? Lo que la ciencia y la fe tienen en común", excerpt: "Una mirada honesta a la pregunta más importante que puedes hacerte en la vida.", bg: "linear-gradient(135deg, #1E3A5F, #2a5280)" },
        { tag: "Bienestar", title: "Cómo Superar la Ansiedad: Una Perspectiva de Esperanza", excerpt: "Estrategias prácticas y una fuente de paz que va más allá de las técnicas convencionales.", bg: "linear-gradient(135deg, #3a2518, #5a3828)" },
        { tag: "Fe y Eternidad", title: "¿Qué Pasa Después de la Muerte?", excerpt: "La pregunta que todos nos hacemos tarde o temprano, explorada con honestidad y esperanza.", bg: "linear-gradient(135deg, #2d1f3d, #4a3560)" },
    ];

    const churches = [
        { city: "Santiago Centro", address: "Av. Libertador Bernardo O'Higgins 1234" },
        { city: "Providencia", address: "Av. Providencia 567, Santiago" },
        { city: "Concepción", address: "Calle Barros Arana 890" },
    ];

    return (
        <>
            <style>{css}</style>
            <div style={{ overflowX: "hidden" }}>

                {/* ═══ NAV ═══ */}
                <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
                    <a className="nav-logo" href="/">
                        <span className="cross-mark">✦</span>
                        MMM Chile
                    </a>
                    <div className="nav-links">
                        <a href="/conoce-a-jesus">Conoce a Jesús</a>
                        <a href="/iglesias">Iglesias</a>
                        <a href="/blog">Blog</a>
                        <a href="/doctrina">Doctrina</a>
                        <a href="/oracion">Oración</a>
                        <a href="/contacto" className="nav-cta">Contáctanos</a>
                    </div>
                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {mobileMenuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            }
                        </svg>
                    </button>
                </nav>

                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                    <div style={{
                        position: "fixed", top: 56, left: 0, right: 0, zIndex: 99,
                        background: "rgba(15,32,53,0.97)", backdropFilter: "blur(12px)",
                        padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12
                    }}>
                        {["Conoce a Jesús", "Iglesias", "Blog", "Doctrina", "Oración", "Contáctanos"].map((l, i) => (
                            <a key={i} href="#" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 16, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{l}</a>
                        ))}
                    </div>
                )}

                {/* ═══ HERO ═══ */}
                <section className="hero">
                    <div className="hero-bg">
                        {/* Bokeh elements for warm worship feel */}
                        <div className="bokeh" style={{ width: 300, height: 300, background: "radial-gradient(circle, rgba(212,168,67,0.5), transparent)", top: "20%", left: "10%", animationDelay: "0s" }} />
                        <div className="bokeh" style={{ width: 250, height: 250, background: "radial-gradient(circle, rgba(180,140,200,0.4), transparent)", top: "40%", right: "15%", animationDelay: "2s" }} />
                        <div className="bokeh" style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(200,120,80,0.4), transparent)", bottom: "20%", left: "30%", animationDelay: "4s" }} />
                        <div className="bokeh" style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(212,168,67,0.3), transparent)", top: "60%", right: "30%", animationDelay: "1s" }} />
                        <div className="bokeh" style={{ width: 350, height: 350, background: "radial-gradient(circle, rgba(255,200,150,0.2), transparent)", top: "10%", right: "5%", animationDelay: "3s" }} />
                    </div>
                    <div className="hero-overlay" />
                    <CrossPattern opacity={0.03} color="white" />

                    <div className="hero-content">
                        <FadeIn delay={0.1}>
                            <div className="hero-eyebrow">MMM Chile</div>
                        </FadeIn>
                        <FadeIn delay={0.25}>
                            <h1>¿Buscas algo más<br />en la vida?</h1>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <p className="hero-subtitle">
                                Miles de personas en Chile han encontrado esperanza, paz y propósito. Tú también puedes.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.55}>
                            <div className="hero-ctas">
                                <button className="btn-gold">Quiero Conocer a Jesús</button>
                                <button className="btn-outline">Encuentra una Iglesia Cerca de Ti</button>
                            </div>
                        </FadeIn>
                    </div>

                    <div className="scroll-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </section>

                {/* ═══ SECTION 2: INTENT ROUTING ═══ */}
                <section className="section" style={{ background: "white" }}>
                    <div className="section-inner">
                        <FadeIn>
                            <h2 className="section-title">¿Qué estás buscando hoy?</h2>
                            <p className="section-subtitle">Sea lo que sea que te trajo aquí, estás en el lugar correcto</p>
                        </FadeIn>
                        <div className="intent-grid">
                            {[
                                { icon: <HeartIcon />, title: "Paz interior", desc: "Descubre cómo encontrar verdadera paz en medio del ruido y las preocupaciones", link: "/conoce-a-jesus" },
                                { icon: <PeopleIcon />, title: "Comunidad", desc: "Encuentra una familia de fe cerca de ti donde pertenecer y crecer", link: "/iglesias" },
                                { icon: <PrayIcon />, title: "Necesito oración", desc: "Comparte tu necesidad — hay personas reales que orarán por ti", link: "/oracion" },
                                { icon: <BookIcon />, title: "Estudiar la Biblia", desc: "Planes de lectura y recursos gratuitos para explorar a tu ritmo", link: "/plan-de-lectura" },
                            ].map((card, i) => (
                                <FadeIn key={i} delay={0.1 + i * 0.1}>
                                    <div className="intent-card" onClick={() => { }}>
                                        <div className="intent-icon">{card.icon}</div>
                                        <h3>{card.title}</h3>
                                        <p>{card.desc}</p>
                                        <span className="intent-link">Explorar <ArrowRight /></span>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══ SECTION 3: TESTIMONIES ═══ */}
                <section className="section" style={{ background: COLORS.cream, position: "relative" }}>
                    <CrossPattern opacity={0.025} />
                    <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
                        <FadeIn>
                            <h2 className="section-title">Vidas Transformadas</h2>
                            <p className="section-subtitle">Historias reales de personas como tú</p>
                        </FadeIn>
                        <div className="testimony-track">
                            {testimonies.map((t, i) => (
                                <FadeIn key={i} delay={0.1 + i * 0.12}>
                                    <div className="testimony-card">
                                        <div className="testimony-avatar">{t.initials}</div>
                                        <div className="testimony-quote">{t.quote}</div>
                                        <div className="testimony-name">{t.name}</div>
                                        <div className="testimony-link">Leer historia completa <ArrowRight /></div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn delay={0.5}>
                            <div style={{ textAlign: "center", marginTop: 40 }}>
                                <a href="/testimonios" style={{ color: COLORS.accent, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                                    Ver más testimonios <ArrowRight />
                                </a>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ═══ SECTION 4: BLOG ═══ */}
                <section className="section" style={{ background: "white" }}>
                    <div className="section-inner">
                        <FadeIn>
                            <h2 className="section-title">Reflexiones para Tu Vida</h2>
                            <p className="section-subtitle">Artículos que responden preguntas reales con esperanza real</p>
                        </FadeIn>
                        <div className="blog-grid">
                            {blogs.map((b, i) => (
                                <FadeIn key={i} delay={0.1 + i * 0.12}>
                                    <div className="blog-card">
                                        <div className="blog-img">
                                            <div className="blog-img-inner" style={{ background: b.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <span style={{ fontFamily: "var(--serif)", fontSize: 48, color: "rgba(255,255,255,0.08)" }}>✦</span>
                                            </div>
                                            <span className="blog-tag">{b.tag}</span>
                                        </div>
                                        <div className="blog-body">
                                            <h3>{b.title}</h3>
                                            <p>{b.excerpt}</p>
                                            <span className="blog-readmore">Leer más <ArrowRight /></span>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                        <FadeIn delay={0.5}>
                            <div style={{ textAlign: "center", marginTop: 44 }}>
                                <button className="btn-gold" style={{ fontSize: 15, padding: "14px 28px" }}>Ver todos los artículos →</button>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* ═══ SECTION 5: CHURCH FINDER ═══ */}
                <section className="section" style={{ background: COLORS.primary }}>
                    <div className="section-inner">
                        <FadeIn>
                            <h2 className="section-title light">Hay una Iglesia Esperándote</h2>
                            <p className="section-subtitle light">Más de 30 iglesias en todo Chile, desde Arica hasta Punta Arenas</p>
                        </FadeIn>
                        <div className="finder-layout">
                            <FadeIn delay={0.15} direction="right">
                                <ChileMapSVG />
                            </FadeIn>
                            <FadeIn delay={0.25} direction="left">
                                <div>
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            placeholder="Ingresa tu ciudad o comuna"
                                            value={searchCity}
                                            onChange={(e) => setSearchCity(e.target.value)}
                                        />
                                        <button><SearchIcon /></button>
                                    </div>
                                    {churches.map((c, i) => (
                                        <div key={i} className="church-mini-card">
                                            <h4>{c.city}</h4>
                                            <p><MapPinIcon /> {c.address}</p>
                                            <span className="church-mini-link">Ver horarios <ArrowRight size={12} /></span>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: 24 }}>
                                        <button className="btn-gold" style={{ width: "100%" }}>Encontrar Iglesia Más Cercana</button>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* ═══ SECTION 6: LIVE STREAM ═══ */}
                <section className="live-banner">
                    <CrossPattern opacity={0.02} color="white" />
                    <div style={{ position: "relative", zIndex: 1 }}>
                        <div className="live-badge">
                            <span className="live-dot" />
                            Culto en Vivo
                        </div>
                        <h2 className="live-title">Conéctate Desde Donde Estés</h2>
                        <p className="live-schedule">Domingos 11:00 AM y 5:00 PM · Miércoles 7:00 PM</p>
                        <div className="live-btns">
                            <button className="btn-live-radio"><RadioIcon /> Escuchar Radio en Vivo</button>
                            <button className="btn-live-video"><PlayIcon /> Ver Transmisión</button>
                        </div>
                    </div>
                </section>

                {/* ═══ SECTION 7: NEWSLETTER ═══ */}
                <section className="section newsletter">
                    <div className="section-inner">
                        <FadeIn>
                            <h2 className="section-title">Recibe Esperanza en Tu Correo</h2>
                            <p className="section-subtitle">Devocionales, testimonios y reflexiones semanales directamente en tu bandeja de entrada</p>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button>Suscribirme</button>
                            </div>
                            <p className="newsletter-proof">Más de 1,000 personas ya reciben nuestros mensajes ✦</p>
                        </FadeIn>
                    </div>
                </section>

                {/* ═══ FOOTER ═══ */}
                <footer className="footer">
                    <div className="footer-grid">
                        {/* Col 1: About */}
                        <div>
                            <h4>Movimiento Misionero Mundial</h4>
                            <p>Somos una comunidad de fe presente en más de 80 países, con el propósito de compartir esperanza y transformar vidas a través del amor de Dios.</p>
                            <p style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.4)" }}>
                                "Encuentra esperanza, propósito y comunidad"
                            </p>
                            <div className="social-icons">
                                {["f", "in", "▶", "✦"].map((icon, i) => (
                                    <div key={i} className="social-icon">{icon}</div>
                                ))}
                            </div>
                        </div>

                        {/* Col 2: Links */}
                        <div>
                            <h4>Enlaces</h4>
                            <div className="footer-links">
                                {["Conoce a Jesús", "Iglesias", "Blog", "Oración", "Doctrina", "Testimonios", "Plan de Lectura"].map((l, i) => (
                                    <a key={i} href="#">{l}</a>
                                ))}
                            </div>
                        </div>

                        {/* Col 3: Contact */}
                        <div>
                            <h4>Contacto</h4>
                            <p style={{ fontSize: 14 }}>
                                Santiago, Chile<br />
                                +56 9 1234 5678<br />
                                contacto@mmmchile.cl
                            </p>
                            <a href="#" style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)",
                                padding: "8px 16px", borderRadius: 8, color: "#25D366",
                                textDecoration: "none", fontSize: 14, fontWeight: 600
                            }}>
                                <span style={{ fontSize: 16 }}>💬</span> WhatsApp
                            </a>
                        </div>

                        {/* Col 4: Radio */}
                        <div>
                            <h4>Radio Bethel</h4>
                            <div className="footer-radio">
                                <div className="radio-play-btn"><PlayIcon /></div>
                                <div>
                                    <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>En Vivo</div>
                                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Radio Bethel 24/7</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>© 2026 Movimiento Misionero Mundial Chile. Todos los derechos reservados.</span>
                        <a href="/privacidad">Política de Privacidad</a>
                    </div>
                </footer>

                {/* ═══ WHATSAPP FAB ═══ */}
                <button className="whatsapp-fab" aria-label="WhatsApp">
                    <WhatsAppIcon />
                </button>
            </div>
        </>
    );
}