import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════
const C = {
    primary: "#1E3A5F", primaryDark: "#0F2035",
    accent: "#D4A843", accentLight: "#E8C976", accentPale: "#F5E6C4",
    cream: "#F8F6F0", white: "#FFFFFF",
    text: "#2C2C2C", muted: "#7A7574", light: "#A8A09C",
    border: "#E8E2D8", green: "#25D366",
    warmBg: "#FDF8F0",
    cardA: "#F0F4F8", cardB: "#FDF6EA", cardC: "#FFFFFF", cardD: "#F4F0F8",
};

// ═══════════════════════════════════════
// INITIAL PRAYER WALL DATA
// ═══════════════════════════════════════
const INITIAL_PRAYERS = [
    { id: 1, name: "María", text: "Pido oración por mi hijo que está enfermo. Los médicos no dan muchas esperanzas pero yo confío en Dios.", date: "Hace 2 horas", prayCount: 34, color: C.cardA },
    { id: 2, name: "Anónimo", text: "Estoy pasando por una depresión muy fuerte. Necesito paz y fuerzas para seguir adelante.", date: "Hace 4 horas", prayCount: 52, color: C.cardB },
    { id: 3, name: "Carlos", text: "Mi matrimonio está en crisis. Oramos para que Dios restaure nuestra relación y nos dé sabiduría.", date: "Hace 6 horas", prayCount: 28, color: C.cardC },
    { id: 4, name: "Anónimo", text: "Pido trabajo. Llevo meses buscando y la ansiedad me está consumiendo. Necesito provisión.", date: "Hace 8 horas", prayCount: 41, color: C.cardD },
    { id: 5, name: "Valentina", text: "Oración por mi mamá que será operada mañana. Que Dios guíe las manos de los doctores.", date: "Hace 10 horas", prayCount: 67, color: C.cardA },
    { id: 6, name: "Diego", text: "Estoy luchando contra una adicción. Sé que Dios puede liberarme pero necesito ayuda.", date: "Hace 12 horas", prayCount: 45, color: C.cardB },
    { id: 7, name: "Anónimo", text: "Pido oración por paz en mi corazón. He perdido a alguien muy importante y el dolor es inmenso.", date: "Hace 1 día", prayCount: 38, color: C.cardC },
    { id: 8, name: "Francisca", text: "Oración por mi familia. Hay mucha división y necesitamos que el amor de Dios nos una de nuevo.", date: "Hace 1 día", prayCount: 29, color: C.cardD },
    { id: 9, name: "Roberto", text: "Pido sanidad para mi padre que lucha contra el cáncer. Creemos en milagros.", date: "Hace 2 días", prayCount: 73, color: C.cardA },
    { id: 10, name: "Anónimo", text: "Necesito dirección. No sé qué hacer con mi vida y me siento perdido. Necesito escuchar la voz de Dios.", date: "Hace 2 días", prayCount: 31, color: C.cardB },
    { id: 11, name: "Camila", text: "Oración por mis hijos adolescentes. Que Dios los proteja y los guíe en este mundo difícil.", date: "Hace 3 días", prayCount: 44, color: C.cardC },
    { id: 12, name: "Anónimo", text: "Pido por sanidad emocional. Cargo heridas de mi infancia que no me dejan avanzar.", date: "Hace 3 días", prayCount: 36, color: C.cardD },
];

