import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════
const C = {
    primary: "#1E3A5F", primaryDark: "#0F2035",
    accent: "#D4A843", accentLight: "#E8C976", accentPale: "#F5E6C4",
    cream: "#F8F6F0", white: "#FFFFFF",
    text: "#2C2C2C", muted: "#6B7280", light: "#9CA3AF",
    border: "#E8E2D8", green: "#059669", greenBg: "#ECFDF5",
    blue: "#0891B2", blueBg: "#ECFEFF",
};

// ═══════════════════════════════════════
// PLAN DATA
// ═══════════════════════════════════════
const PLANS = [
    {
        id: "conocer-a-dios",
        title: "21 Días para Conocer a Dios",
        tag: "Para Nuevos", tagColor: C.green, tagBg: C.greenBg,
        days: 21, minutes: 10,
        description: "¿Empezando tu camino de fe? Este plan es para ti. Descubre quién es Dios a través de 21 lecturas cortas y poderosas.",
        gradient: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #FFFDE7 100%)",
        accentColor: "#2E7D32",
        icon: "sprout",
        readings: [
            { day: 1, title: "Dios te Conoce", passage: "Salmo 139:1-18", reflection: "Antes de que el mundo existiera, Dios ya te conocía. Él sabe cuántos cabellos hay en tu cabeza, conoce tus pensamientos antes de que los pienses, y ha contado cada uno de tus días. No eres un desconocido para Él — eres profundamente conocido y amado.", prayer: "Dios, gracias por conocerme completamente y amarme tal como soy. Ayúdame a conocerte más cada día. Amén.", step: "Hoy, dedica 5 minutos a agradecer a Dios por 3 cosas específicas de tu vida." },
            { day: 2, title: "Dios te Ama", passage: "1 Juan 4:7-19", reflection: "El amor de Dios no depende de tu desempeño. No lo puedes ganar ni perder. Es un regalo constante e incondicional que fluye hacia ti en cada momento.", prayer: "Padre, ayúdame a comprender la profundidad de tu amor. Que hoy pueda sentir tu presencia. Amén.", step: "Escríbele una carta corta a Dios agradeciéndole por su amor. No necesita ser perfecta." },
            { day: 3, title: "Dios Escucha", passage: "Jeremías 33:3", reflection: "La oración no es un ritual — es una conversación. Dios quiere escucharte, no porque necesite información, sino porque quiere una relación contigo.", prayer: "Señor, gracias por escucharme siempre. Hoy quiero hablarte con el corazón abierto. Amén.", step: "Encuentra un lugar tranquilo y habla con Dios durante 5 minutos como si fuera un amigo." },
        ]
    },
    {
        id: "evangelio-juan",
        title: "30 Días en el Evangelio de Juan",
        tag: "Popular", tagColor: C.accent, tagBg: C.accentPale,
        days: 30, minutes: 15,
        description: "Descubre la vida de Jesús capítulo por capítulo. El evangelio que ha transformado más vidas en la historia.",
        gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFF3E0 50%, #FBE9E7 100%)",
        accentColor: "#E65100",
        icon: "book",
        readings: [
            { day: 1, title: "En el Principio", passage: "Juan 1:1-18", reflection: "Juan no comienza su evangelio con el nacimiento de Jesús, sino con el origen del universo. Jesús no es solo un maestro o profeta — es la Palabra eterna de Dios que se hizo carne para habitar entre nosotros.", prayer: "Jesús, ayúdame a verte no solo como un personaje histórico, sino como la Palabra viva de Dios. Amén.", step: "Lee Juan 1:1-18 dos veces: una rápida y otra lenta, subrayando lo que más te impacte." },
            { day: 2, title: "El Primer Milagro", passage: "Juan 2:1-12", reflection: "Jesús hace su primer milagro en una boda, transformando agua en vino. No es casualidad: su primera señal es una celebración, un acto de generosidad y alegría.", prayer: "Señor, transforma las áreas vacías de mi vida en algo nuevo y lleno de tu presencia. Amén.", step: "Piensa en un área de tu vida que necesita transformación y preséntala a Dios en oración." },
        ]
    },
    {
        id: "salmos-consuelo",
        title: "14 Salmos para Tiempos Difíciles",
        tag: "Todos", tagColor: C.blue, tagBg: C.blueBg,
        days: 14, minutes: 10,
        description: "Encuentra consuelo y fortaleza en los Salmos. Palabras escritas hace miles de años que siguen sanando corazones hoy.",
        gradient: "linear-gradient(135deg, #E3F2FD 0%, #E8EAF6 50%, #EDE7F6 100%)",
        accentColor: "#1565C0",
        icon: "mountain",
        readings: [
            { day: 1, title: "El Buen Pastor", passage: "Salmo 23", reflection: "Tal vez el salmo más conocido del mundo, y por una buena razón. En medio de cualquier valle oscuro, hay un Pastor que camina contigo. No estás solo.", prayer: "Señor, tú eres mi pastor. En medio de lo que estoy viviendo, ayúdame a confiar en que tú me guías. Amén.", step: "Memoriza el primer versículo: 'Jehová es mi pastor; nada me faltará.' Repítelo 3 veces durante el día." },
            { day: 2, title: "Cuando Tienes Miedo", passage: "Salmo 46", reflection: "Terremotos, tormentas, caos. Este salmo fue escrito en medio de la crisis — y su mensaje es claro: 'Estad quietos y conoced que yo soy Dios.'", prayer: "Dios, cuando todo parece desmoronarse, recuérdame que tú eres mi refugio y mi fortaleza. Amén.", step: "Cuando sientas ansiedad hoy, para un momento y repite: 'Dios es mi refugio.'" },
        ]
    },
];