const VERSES = [
    { text: "Echa toda tu ansiedad sobre él, porque él tiene cuidado de ti.", ref: "1 Pedro 5:7" },
    { text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", ref: "Mateo 11:28" },
    { text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", ref: "Jeremías 33:3" },
    { text: "Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.", ref: "Salmos 23:1-2" },
    { text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.", ref: "Isaías 41:10" },
    { text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.", ref: "Juan 14:27" },
];

// ═══════════════════════════════════════
// ICONS
// ═══════════════════════════════════════
const BackIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ArrowIco = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const CheckIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const HandsPraying = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.85 }}>
        <circle cx="40" cy="40" r="36" fill="url(#prayGlow)" />
        {/* Candle flame */}
        <path d="M40 15 Q44 22 44 28 Q44 33 40 35 Q36 33 36 28 Q36 22 40 15Z" fill={C.accent} opacity="0.6" />
        <path d="M40 18 Q42.5 23 42.5 27 Q42.5 31 40 32.5 Q37.5 31 37.5 27 Q37.5 23 40 18Z" fill={C.accent} opacity="0.9" />
        <ellipse cx="40" cy="27" rx="2" ry="3" fill="#FFF5E0" opacity="0.7" />
        {/* Candle body */}
        <rect x="37" y="35" width="6" height="20" rx="2" fill="rgba(255,255,255,0.35)" stroke={C.accent} strokeWidth="0.8" opacity="0.5" />
        {/* Glow rays */}
        {[0, 1, 2, 3, 4, 5].map(i => {
            const a = (i * Math.PI / 3) - Math.PI / 2;
            return <line key={i} x1={40 + Math.cos(a) * 8} y1={26 + Math.sin(a) * 8} x2={40 + Math.cos(a) * 16} y2={26 + Math.sin(a) * 16} stroke={C.accent} strokeWidth="0.6" opacity="0.25" />;
        })}
        <defs><radialGradient id="prayGlow"><stop offset="0%" stopColor={C.accent} stopOpacity="0.12" /><stop offset="100%" stopColor={C.accent} stopOpacity="0" /></radialGradient></defs>
    </svg>
);

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Karla:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--serif:'Playfair Display',Georgia,serif;--sans:'Karla',system-ui,sans-serif;--primary:${C.primary};--accent:${C.accent};--cream:${C.cream};}
body{font-family:var(--sans);color:${C.text};background:${C.warmBg};}

/* HEADER */
.or-header{
  position:sticky;top:0;z-index:50;
  background:rgba(253,248,240,0.93);backdrop-filter:blur(14px);
  border-bottom:1px solid ${C.border};padding:12px 24px;
  display:flex;align-items:center;justify-content:space-between;
}
.or-logo{font-family:var(--serif);font-size:19px;color:${C.primary};text-decoration:none;display:flex;align-items:center;gap:8px;}
.or-logo .mark{display:inline-flex;width:28px;height:28px;border-radius:5px;align-items:center;justify-content:center;border:1.5px solid ${C.accent};color:${C.accent};font-size:13px;}
.or-back{font-size:14px;color:${C.muted};text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:600;background:none;border:none;cursor:pointer;transition:color 0.2s;font-family:var(--sans);}
.or-back:hover{color:${C.primary};}

/* HERO */
.or-hero{
  text-align:center;padding:56px 24px 40px;position:relative;overflow:hidden;
  background:linear-gradient(180deg,#FDF8F0 0%,#F8EFE0 50%,#FDF8F0 100%);
}
.or-hero::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 20%,rgba(212,168,67,0.1) 0%,transparent 60%);
}
.hero-rays{
  position:absolute;top:-30%;left:50%;transform:translateX(-50%);
  width:600px;height:600px;opacity:0.04;
  background:conic-gradient(from 0deg,transparent 0deg,${C.accent} 1.5deg,transparent 3deg,
    transparent 20deg,${C.accent} 21.5deg,transparent 23deg,
    transparent 40deg,${C.accent} 41.5deg,transparent 43deg,
    transparent 60deg,${C.accent} 61.5deg,transparent 63deg,
    transparent 80deg,${C.accent} 81.5deg,transparent 83deg,
    transparent 100deg,${C.accent} 101.5deg,transparent 103deg,
    transparent 120deg,${C.accent} 121.5deg,transparent 123deg,
    transparent 140deg,${C.accent} 141.5deg,transparent 143deg,
    transparent 160deg,${C.accent} 161.5deg,transparent 163deg,
    transparent 180deg,${C.accent} 181.5deg,transparent 183deg,
    transparent 200deg,${C.accent} 201.5deg,transparent 203deg,
    transparent 220deg,${C.accent} 221.5deg,transparent 223deg,
    transparent 240deg,${C.accent} 241.5deg,transparent 243deg,
    transparent 260deg,${C.accent} 261.5deg,transparent 263deg,
    transparent 280deg,${C.accent} 281.5deg,transparent 283deg,
    transparent 300deg,${C.accent} 301.5deg,transparent 303deg,
    transparent 320deg,${C.accent} 321.5deg,transparent 323deg,
    transparent 340deg,${C.accent} 341.5deg,transparent 343deg);
  border-radius:50%;animation:slowSpin 180s linear infinite;
}
@keyframes slowSpin{to{transform:translateX(-50%) rotate(360deg);}}
.or-hero .illust{position:relative;z-index:1;margin-bottom:8px;}
.or-hero h1{
  font-family:var(--serif);font-size:clamp(28px,5vw,44px);
  color:${C.primary};line-height:1.25;max-width:600px;
  margin:0 auto 12px;font-weight:500;position:relative;z-index:1;
}
.or-hero .sub{
  font-size:clamp(15px,2vw,17px);color:${C.muted};
  max-width:480px;margin:0 auto;line-height:1.7;font-weight:400;
  position:relative;z-index:1;
}

/* MAIN LAYOUT */
.or-main{max-width:1100px;margin:0 auto;padding:0 24px 60px;display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start;}

/* FORM CARD */
.form-card{
  background:white;border-radius:20px;padding:40px 36px;
  border:1px solid ${C.border};
  box-shadow:0 8px 40px rgba(30,58,95,0.04),0 1px 3px rgba(0,0,0,0.03);
}
.form-card h2{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:6px;font-weight:500;}
.form-card .form-sub{font-size:14px;color:${C.muted};margin-bottom:28px;line-height:1.6;}
.fg{margin-bottom:20px;}
.fg label{display:block;font-size:13px;font-weight:700;color:${C.muted};margin-bottom:6px;letter-spacing:0.3px;}
.fg .optional{font-weight:400;color:${C.light};font-style:italic;}
.fg input,.fg textarea,.fg select{
  width:100%;padding:14px 16px;
  border:1.5px solid ${C.border};border-radius:12px;
  font-size:15px;font-family:var(--sans);background:${C.cream};
  color:${C.text};outline:none;transition:all 0.3s;resize:vertical;
}
.fg input:focus,.fg textarea:focus{border-color:${C.accent};background:white;box-shadow:0 0 0 3px rgba(212,168,67,0.08);}
.fg input::placeholder,.fg textarea::placeholder{color:#BEB6AE;}
.fg textarea{min-height:140px;line-height:1.7;}
.checkbox-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;cursor:pointer;}
.checkbox-row input[type="checkbox"]{display:none;}
.custom-check{
  width:22px;height:22px;border-radius:6px;border:1.5px solid ${C.border};
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  background:${C.cream};transition:all 0.2s;margin-top:1px;
}
.custom-check.checked{background:${C.accent};border-color:${C.accent};}
.checkbox-label{font-size:14px;color:${C.text};line-height:1.5;user-select:none;}
.btn-submit{
  width:100%;padding:16px;border-radius:12px;border:none;
  background:${C.accent};color:${C.primaryDark};
  font-size:16px;font-weight:800;font-family:var(--sans);
  cursor:pointer;transition:all 0.3s;margin-top:8px;
  box-shadow:0 4px 20px rgba(212,168,67,0.25);
}
.btn-submit:hover{background:${C.accentLight};transform:translateY(-2px);box-shadow:0 6px 28px rgba(212,168,67,0.35);}
.btn-submit:active{transform:translateY(0);}
.form-trust{margin-top:14px;font-size:13px;color:${C.light};text-align:center;line-height:1.5;}