// ═══════════════════════════════════════
// ICONS (SVG)
// ═══════════════════════════════════════
const BackIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ArrowIco = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const CloseIco = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const CheckIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>;

const SproutIcon = ({ size = 48, color = "#2E7D32" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill={color} opacity="0.08" />
        <path d="M24 36V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M24 22C24 22 20 18 20 14C20 10 24 8 24 8C24 8 28 10 28 14C28 18 24 22 24 22Z" fill={color} opacity="0.25" stroke={color} strokeWidth="1.5" />
        <path d="M24 28C24 28 18 26 16 22C14 18 16 14 16 14C16 14 20 14 22 18C24 22 24 28 24 28Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.2" />
        <path d="M24 28C24 28 30 26 32 22C34 18 32 14 32 14C32 14 28 14 26 18C24 22 24 28 24 28Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.2" />
    </svg>
);

const BookIcon = ({ size = 48, color = "#E65100" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill={color} opacity="0.08" />
        <path d="M12 14C12 14 18 12 24 14C30 12 36 14 36 14V34C36 34 30 32 24 34C18 32 12 34 12 34V14Z" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="24" y1="14" x2="24" y2="34" stroke={color} strokeWidth="1.5" />
        <line x1="16" y1="19" x2="21" y2="18" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="16" y1="23" x2="21" y2="22" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="27" y1="18" x2="32" y2="19" stroke={color} strokeWidth="1" opacity="0.4" />
        <line x1="27" y1="22" x2="32" y2="23" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
);

const MountainIcon = ({ size = 48, color = "#1565C0" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="22" fill={color} opacity="0.08" />
        <path d="M8 36L20 16L28 28L32 22L40 36H8Z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="34" cy="14" r="4" fill={color} opacity="0.2" stroke={color} strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5].map(i => {
            const a = i * Math.PI / 3;
            return <line key={i} x1={34 + Math.cos(a) * 5.5} y1={14 + Math.sin(a) * 5.5} x2={34 + Math.cos(a) * 7.5} y2={14 + Math.sin(a) * 7.5} stroke={color} strokeWidth="0.8" opacity="0.3" />;
        })}
    </svg>
);

const CalendarIco = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="28" rx="4" stroke={C.primary} strokeWidth="1.8" fill="rgba(30,58,95,0.04)" />
        <line x1="4" y1="16" x2="36" y2="16" stroke={C.primary} strokeWidth="1.5" />
        <line x1="12" y1="4" x2="12" y2="12" stroke={C.primary} strokeWidth="2" strokeLinecap="round" />
        <line x1="28" y1="4" x2="28" y2="12" stroke={C.primary} strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="24" r="2.5" fill={C.accent} />
        <circle cx="20" cy="24" r="2.5" fill={C.accent} opacity="0.5" />
        <circle cx="26" cy="24" r="2.5" fill={C.accent} opacity="0.25" />
    </svg>
);

const EmailIco = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="10" width="32" height="22" rx="3" stroke={C.primary} strokeWidth="1.8" fill="rgba(30,58,95,0.04)" />
        <polyline points="4,12 20,24 36,12" stroke={C.primary} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
        <circle cx="30" cy="12" r="5" fill={C.accent} stroke="white" strokeWidth="2" />
    </svg>
);

const GrowIco = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 36V20" stroke={C.primary} strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20C20 20 14 14 14 8C14 4 20 2 20 2C20 2 26 4 26 8C26 14 20 20 20 20Z" fill={C.accent} opacity="0.2" stroke={C.primary} strokeWidth="1.5" />
        <path d="M12 28L20 28" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
        <path d="M28 28L20 28" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
        <circle cx="8" cy="28" r="3" fill={C.accent} opacity="0.15" stroke={C.accent} strokeWidth="1" />
        <circle cx="32" cy="28" r="3" fill={C.accent} opacity="0.15" stroke={C.accent} strokeWidth="1" />
    </svg>
);

const PLAN_ICONS = {
    sprout: SproutIcon,
    book: BookIcon,
    mountain: MountainIcon,
};

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--serif:'Fraunces',Georgia,serif;--sans:'Manrope',system-ui,sans-serif;--primary:${C.primary};--accent:${C.accent};--cream:${C.cream};}
body{font-family:var(--sans);color:${C.text};background:${C.white};}

/* HEADER */
.pl-header{
  position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.93);
  backdrop-filter:blur(14px);border-bottom:1px solid ${C.border};
  padding:12px 24px;display:flex;align-items:center;justify-content:space-between;
}
.pl-logo{font-family:var(--serif);font-size:19px;color:${C.primary};text-decoration:none;display:flex;align-items:center;gap:8px;}
.pl-logo .mark{display:inline-flex;width:28px;height:28px;border-radius:5px;align-items:center;justify-content:center;border:1.5px solid ${C.accent};color:${C.accent};font-size:13px;}
.pl-back{font-size:14px;color:${C.muted};text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:600;transition:color 0.2s;}
.pl-back:hover{color:${C.primary};}

/* HERO */
.pl-hero{
  text-align:center;padding:60px 24px 48px;position:relative;overflow:hidden;
  background:${C.white};
}
.pl-hero::before{
  content:'';position:absolute;inset:0;opacity:0.025;
  background-image:repeating-linear-gradient(0deg,transparent,transparent 39px,${C.primary} 39px,${C.primary} 40px),
    repeating-linear-gradient(90deg,transparent,transparent 39px,${C.primary} 39px,${C.primary} 40px);
}
.pl-hero::after{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 100%,rgba(255,255,255,1) 0%,rgba(255,255,255,0) 60%);
}
.pl-hero h1{
  font-family:var(--serif);font-size:clamp(30px,5.5vw,48px);
  color:${C.primary};line-height:1.2;margin-bottom:12px;
  font-weight:600;position:relative;z-index:1;
}
.pl-hero .sub{
  font-size:clamp(15px,2vw,18px);color:${C.muted};
  max-width:480px;margin:0 auto 28px;line-height:1.7;font-weight:400;
  position:relative;z-index:1;
}
.btn-gold{
  display:inline-flex;align-items:center;gap:8px;
  padding:16px 36px;border-radius:12px;background:${C.accent};
  color:${C.primaryDark};font-size:16px;font-weight:800;
  border:none;cursor:pointer;font-family:var(--sans);
  transition:all 0.3s;position:relative;z-index:1;
  box-shadow:0 4px 20px rgba(212,168,67,0.25);
}
.btn-gold:hover{background:${C.accentLight};transform:translateY(-2px);box-shadow:0 8px 32px rgba(212,168,67,0.35);}