/* SUCCESS ANIMATION */
.success-card{
  text-align:center;padding:48px 32px;
  animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1);
}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.success-check{
  width:72px;height:72px;border-radius:50%;
  background:linear-gradient(135deg,${C.accent},${C.accentLight});
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 20px;animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both;
}
@keyframes popIn{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
.success-card h2{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:8px;}
.success-card p{font-size:15px;color:${C.muted};line-height:1.7;max-width:380px;margin:0 auto;}
.btn-new{
  margin-top:24px;padding:12px 28px;border-radius:10px;
  background:transparent;border:1.5px solid ${C.border};
  font-size:14px;font-weight:700;color:${C.primary};
  cursor:pointer;font-family:var(--sans);transition:all 0.2s;
}
.btn-new:hover{border-color:${C.accent};color:${C.accent};}

/* SIDEBAR */
.or-sidebar{display:flex;flex-direction:column;gap:24px;position:sticky;top:80px;}

/* VERSE CAROUSEL */
.verse-carousel{
  background:white;border-radius:20px;padding:32px 28px;
  border:1px solid ${C.border};position:relative;overflow:hidden;
  box-shadow:0 4px 20px rgba(30,58,95,0.03);
}
.verse-carousel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,${C.accent},${C.accentPale},${C.accent});
}
.vc-title{font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${C.accent};margin-bottom:20px;}
.vc-text{font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.7;color:${C.primary};margin-bottom:12px;min-height:96px;transition:opacity 0.5s;}
.vc-ref{font-size:13px;font-weight:700;color:${C.accent};margin-bottom:16px;}
.vc-dots{display:flex;gap:6px;justify-content:center;}
.vc-dot{width:8px;height:8px;border-radius:50%;background:${C.border};cursor:pointer;transition:all 0.3s;}
.vc-dot.active{background:${C.accent};width:20px;border-radius:4px;}

/* SIDEBAR PROMO CARDS */
.sb-link-card{
  background:white;border-radius:16px;padding:24px;
  border:1px solid ${C.border};transition:all 0.3s;cursor:pointer;
  box-shadow:0 2px 12px rgba(0,0,0,0.02);
}
.sb-link-card:hover{border-color:${C.accent};transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.05);}
.sb-link-card h3{font-family:var(--serif);font-size:17px;color:${C.primary};margin-bottom:6px;font-weight:500;}
.sb-link-card p{font-size:13px;color:${C.muted};line-height:1.6;margin-bottom:12px;}
.sb-link-arrow{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:${C.accent};transition:gap 0.3s;}
.sb-link-card:hover .sb-link-arrow{gap:9px;}
.sb-special{border-left:3px solid ${C.accent};background:linear-gradient(135deg,rgba(212,168,67,0.04),white);}

/* ═══ PRAYER WALL ═══ */
.wall-section{
  max-width:1100px;margin:0 auto;padding:60px 24px 80px;
}
.wall-header{text-align:center;margin-bottom:36px;}
.wall-header h2{font-family:var(--serif);font-size:clamp(26px,4vw,36px);color:${C.primary};margin-bottom:8px;font-weight:500;}
.wall-header .sub{font-size:15px;color:${C.muted};line-height:1.6;}
.wall-filters{display:flex;gap:8px;justify-content:center;margin-bottom:32px;}
.wf-btn{
  padding:8px 18px;border-radius:20px;font-size:13px;font-weight:700;
  border:1.5px solid ${C.border};background:white;color:${C.muted};
  cursor:pointer;font-family:var(--sans);transition:all 0.2s;
}
.wf-btn:hover{border-color:${C.accent};color:${C.primary};}
.wf-btn.active{background:${C.primary};color:white;border-color:${C.primary};}

/* MASONRY GRID */
.wall-grid{
  columns:3;column-gap:20px;
}
.wall-card{
  break-inside:avoid;margin-bottom:20px;
  border-radius:16px;padding:24px;
  border:1px solid ${C.border};
  transition:all 0.3s;
  animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.wall-card:hover{box-shadow:0 6px 24px rgba(0,0,0,0.05);transform:translateY(-2px);}
.wc-name{font-weight:700;font-size:14px;color:${C.primary};margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.wc-name .name-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0;}
.wc-text{font-size:15px;color:#4a4a4a;line-height:1.7;margin-bottom:14px;}
.wc-footer{display:flex;align-items:center;justify-content:space-between;}
.wc-date{font-size:12px;color:${C.light};}
.wc-pray-btn{
  display:flex;align-items:center;gap:6px;padding:8px 14px;
  border-radius:20px;border:1.5px solid ${C.border};
  background:white;font-size:12px;font-weight:700;color:${C.muted};
  cursor:pointer;font-family:var(--sans);transition:all 0.25s;
}
.wc-pray-btn:hover{border-color:${C.accent};color:${C.accent};background:rgba(212,168,67,0.04);}
.wc-pray-btn.prayed{border-color:${C.accent};color:${C.accent};background:rgba(212,168,67,0.08);}
.wc-pray-btn .pray-hands{font-size:14px;transition:transform 0.3s;}
.wc-pray-btn.prayed .pray-hands{transform:scale(1.2);}
.wc-count{font-weight:800;color:${C.accent};transition:transform 0.3s;}

/* LOAD MORE */
.wall-more{text-align:center;margin-top:32px;}
.btn-more{
  padding:14px 36px;border-radius:12px;background:white;
  border:1.5px solid ${C.border};font-size:14px;font-weight:700;
  color:${C.primary};cursor:pointer;font-family:var(--sans);transition:all 0.2s;
}
.btn-more:hover{border-color:${C.accent};color:${C.accent};}

/* BOTTOM CTA */
.or-bottom{
  padding:48px 24px;text-align:center;position:relative;
  background:linear-gradient(135deg,${C.accentPale},#F0DDB8);overflow:hidden;
}
.or-bottom::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,0.5) 0%,transparent 60%);}
.or-bottom h3{font-family:var(--serif);font-size:clamp(22px,3.5vw,30px);color:${C.primary};margin-bottom:8px;position:relative;}
.or-bottom .sub{font-size:15px;color:${C.muted};margin-bottom:24px;line-height:1.6;position:relative;}
.btn-conoce{
  display:inline-flex;align-items:center;gap:8px;padding:14px 30px;
  border-radius:10px;background:${C.accent};color:${C.primaryDark};
  font-size:15px;font-weight:800;border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;position:relative;
  box-shadow:0 4px 16px rgba(212,168,67,0.25);
}
.btn-conoce:hover{background:${C.accentLight};transform:translateY(-2px);}

/* FOOTER */
.or-footer{padding:20px 24px;background:${C.primaryDark};text-align:center;font-size:13px;color:rgba(255,255,255,0.35);}
.or-footer a{color:${C.accent};text-decoration:none;}