/* PLANS SECTION */
.plans-section{
  max-width:1060px;margin:0 auto;padding:0 24px 60px;
}
.sec-title{
  font-family:var(--serif);font-size:clamp(24px,4vw,34px);
  color:${C.primary};text-align:center;margin-bottom:8px;font-weight:600;
}
.sec-sub{
  text-align:center;font-size:15px;color:${C.muted};
  margin-bottom:40px;line-height:1.6;
}
.plans-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;}

/* PLAN CARD */
.plan-card{
  border-radius:20px;overflow:hidden;border:1px solid ${C.border};
  cursor:pointer;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
  background:white;position:relative;
}
.plan-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(30,58,95,0.1);}
.pc-visual{
  height:160px;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.pc-visual::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:40px;
  background:linear-gradient(transparent,white);
}
.pc-body{padding:0 28px 28px;}
.pc-tag{
  display:inline-block;padding:4px 12px;border-radius:12px;
  font-size:11px;font-weight:800;letter-spacing:0.5px;margin-bottom:12px;
}
.pc-title{
  font-family:var(--serif);font-size:22px;color:${C.primary};
  line-height:1.3;margin-bottom:8px;font-weight:600;
}
.pc-desc{font-size:14px;color:${C.muted};line-height:1.6;margin-bottom:16px;}
.pc-meta{
  display:flex;align-items:center;gap:16px;font-size:13px;
  color:${C.light};margin-bottom:18px;
}
.pc-meta span{display:flex;align-items:center;gap:4px;}
.pc-btn{
  display:flex;align-items:center;justify-content:center;gap:6px;
  width:100%;padding:13px;border-radius:10px;
  background:rgba(30,58,95,0.04);border:1.5px solid ${C.border};
  font-size:14px;font-weight:700;color:${C.primary};
  cursor:pointer;font-family:var(--sans);transition:all 0.25s;
}
.pc-btn:hover{background:${C.accent};color:${C.primaryDark};border-color:${C.accent};}
.plan-card:hover .pc-btn{background:${C.accent};color:${C.primaryDark};border-color:${C.accent};}

/* HOW IT WORKS */
.hiw-section{
  padding:64px 24px;background:${C.cream};position:relative;
}
.hiw-grid{
  display:flex;align-items:flex-start;justify-content:center;
  gap:0;max-width:800px;margin:0 auto;flex-wrap:wrap;
}
.hiw-step{
  flex:1;min-width:200px;text-align:center;padding:20px 24px;
  position:relative;
}
.hiw-icon{margin:0 auto 16px;position:relative;}
.hiw-num{
  position:absolute;top:-4px;right:-4px;width:22px;height:22px;
  border-radius:50%;background:${C.accent};color:${C.primaryDark};
  font-size:11px;font-weight:800;display:flex;align-items:center;
  justify-content:center;
}
.hiw-label{font-weight:800;font-size:15px;color:${C.primary};margin-bottom:6px;}
.hiw-desc{font-size:13px;color:${C.muted};line-height:1.6;}
.hiw-connector{
  display:flex;align-items:center;padding-top:28px;
  color:${C.border};
}
.hiw-dots{
  display:flex;gap:4px;
}
.hiw-dot{width:4px;height:4px;border-radius:50%;background:${C.border};}