/* RESPONSIVE */
@media(max-width:900px){
  .or-main{grid-template-columns:1fr;gap:32px;}
  .or-sidebar{position:static;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .verse-carousel{grid-column:1/-1;}
  .wall-grid{columns:2;}
}
@media(max-width:600px){
  .or-sidebar{grid-template-columns:1fr;}
  .wall-grid{columns:1;}
  .form-card{padding:28px 22px;}
  .or-hero{padding:40px 20px 28px;}
}

/* DIVIDER */
.warm-divider{
  max-width:1100px;margin:0 auto;padding:0 24px;
}
.warm-divider-inner{
  height:1px;
  background:linear-gradient(90deg,transparent,${C.border},${C.accent},${C.border},transparent);
  opacity:0.6;
}
`;

// ═══════════════════════════════════════
// VERSE CAROUSEL COMPONENT
// ═══════════════════════════════════════
const VerseCarousel = () => {
    const [idx, setIdx] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const iv = setInterval(() => {
            setFade(false);
            setTimeout(() => { setIdx(i => (i + 1) % VERSES.length); setFade(true); }, 400);
        }, 6000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className="verse-carousel">
            <div className="vc-title">Promesas de Dios para Ti</div>
            <div className="vc-text" style={{ opacity: fade ? 1 : 0 }}>
                "{VERSES[idx].text}"
            </div>
            <div className="vc-ref">— {VERSES[idx].ref}</div>
            <div className="vc-dots">
                {VERSES.map((_, i) => (
                    <div key={i} className={`vc-dot ${i === idx ? "active" : ""}`} onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 300); }} />
                ))}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════
// PRAYER CARD
// ═══════════════════════════════════════
const PrayerCard = ({ prayer, onPray, hasPrayed, animDelay }) => {
    const nameColors = ["#1E3A5F", "#7C3AED", "#0891B2", "#DC2626", "#059669", "#D4A843"];
    const colorIdx = prayer.name === "Anónimo" ? 0 : (prayer.name.charCodeAt(0) % nameColors.length);

    return (
        <div className="wall-card" style={{ background: prayer.color, animationDelay: `${animDelay}s` }}>
            <div className="wc-name">
                <div className="name-dot" style={{ background: nameColors[colorIdx] }}>
                    {prayer.name === "Anónimo" ? "?" : prayer.name[0]}
                </div>
                <span>{prayer.name}</span>
            </div>
            <div className="wc-text">{prayer.text}</div>
            <div className="wc-footer">
                <span className="wc-date">{prayer.date}</span>
                <button className={`wc-pray-btn ${hasPrayed ? "prayed" : ""}`} onClick={() => onPray(prayer.id)}>
                    <span className="pray-hands">🙏</span>
                    <span>Estoy orando</span>
                    <span className="wc-count">{prayer.prayCount + (hasPrayed ? 1 : 0)}</span>
                </button>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function OracionPage() {
    const [formData, setFormData] = useState({ nombre: "", peticion: "", contacto: "", showWall: false, wantContact: false });
    const [submitted, setSubmitted] = useState(false);
    const [prayedIds, setPrayedIds] = useState(new Set());
    const [wallFilter, setWallFilter] = useState("recientes"); // "recientes" | "oradas"
    const [wallCount, setWallCount] = useState(9);
    const [prayers, setPrayers] = useState(INITIAL_PRAYERS);

    const handleInput = (field, val) => setFormData(prev => ({ ...prev, [field]: val }));
    const toggleCheck = (field) => setFormData(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = () => {
        if (!formData.peticion.trim()) return;

        // Add to wall if public
        if (formData.showWall) {
            const newPrayer = {
                id: Date.now(),
                name: formData.nombre.trim() || "Anónimo",
                text: formData.peticion.trim(),
                date: "Ahora",
                prayCount: 0,
                color: [C.cardA, C.cardB, C.cardC, C.cardD][Math.floor(Math.random() * 4)],
            };
            setPrayers(prev => [newPrayer, ...prev]);
        }
        setSubmitted(true);
    };

    const handlePray = (id) => {
        setPrayedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const sortedPrayers = useMemo(() => {
        let list = [...prayers];
        if (wallFilter === "oradas") list.sort((a, b) => (b.prayCount + (prayedIds.has(b.id) ? 1 : 0)) - (a.prayCount + (prayedIds.has(a.id) ? 1 : 0)));
        return list;
    }, [prayers, wallFilter, prayedIds]);

    const resetForm = () => {
        setFormData({ nombre: "", peticion: "", contacto: "", showWall: false, wantContact: false });
        setSubmitted(false);
    };

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <header className="or-header">
                    <a className="or-logo" href="/"><span className="mark">✦</span> MMM Chile</a>
                    <a className="or-back" href="/"><BackIco /> Inicio</a>
                </header>

                {/* HERO */}
                <section className="or-hero">
                    <div className="hero-rays" />
                    <div className="illust"><HandsPraying /></div>
                    <h1>No Estás Solo.<br />Estamos Orando por Ti.</h1>
                    <p className="sub">Comparte tu necesidad y nuestro equipo de intercesión orará por ti esta semana.</p>
                </section>

                {/* MAIN: FORM + SIDEBAR */}
                <div className="or-main" style={{ paddingTop: 40 }}>

                    {/* FORM */}
                    <div className="form-card">
                        {!submitted ? (
                            <>
                                <h2>Tu Petición de Oración</h2>
                                <p className="form-sub">Cuéntanos qué está pasando en tu vida. Todo lo que compartas es tratado con cariño y confidencialidad.</p>

                                <div className="fg">
                                    <label>Tu nombre <span className="optional">(opcional)</span></label>
                                    <input type="text" placeholder="Puedes ser anónimo" value={formData.nombre} onChange={e => handleInput("nombre", e.target.value)} />
                                </div>

                                <div className="fg">
                                    <label>Tu petición de oración</label>
                                    <textarea placeholder="Cuéntanos qué necesitas. Dios escucha y nosotros oramos." value={formData.peticion} onChange={e => handleInput("peticion", e.target.value)} />
                                </div>

                                <div className="fg">
                                    <label>¿Cómo te contactamos? <span className="optional">(opcional)</span></label>
                                    <input type="text" placeholder="Email o WhatsApp, para darte seguimiento" value={formData.contacto} onChange={e => handleInput("contacto", e.target.value)} />
                                </div>

                                <div className="checkbox-row" onClick={() => toggleCheck("showWall")}>
                                    <input type="checkbox" checked={formData.showWall} readOnly />
                                    <div className={`custom-check ${formData.showWall ? "checked" : ""}`}>
                                        {formData.showWall && <CheckIco />}
                                    </div>
                                    <span className="checkbox-label">Quiero que mi petición aparezca en el muro de oración (anónimamente)</span>
                                </div>

                                <div className="checkbox-row" onClick={() => toggleCheck("wantContact")}>
                                    <input type="checkbox" checked={formData.wantContact} readOnly />
                                    <div className={`custom-check ${formData.wantContact ? "checked" : ""}`}>
                                        {formData.wantContact && <CheckIco />}
                                    </div>
                                    <span className="checkbox-label">Me gustaría que alguien me contacte para conversar</span>
                                </div>

                                <button className="btn-submit" onClick={handleSubmit}>Enviar Petición de Oración</button>
                                <p className="form-trust">🔒 Tu petición es confidencial. Solo nuestro equipo de intercesión la verá.</p>
                            </>
                        ) : (
                            <div className="success-card">
                                <div className="success-check">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h2>Tu petición fue recibida</h2>
                                <p>Estamos orando por ti 🙏<br /><br />Nuestro equipo de intercesión recibirá tu petición y orará por ti esta semana. No estás solo en esto — Dios te escucha y nosotros también.</p>
                                <button className="btn-new" onClick={resetForm}>Enviar otra petición</button>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="or-sidebar">
                        <VerseCarousel />

                        <div className="sb-link-card sb-special" onClick={() => { }}>
                            <h3>¿Quieres conocer al Dios que escucha tus oraciones?</h3>
                            <p>Hay alguien que te ama profundamente y quiere tener una relación contigo.</p>
                            <span className="sb-link-arrow">Conoce a Jesús <ArrowIco s={12} /></span>
                        </div>

                        <div className="sb-link-card" onClick={() => { }}>
                            <h3>¿Buscas una comunidad que ore contigo?</h3>
                            <p>Encuentra una iglesia cercana donde serás recibido como familia.</p>
                            <span className="sb-link-arrow">Encontrar iglesia <ArrowIco s={12} /></span>
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="warm-divider" style={{ padding: "40px 24px" }}>
                    <div className="warm-divider-inner" />
                </div>

                {/* PRAYER WALL */}
                <section className="wall-section">
                    <div className="wall-header">
                        <h2>Muro de Oración</h2>
                        <p className="sub">Únete en oración por estas necesidades. Tu oración importa.</p>
                    </div>

                    <div className="wall-filters">
                        <button className={`wf-btn ${wallFilter === "recientes" ? "active" : ""}`} onClick={() => setWallFilter("recientes")}>Más recientes</button>
                        <button className={`wf-btn ${wallFilter === "oradas" ? "active" : ""}`} onClick={() => setWallFilter("oradas")}>Más oradas</button>
                    </div>

                    <div className="wall-grid">
                        {sortedPrayers.slice(0, wallCount).map((p, i) => (
                            <PrayerCard
                                key={p.id}
                                prayer={p}
                                hasPrayed={prayedIds.has(p.id)}
                                onPray={handlePray}
                                animDelay={i * 0.04}
                            />
                        ))}
                    </div>

                    {wallCount < sortedPrayers.length && (
                        <div className="wall-more">
                            <button className="btn-more" onClick={() => setWallCount(c => c + 6)}>Ver más peticiones</button>
                        </div>
                    )}
                </section>

                {/* BOTTOM CTA */}
                <section className="or-bottom">
                    <h3>El Dios que Escucha Tus Oraciones Quiere Conocerte</h3>
                    <p className="sub">Si algo en tu corazón está buscando más, esta página es para ti.</p>
                    <button className="btn-conoce" onClick={() => { }}>
                        Conoce a Jesús <ArrowIco />
                    </button>
                </section>

                {/* FOOTER */}
                <footer className="or-footer">
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/">mmmchile.cl</a>
                </footer>
            </div>
        </>
    );
}