/* DAILY PREVIEW */
.preview-section{
  max-width:700px;margin:0 auto;padding:60px 24px;
}
.preview-card{
  background:white;border-radius:20px;border:1px solid ${C.border};
  overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.04);
}
.prev-header{
  padding:24px 28px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid ${C.border};
}
.prev-day-badge{
  display:flex;align-items:center;gap:8px;
  font-size:13px;font-weight:800;color:${C.accent};
}
.prev-day-num{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,${C.accent},${C.accentLight});
  color:${C.primaryDark};display:flex;align-items:center;
  justify-content:center;font-size:16px;font-weight:800;
}
.prev-progress{text-align:right;}
.prev-progress-text{font-size:11px;color:${C.light};margin-bottom:4px;font-weight:600;}
.prev-bar{width:120px;height:6px;border-radius:3px;background:${C.border};overflow:hidden;}
.prev-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,${C.accent},${C.accentLight});transition:width 1s cubic-bezier(0.16,1,0.3,1);}
.prev-body{padding:28px;}
.prev-title{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:6px;font-weight:600;}
.prev-passage{
  display:inline-flex;align-items:center;gap:6px;
  padding:6px 14px;border-radius:8px;background:rgba(30,58,95,0.04);
  font-size:13px;font-weight:700;color:${C.primary};margin-bottom:20px;
}
.prev-reflection{font-size:16px;color:#3a3a3a;line-height:1.8;margin-bottom:24px;}
.prev-prayer{
  font-family:var(--serif);font-style:italic;font-size:16px;
  color:${C.primary};line-height:1.7;padding:20px 24px;
  background:rgba(212,168,67,0.05);border-left:3px solid ${C.accent};
  border-radius:0 12px 12px 0;margin-bottom:20px;
}
.prev-prayer-label{font-family:var(--sans);font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${C.accent};margin-bottom:8px;font-style:normal;}
.prev-step{
  padding:16px 20px;border-radius:12px;background:${C.cream};
  border:1px solid ${C.border};
}
.prev-step-label{font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:${C.green};margin-bottom:6px;}
.prev-step-text{font-size:14px;color:${C.text};line-height:1.6;font-weight:500;}

/* MODAL */
.modal-overlay{
  position:fixed;inset:0;z-index:200;
  background:rgba(15,32,53,0.4);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;padding:24px;
  animation:fadeIn 0.25s ease;
}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.modal-card{
  background:white;border-radius:24px;width:100%;max-width:440px;
  padding:36px;box-shadow:0 24px 80px rgba(0,0,0,0.15);
  animation:modalIn 0.35s cubic-bezier(0.16,1,0.3,1);
  position:relative;
}
@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
.modal-close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:${C.light};padding:4px;transition:color 0.2s;}
.modal-close:hover{color:${C.primary};}
.modal-icon{display:flex;justify-content:center;margin-bottom:16px;}
.modal-title{font-family:var(--serif);font-size:22px;color:${C.primary};text-align:center;margin-bottom:6px;font-weight:600;}
.modal-plan-name{text-align:center;font-size:14px;color:${C.accent};font-weight:700;margin-bottom:24px;}
.modal-fg{margin-bottom:16px;}
.modal-fg label{display:block;font-size:12px;font-weight:700;color:${C.muted};margin-bottom:6px;letter-spacing:0.3px;}
.modal-fg input{
  width:100%;padding:13px 16px;border:1.5px solid ${C.border};
  border-radius:10px;font-size:15px;font-family:var(--sans);
  background:${C.cream};color:${C.text};outline:none;transition:all 0.3s;
}
.modal-fg input:focus{border-color:${C.accent};background:white;box-shadow:0 0 0 3px rgba(212,168,67,0.08);}
.modal-fg input::placeholder{color:#B8B2AA;}
.modal-info{
  display:flex;align-items:center;gap:8px;padding:12px 16px;
  border-radius:10px;background:rgba(212,168,67,0.06);
  font-size:13px;color:${C.text};margin-bottom:20px;line-height:1.5;
}
.modal-info .info-icon{font-size:18px;flex-shrink:0;}
.modal-submit{
  width:100%;padding:15px;border-radius:12px;border:none;
  background:${C.accent};color:${C.primaryDark};font-size:16px;
  font-weight:800;font-family:var(--sans);cursor:pointer;
  transition:all 0.3s;box-shadow:0 4px 16px rgba(212,168,67,0.25);
}
.modal-submit:hover{background:${C.accentLight};transform:translateY(-1px);}
.modal-cancel{text-align:center;margin-top:12px;font-size:12px;color:${C.light};}

/* SUCCESS MODAL */
.modal-success{text-align:center;}
.modal-success .check-circle{
  width:64px;height:64px;border-radius:50%;
  background:linear-gradient(135deg,${C.accent},${C.accentLight});
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 20px;animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both;
}
@keyframes popIn{from{transform:scale(0);}to{transform:scale(1);}}
.modal-success h2{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:8px;}
.modal-success p{font-size:15px;color:${C.muted};line-height:1.7;}
.modal-success .close-btn{
  margin-top:24px;padding:12px 28px;border-radius:10px;
  background:rgba(30,58,95,0.04);border:1.5px solid ${C.border};
  font-size:14px;font-weight:700;color:${C.primary};cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
}
.modal-success .close-btn:hover{border-color:${C.accent};color:${C.accent};}

/* BOTTOM LINKS */
.bottom-links{
  max-width:1060px;margin:0 auto;padding:60px 24px;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;
}
.bl-card{
  padding:28px;border-radius:16px;border:1px solid ${C.border};
  background:white;transition:all 0.3s;cursor:pointer;
}
.bl-card:hover{border-color:${C.accent};transform:translateY(-3px);box-shadow:0 8px 28px rgba(0,0,0,0.05);}
.bl-card h3{font-family:var(--serif);font-size:17px;color:${C.primary};margin-bottom:6px;font-weight:500;}
.bl-card p{font-size:13px;color:${C.muted};line-height:1.6;margin-bottom:12px;}
.bl-card-link{display:inline-flex;align-items:center;gap:5px;font-size:13px;font-weight:700;color:${C.accent};transition:gap 0.3s;}
.bl-card:hover .bl-card-link{gap:9px;}

/* FOOTER */
.pl-footer{padding:20px 24px;background:${C.primaryDark};text-align:center;font-size:13px;color:rgba(255,255,255,0.35);}
.pl-footer a{color:${C.accent};text-decoration:none;}

/* RESPONSIVE */
@media(max-width:768px){
  .plans-grid{grid-template-columns:1fr;}
  .hiw-grid{flex-direction:column;align-items:center;}
  .hiw-connector{transform:rotate(90deg);padding:0;margin:8px 0;}
  .bottom-links{grid-template-columns:1fr;}
  .prev-header{flex-direction:column;gap:12px;align-items:flex-start;}
  .prev-bar{width:100%;}
}
`;

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function PlanDeLectura() {
    const [modalPlan, setModalPlan] = useState(null);
    const [formData, setFormData] = useState({ nombre: "", email: "" });
    const [submitted, setSubmitted] = useState(false);
    const [previewPlan, setPreviewPlan] = useState(PLANS[0]);
    const [previewDay, setPreviewDay] = useState(0);
    const [barWidth, setBarWidth] = useState(0);
    const plansRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => {
            const reading = previewPlan.readings[previewDay];
            if (reading) setBarWidth((reading.day / previewPlan.days) * 100);
        }, 500);
        return () => clearTimeout(t);
    }, [previewDay, previewPlan]);

    const handleOpenModal = (plan) => {
        setModalPlan(plan);
        setFormData({ nombre: "", email: "" });
        setSubmitted(false);
    };

    const handleSubmitPlan = () => {
        if (!formData.email.trim()) return;
        setSubmitted(true);
    };

    const scrollToPlans = () => {
        plansRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const currentReading = previewPlan.readings[previewDay];
    const PlanIcon = PLAN_ICONS[previewPlan.icon];

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <header className="pl-header">
                    <a className="pl-logo" href="/"><span className="mark">✦</span> MMM Chile</a>
                    <a className="pl-back" href="/"><BackIco /> Inicio</a>
                </header>

                {/* HERO */}
                <section className="pl-hero">
                    <h1>Lee la Biblia<br />con Propósito</h1>
                    <p className="sub">Planes de lectura guiados, gratuitos, directamente en tu correo cada mañana</p>
                    <button className="btn-gold" onClick={scrollToPlans}>Comienza Tu Plan Hoy <ArrowIco /></button>
                </section>

                {/* PLANS CATALOG */}
                <section className="plans-section" ref={plansRef}>
                    <h2 className="sec-title">Elige Tu Plan</h2>
                    <p className="sec-sub">Tres caminos diferentes, un mismo destino: crecer en tu relación con Dios</p>

                    <div className="plans-grid">
                        {PLANS.map((plan) => {
                            const Icon = PLAN_ICONS[plan.icon];
                            return (
                                <div key={plan.id} className="plan-card" onClick={() => handleOpenModal(plan)}>
                                    <div className="pc-visual" style={{ background: plan.gradient }}>
                                        <Icon size={64} color={plan.accentColor} />
                                    </div>
                                    <div className="pc-body">
                                        <span className="pc-tag" style={{ color: plan.tagColor, background: plan.tagBg }}>{plan.tag}</span>
                                        <h3 className="pc-title">{plan.title}</h3>
                                        <p className="pc-desc">{plan.description}</p>
                                        <div className="pc-meta">
                                            <span>📅 {plan.days} días</span>
                                            <span>⏱ {plan.minutes} min/día</span>
                                        </div>
                                        <button className="pc-btn">Comenzar Plan <ArrowIco s={13} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="hiw-section">
                    <h2 className="sec-title">¿Cómo Funciona?</h2>
                    <p className="sec-sub">Tres simples pasos para comenzar tu hábito de lectura bíblica</p>

                    <div className="hiw-grid">
                        <div className="hiw-step">
                            <div className="hiw-icon">
                                <CalendarIco />
                                <span className="hiw-num">1</span>
                            </div>
                            <div className="hiw-label">Elige tu plan</div>
                            <div className="hiw-desc">Escoge el plan que más se ajuste a tu momento de vida</div>
                        </div>

                        <div className="hiw-connector">
                            <div className="hiw-dots">{[...Array(5)].map((_, i) => <div key={i} className="hiw-dot" />)}</div>
                        </div>

                        <div className="hiw-step">
                            <div className="hiw-icon">
                                <EmailIco />
                                <span className="hiw-num">2</span>
                            </div>
                            <div className="hiw-label">Recibe la lectura diaria</div>
                            <div className="hiw-desc">Cada mañana a las 7:00 AM recibirás la lectura en tu correo</div>
                        </div>

                        <div className="hiw-connector">
                            <div className="hiw-dots">{[...Array(5)].map((_, i) => <div key={i} className="hiw-dot" />)}</div>
                        </div>

                        <div className="hiw-step">
                            <div className="hiw-icon">
                                <GrowIco />
                                <span className="hiw-num">3</span>
                            </div>
                            <div className="hiw-label">Crece en tu fe</div>
                            <div className="hiw-desc">Día a día, tu relación con Dios se fortalecerá</div>
                        </div>
                    </div>
                </section>

                {/* DAILY READING PREVIEW */}
                <section className="preview-section">
                    <h2 className="sec-title">Un Día de Ejemplo</h2>
                    <p className="sec-sub">Así se ve una lectura diaria dentro del plan</p>

                    {/* Plan selector pills */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
                        {PLANS.map(plan => (
                            <button key={plan.id} onClick={() => { setPreviewPlan(plan); setPreviewDay(0); }} style={{
                                padding: "7px 16px", borderRadius: 16, fontSize: 12, fontWeight: 700,
                                border: `1.5px solid ${previewPlan.id === plan.id ? C.accent : C.border}`,
                                background: previewPlan.id === plan.id ? C.accent : "white",
                                color: previewPlan.id === plan.id ? C.primaryDark : C.muted,
                                cursor: "pointer", fontFamily: "var(--sans)", transition: "all 0.2s",
                            }}>{plan.title.split(" ").slice(0, 3).join(" ")}…</button>
                        ))}
                    </div>

                    {/* Day selector */}
                    {previewPlan.readings.length > 1 && (
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                            {previewPlan.readings.map((r, i) => (
                                <button key={i} onClick={() => setPreviewDay(i)} style={{
                                    width: 36, height: 36, borderRadius: 10, fontSize: 14, fontWeight: 700,
                                    border: `1.5px solid ${previewDay === i ? C.accent : C.border}`,
                                    background: previewDay === i ? `linear-gradient(135deg,${C.accent},${C.accentLight})` : "white",
                                    color: previewDay === i ? C.primaryDark : C.muted,
                                    cursor: "pointer", fontFamily: "var(--sans)", transition: "all 0.2s",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>{r.day}</button>
                            ))}
                        </div>
                    )}

                    {currentReading && (
                        <div className="preview-card">
                            <div className="prev-header">
                                <div className="prev-day-badge">
                                    <div className="prev-day-num">{currentReading.day}</div>
                                    <div>
                                        <div style={{ fontSize: 11, color: C.light, fontWeight: 700, letterSpacing: 0.5 }}>DÍA {currentReading.day}</div>
                                        <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: C.primary, fontWeight: 600 }}>{currentReading.title}</div>
                                    </div>
                                </div>
                                <div className="prev-progress">
                                    <div className="prev-progress-text">Día {currentReading.day} de {previewPlan.days}</div>
                                    <div className="prev-bar">
                                        <div className="prev-bar-fill" style={{ width: `${barWidth}%` }} />
                                    </div>
                                </div>
                            </div>
                            <div className="prev-body">
                                <div className="prev-passage">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
                                    {currentReading.passage}
                                </div>

                                <p className="prev-reflection">{currentReading.reflection}</p>

                                <div className="prev-prayer">
                                    <div className="prev-prayer-label">Oración del día</div>
                                    {currentReading.prayer}
                                </div>

                                <div className="prev-step">
                                    <div className="prev-step-label">Paso práctico</div>
                                    <div className="prev-step-text">{currentReading.step}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ textAlign: "center", marginTop: 28 }}>
                        <button className="btn-gold" onClick={scrollToPlans}>Comenzar este plan <ArrowIco /></button>
                    </div>
                </section>

                {/* BOTTOM LINKS */}
                <div className="bottom-links">
                    <div className="bl-card" onClick={() => { }}>
                        <h3>¿Ya terminaste un plan?</h3>
                        <p>Explora más recursos para seguir creciendo en tu fe y conocimiento bíblico.</p>
                        <span className="bl-card-link">Explorar recursos <ArrowIco s={12} /></span>
                    </div>
                    <div className="bl-card" onClick={() => { }}>
                        <h3>¿Tienes preguntas sobre la Biblia?</h3>
                        <p>Nuestro blog responde preguntas reales con honestidad y esperanza.</p>
                        <span className="bl-card-link">Visitar el blog <ArrowIco s={12} /></span>
                    </div>
                    <div className="bl-card" onClick={() => { }}>
                        <h3>¿Quieres estudiar con otros?</h3>
                        <p>Encuentra un grupo de estudio bíblico en una iglesia cercana.</p>
                        <span className="bl-card-link">Encontrar iglesia <ArrowIco s={12} /></span>
                    </div>
                </div>

                {/* FOOTER */}
                <footer className="pl-footer">
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/">mmmchile.cl</a>
                </footer>

                {/* ═══ MODAL ═══ */}
                {modalPlan && (
                    <div className="modal-overlay" onClick={() => setModalPlan(null)}>
                        <div className="modal-card" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={() => setModalPlan(null)}><CloseIco /></button>

                            {!submitted ? (
                                <>
                                    <div className="modal-icon">
                                        {(() => { const I = PLAN_ICONS[modalPlan.icon]; return <I size={56} color={modalPlan.accentColor} />; })()}
                                    </div>
                                    <h2 className="modal-title">Comienza Tu Plan</h2>
                                    <div className="modal-plan-name">{modalPlan.title}</div>

                                    <div className="modal-fg">
                                        <label>Tu nombre</label>
                                        <input type="text" placeholder="¿Cómo te llamas?" value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))} />
                                    </div>
                                    <div className="modal-fg">
                                        <label>Tu correo electrónico</label>
                                        <input type="email" placeholder="tu@correo.com" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                                    </div>

                                    <div className="modal-info">
                                        <span className="info-icon">📧</span>
                                        <span>Recibirás la lectura de cada día a las <strong>7:00 AM</strong> en tu correo.</span>
                                    </div>

                                    <button className="modal-submit" onClick={handleSubmitPlan}>Comenzar Mañana</button>
                                    <div className="modal-cancel">Puedes cancelar en cualquier momento</div>
                                </>
                            ) : (
                                <div className="modal-success">
                                    <div className="check-circle">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <h2>¡Estás listo{formData.nombre ? `, ${formData.nombre}` : ""}!</h2>
                                    <p>Mañana a las 7:00 AM recibirás tu primera lectura de <strong>{modalPlan.title}</strong> en {formData.email}.</p>
                                    <p style={{ marginTop: 12, fontSize: 14 }}>Prepárate para una aventura que transformará tu vida. 🌱</p>
                                    <button className="close-btn" onClick={() => setModalPlan(null)}>Cerrar</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}