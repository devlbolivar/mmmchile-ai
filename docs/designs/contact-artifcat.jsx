import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════
const C = {
    primary: "#1E3A5F", primaryDark: "#0F2035",
    accent: "#D4A843", accentLight: "#E8C976", accentPale: "#F5E6C4",
    cream: "#F8F6F0", white: "#FFFFFF",
    text: "#2C2C2C", muted: "#6B7280", light: "#9CA3AF",
    border: "#E8E2D8", green: "#25D366", greenDark: "#1a9e4a",
    blue: "#3B82F6", red: "#EF4444",
};

// ═══════════════════════════════════════
// SCROLL REVEAL HOOK
// ═══════════════════════════════════════
function useInView(threshold = 0.12) {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, vis];
}

const Reveal = ({ children, delay = 0, style = {} }) => {
    const [ref, vis] = useInView(0.08);
    return (
        <div ref={ref} style={{
            ...style,
            opacity: vis ? 1 : 0,
            transform: vis ? "translateY(0)" : "translateY(32px)",
            transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}>{children}</div>
    );
};

// ═══════════════════════════════════════
// ICONS
// ═══════════════════════════════════════
const BackIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ArrowIco = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const ChevIco = ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9" /></svg>;

const WhatsAppIco = ({ s = 24 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
);
const EmailIco = ({ s = 24 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,6 12,14 2,6" />
    </svg>
);
const PhoneIco = ({ s = 24 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);
const MapPinIco = ({ s = 24 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);
const ClockIco = ({ s = 20 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const SendIco = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const CopyIco = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

// ═══════════════════════════════════════
// FAQ DATA
// ═══════════════════════════════════════
const FAQS = [
    { q: "¿Cómo puedo visitar una iglesia por primera vez?", a: "Solo llega el domingo a las 11:00 AM. No necesitas inscribirte ni vestirte de una forma especial. Serás recibido con cariño. Puedes buscar la iglesia más cercana en nuestra página de iglesias.", link: "/iglesias" },
    { q: "¿Ofrecen consejería pastoral?", a: "Sí, nuestros pastores están disponibles para consejería individual y matrimonial. Puedes escribirnos por WhatsApp o completar el formulario indicando que necesitas consejería, y te conectaremos con un pastor en tu zona." },
    { q: "¿Cómo puedo compartir mi testimonio?", a: "Nos encanta escuchar historias de transformación. Puedes enviarnos tu testimonio por el formulario de contacto seleccionando el motivo 'Compartir testimonio', o escríbenos por WhatsApp." },
    { q: "¿Tienen actividades para jóvenes o niños?", a: "Sí, la mayoría de nuestras iglesias tienen ministerios de jóvenes y escuela dominical para niños. Los horarios varían por iglesia — contacta la iglesia más cercana para detalles." },
];

const SUBJECTS = [
    "Quiero visitar una iglesia",
    "Necesito consejería pastoral",
    "Necesito oración",
    "Compartir un testimonio",
    "Información sobre la iglesia",
    "Alianzas o colaboraciones",
    "Otro tema",
];

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Figtree:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--serif:'Bitter',Georgia,serif;--sans:'Figtree',system-ui,sans-serif;--primary:${C.primary};--accent:${C.accent};--cream:${C.cream};}
body{font-family:var(--sans);color:${C.text};background:${C.cream};}

/* HEADER */
.ct-header{
  position:sticky;top:0;z-index:50;background:rgba(248,246,240,0.93);
  backdrop-filter:blur(14px);border-bottom:1px solid ${C.border};
  padding:12px 24px;display:flex;align-items:center;justify-content:space-between;
}
.ct-logo{font-family:var(--serif);font-size:19px;color:${C.primary};text-decoration:none;display:flex;align-items:center;gap:8px;}
.ct-logo .mark{display:inline-flex;width:28px;height:28px;border-radius:5px;align-items:center;justify-content:center;border:1.5px solid ${C.accent};color:${C.accent};font-size:13px;}
.ct-back{font-size:14px;color:${C.muted};text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:600;transition:color 0.2s;}
.ct-back:hover{color:${C.primary};}

/* HERO */
.ct-hero{
  text-align:center;padding:52px 24px 0;position:relative;overflow:hidden;
}
.ct-hero h1{
  font-family:var(--serif);font-size:clamp(28px,5vw,44px);
  color:${C.primary};line-height:1.2;margin-bottom:10px;font-weight:600;
}
.ct-hero .sub{
  font-size:clamp(15px,2vw,17px);color:${C.muted};
  max-width:500px;margin:0 auto 36px;line-height:1.7;font-weight:400;
}

/* QUICK CONTACT CARDS */
.quick-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:16px;max-width:960px;margin:0 auto 48px;padding:0 24px;
}
.qc-card{
  background:white;border-radius:16px;padding:24px;border:1px solid ${C.border};
  display:flex;align-items:flex-start;gap:16px;cursor:pointer;
  transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden;
}
.qc-card::before{
  content:'';position:absolute;bottom:0;left:0;right:0;height:3px;
  transform:scaleX(0);transition:transform 0.35s;transform-origin:left;
}
.qc-card:hover::before{transform:scaleX(1);}
.qc-card:hover{transform:translateY(-4px);box-shadow:0 10px 32px rgba(30,58,95,0.08);}
.qc-icon{
  width:48px;height:48px;border-radius:14px;display:flex;
  align-items:center;justify-content:center;flex-shrink:0;
  transition:transform 0.3s;
}
.qc-card:hover .qc-icon{transform:scale(1.08);}
.qc-label{font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:4px;}
.qc-value{font-size:15px;font-weight:600;color:${C.primary};line-height:1.4;}
.qc-hint{font-size:12px;color:${C.light};margin-top:2px;}
.qc-wa{background:rgba(37,211,102,0.06);}
.qc-wa::before{background:${C.green};}
.qc-wa .qc-icon{background:rgba(37,211,102,0.1);color:${C.greenDark};}
.qc-wa .qc-label{color:${C.greenDark};}
.qc-em{background:rgba(59,130,246,0.04);}
.qc-em::before{background:${C.blue};}
.qc-em .qc-icon{background:rgba(59,130,246,0.08);color:${C.blue};}
.qc-em .qc-label{color:${C.blue};}
.qc-ph{background:rgba(212,168,67,0.05);}
.qc-ph::before{background:${C.accent};}
.qc-ph .qc-icon{background:rgba(212,168,67,0.1);color:${C.accent};}
.qc-ph .qc-label{color:#A08030;}
.qc-mp{background:rgba(30,58,95,0.03);}
.qc-mp::before{background:${C.primary};}
.qc-mp .qc-icon{background:rgba(30,58,95,0.06);color:${C.primary};}
.qc-mp .qc-label{color:${C.primary};}

/* MAIN LAYOUT */
.ct-main{
  max-width:1060px;margin:0 auto;padding:0 24px 60px;
  display:grid;grid-template-columns:1.1fr 0.9fr;gap:40px;align-items:start;
}

/* FORM */
.form-card{
  background:white;border-radius:20px;padding:36px;
  border:1px solid ${C.border};
  box-shadow:0 6px 32px rgba(30,58,95,0.04);
}
.form-card h2{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:6px;font-weight:600;}
.form-card .form-sub{font-size:14px;color:${C.muted};margin-bottom:28px;line-height:1.6;}
.fg{margin-bottom:18px;}
.fg label{display:block;font-size:12px;font-weight:700;color:${C.muted};margin-bottom:6px;letter-spacing:0.3px;}
.fg .req{color:${C.red};font-weight:800;}
.fg input,.fg textarea,.fg select{
  width:100%;padding:13px 16px;border:1.5px solid ${C.border};
  border-radius:11px;font-size:15px;font-family:var(--sans);
  background:${C.cream};color:${C.text};outline:none;transition:all 0.3s;resize:vertical;
}
.fg input:focus,.fg textarea:focus,.fg select:focus{
  border-color:${C.accent};background:white;
  box-shadow:0 0 0 3px rgba(212,168,67,0.08);
}
.fg input::placeholder,.fg textarea::placeholder{color:#BEB6AE;}
.fg textarea{min-height:130px;line-height:1.7;}
.fg select{
  appearance:none;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 14px center;
}
.fg-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.btn-submit{
  width:100%;display:flex;align-items:center;justify-content:center;gap:8px;
  padding:15px;border-radius:12px;border:none;
  background:${C.accent};color:${C.primaryDark};
  font-size:16px;font-weight:800;font-family:var(--sans);
  cursor:pointer;transition:all 0.3s;margin-top:4px;
  box-shadow:0 4px 20px rgba(212,168,67,0.25);
}
.btn-submit:hover{background:${C.accentLight};transform:translateY(-2px);box-shadow:0 8px 32px rgba(212,168,67,0.35);}
.btn-submit:active{transform:translateY(0);}
.form-trust{margin-top:14px;font-size:12px;color:${C.light};text-align:center;line-height:1.5;}

/* SUCCESS */
.success-msg{
  text-align:center;padding:40px 20px;
  animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1);
}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
.success-circle{
  width:68px;height:68px;border-radius:50%;
  background:linear-gradient(135deg,${C.accent},${C.accentLight});
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 20px;animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s both;
}
@keyframes popIn{from{transform:scale(0);}to{transform:scale(1);}}
.success-msg h2{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:8px;}
.success-msg p{font-size:15px;color:${C.muted};line-height:1.7;max-width:360px;margin:0 auto;}
.btn-reset{
  margin-top:24px;padding:12px 28px;border-radius:10px;
  background:transparent;border:1.5px solid ${C.border};
  font-size:14px;font-weight:700;color:${C.primary};
  cursor:pointer;font-family:var(--sans);transition:all 0.2s;
}
.btn-reset:hover{border-color:${C.accent};color:${C.accent};}

/* RIGHT COLUMN */
.ct-right{display:flex;flex-direction:column;gap:24px;position:sticky;top:80px;}

/* INFO CARD */
.info-card{
  background:white;border-radius:18px;padding:28px;
  border:1px solid ${C.border};
}
.info-card h3{font-family:var(--serif);font-size:18px;color:${C.primary};margin-bottom:16px;font-weight:600;}
.info-row{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid ${C.border};}
.info-row:last-child{border-bottom:none;}
.info-icon{width:40px;height:40px;border-radius:10px;background:rgba(30,58,95,0.04);display:flex;align-items:center;justify-content:center;color:${C.primary};flex-shrink:0;}
.info-label{font-size:12px;font-weight:700;color:${C.muted};letter-spacing:0.3px;margin-bottom:2px;}
.info-value{font-size:14px;font-weight:600;color:${C.primary};line-height:1.4;}
.info-hint{font-size:12px;color:${C.light};margin-top:2px;}
.copy-btn{
  display:inline-flex;align-items:center;gap:4px;margin-top:4px;
  font-size:11px;font-weight:700;color:${C.accent};cursor:pointer;
  background:none;border:none;font-family:var(--sans);transition:color 0.2s;
}
.copy-btn:hover{color:${C.primary};}
.copy-btn.copied{color:${C.green};}

/* HOURS CARD */
.hours-card{
  background:${C.primary};border-radius:18px;padding:28px;color:white;
  position:relative;overflow:hidden;
}
.hours-card::before{
  content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;
  background:radial-gradient(circle,rgba(212,168,67,0.12) 0%,transparent 70%);
  border-radius:50%;
}
.hours-card h3{font-family:var(--serif);font-size:18px;margin-bottom:16px;font-weight:500;position:relative;}
.hours-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-size:14px;}
.hours-row:last-child{border-bottom:none;}
.hours-day{color:rgba(255,255,255,0.7);font-weight:500;}
.hours-time{font-weight:700;color:${C.accent};}
.hours-note{margin-top:12px;font-size:12px;color:rgba(255,255,255,0.45);line-height:1.5;}

/* MAP PLACEHOLDER */
.map-card{
  border-radius:18px;overflow:hidden;border:1px solid ${C.border};
  height:200px;position:relative;cursor:pointer;
  transition:all 0.3s;
}
.map-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.06);transform:translateY(-2px);}
.map-inner{
  width:100%;height:100%;
  background:linear-gradient(135deg,#e8edf2,#d4dbe4);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
}
.map-label{font-size:13px;font-weight:700;color:${C.primary};}
.map-link{
  display:inline-flex;align-items:center;gap:5px;padding:8px 16px;
  border-radius:8px;background:${C.primary};color:white;
  font-size:12px;font-weight:700;border:none;cursor:pointer;
  font-family:var(--sans);transition:background 0.2s;
}
.map-link:hover{background:#2a5280;}

/* SOCIAL */
.social-row{display:flex;gap:10px;margin-top:8px;}
.social-btn{
  width:42px;height:42px;border-radius:10px;
  background:rgba(30,58,95,0.04);border:1px solid ${C.border};
  display:flex;align-items:center;justify-content:center;
  color:${C.muted};cursor:pointer;transition:all 0.2s;
}
.social-btn:hover{background:${C.accent};color:${C.primaryDark};border-color:${C.accent};}

/* FAQ */
.faq-section{max-width:1060px;margin:0 auto;padding:60px 24px 80px;}
.faq-title{font-family:var(--serif);font-size:clamp(24px,4vw,34px);color:${C.primary};text-align:center;margin-bottom:8px;font-weight:600;}
.faq-sub{text-align:center;font-size:15px;color:${C.muted};margin-bottom:36px;}
.faq-grid{max-width:720px;margin:0 auto;}
.faq-item{
  background:white;border-radius:14px;margin-bottom:10px;
  border:1px solid ${C.border};overflow:hidden;transition:box-shadow 0.3s;
}
.faq-item:hover{box-shadow:0 4px 16px rgba(0,0,0,0.03);}
.faq-q{
  width:100%;padding:18px 22px;background:none;border:none;
  display:flex;align-items:center;justify-content:space-between;
  font-family:var(--sans);font-size:15px;font-weight:700;
  color:${C.primary};cursor:pointer;text-align:left;gap:12px;
}
.faq-a{max-height:0;overflow:hidden;transition:max-height 0.4s ease;}
.faq-a.open{max-height:300px;}
.faq-a-inner{padding:0 22px 18px;font-size:14px;line-height:1.7;color:${C.muted};}
.faq-link{
  display:inline-flex;align-items:center;gap:4px;margin-top:8px;
  font-size:13px;font-weight:700;color:${C.accent};
}

/* BOTTOM CTA */
.ct-bottom{
  padding:48px 24px;text-align:center;
  background:linear-gradient(135deg,${C.accentPale},#F0DDB8);position:relative;
}
.ct-bottom::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(255,255,255,0.5) 0%,transparent 60%);}
.ct-bottom h3{font-family:var(--serif);font-size:clamp(22px,3.5vw,30px);color:${C.primary};margin-bottom:6px;position:relative;}
.ct-bottom .sub{font-size:15px;color:${C.muted};margin-bottom:24px;line-height:1.6;position:relative;}
.ct-bottom-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;}
.btn-bottom-gold{
  display:inline-flex;align-items:center;gap:8px;padding:14px 30px;
  border-radius:10px;background:${C.accent};color:${C.primaryDark};
  font-size:15px;font-weight:800;border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
  box-shadow:0 4px 16px rgba(212,168,67,0.25);
}
.btn-bottom-gold:hover{background:${C.accentLight};transform:translateY(-2px);}
.btn-bottom-outline{
  display:inline-flex;align-items:center;gap:8px;padding:14px 30px;
  border-radius:10px;background:white;color:${C.primary};
  border:1.5px solid ${C.border};font-size:15px;font-weight:700;
  cursor:pointer;font-family:var(--sans);transition:all 0.2s;
}
.btn-bottom-outline:hover{border-color:${C.accent};color:${C.accent};}

/* FOOTER */
.ct-footer{padding:20px 24px;background:${C.primaryDark};text-align:center;font-size:13px;color:rgba(255,255,255,0.35);}
.ct-footer a{color:${C.accent};text-decoration:none;}

/* RESPONSIVE */
@media(max-width:900px){
  .ct-main{grid-template-columns:1fr;gap:32px;}
  .ct-right{position:static;}
  .fg-row{grid-template-columns:1fr;}
  .quick-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:500px){
  .quick-grid{grid-template-columns:1fr;}
  .form-card{padding:24px 20px;}
}
`;

// ═══════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════
export default function ContactoPage() {
    const [form, setForm] = useState({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleInput = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleSubmit = () => {
        if (!form.nombre.trim() || !form.mensaje.trim()) return;
        setSubmitted(true);
    };

    const resetForm = () => {
        setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" });
        setSubmitted(false);
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard?.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const waUrl = "https://wa.me/56912345600?text=" + encodeURIComponent("Hola, me comunico desde la página web de MMM Chile.");

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* HEADER */}
                <header className="ct-header">
                    <a className="ct-logo" href="/"><span className="mark">✦</span> MMM Chile</a>
                    <a className="ct-back" href="/"><BackIco /> Inicio</a>
                </header>

                {/* HERO */}
                <section className="ct-hero">
                    <Reveal>
                        <h1>Estamos Aquí para Ti</h1>
                        <p className="sub">Escríbenos, llámanos o visítanos. Queremos ayudarte en lo que necesites.</p>
                    </Reveal>
                </section>

                {/* QUICK CONTACT CARDS */}
                <Reveal delay={0.1}>
                    <div className="quick-grid">
                        <div className="qc-card qc-wa" onClick={() => window.open(waUrl)}>
                            <div className="qc-icon"><WhatsAppIco /></div>
                            <div>
                                <div className="qc-label">WhatsApp</div>
                                <div className="qc-value">+56 9 1234 5600</div>
                                <div className="qc-hint">Respuesta rápida · Lun a Sáb</div>
                            </div>
                        </div>
                        <div className="qc-card qc-em" onClick={() => window.open("mailto:contacto@mmmchile.cl")}>
                            <div className="qc-icon"><EmailIco /></div>
                            <div>
                                <div className="qc-label">Email</div>
                                <div className="qc-value">contacto@mmmchile.cl</div>
                                <div className="qc-hint">Respondemos en 24 horas</div>
                            </div>
                        </div>
                        <div className="qc-card qc-ph">
                            <div className="qc-icon"><PhoneIco /></div>
                            <div>
                                <div className="qc-label">Teléfono</div>
                                <div className="qc-value">+56 2 2345 6789</div>
                                <div className="qc-hint">Lun a Vie · 9:00 - 18:00</div>
                            </div>
                        </div>
                        <div className="qc-card qc-mp">
                            <div className="qc-icon"><MapPinIco /></div>
                            <div>
                                <div className="qc-label">Oficina Central</div>
                                <div className="qc-value">Santiago Centro, Chile</div>
                                <div className="qc-hint">Av. Libertador B. O'Higgins 2345</div>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* MAIN: FORM + RIGHT COLUMN */}
                <div className="ct-main">

                    {/* FORM */}
                    <Reveal delay={0.15}>
                        <div className="form-card">
                            {!submitted ? (
                                <>
                                    <h2>Envíanos un Mensaje</h2>
                                    <p className="form-sub">Completa el formulario y te responderemos lo antes posible. Si prefieres, escríbenos directamente por WhatsApp.</p>

                                    <div className="fg-row">
                                        <div className="fg">
                                            <label>Nombre <span className="req">*</span></label>
                                            <input type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={e => handleInput("nombre", e.target.value)} />
                                        </div>
                                        <div className="fg">
                                            <label>Email</label>
                                            <input type="email" placeholder="tu@correo.com" value={form.email} onChange={e => handleInput("email", e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="fg-row">
                                        <div className="fg">
                                            <label>WhatsApp / Teléfono</label>
                                            <input type="tel" placeholder="+56 9 1234 5678" value={form.telefono} onChange={e => handleInput("telefono", e.target.value)} />
                                        </div>
                                        <div className="fg">
                                            <label>Motivo de contacto</label>
                                            <select value={form.asunto} onChange={e => handleInput("asunto", e.target.value)}>
                                                <option value="">Selecciona un motivo</option>
                                                {SUBJECTS.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="fg">
                                        <label>Tu mensaje <span className="req">*</span></label>
                                        <textarea placeholder="Cuéntanos en qué podemos ayudarte..." value={form.mensaje} onChange={e => handleInput("mensaje", e.target.value)} />
                                    </div>

                                    <button className="btn-submit" onClick={handleSubmit}>
                                        <SendIco /> Enviar Mensaje
                                    </button>
                                    <p className="form-trust">🔒 Tu información es confidencial y será tratada con respeto.</p>
                                </>
                            ) : (
                                <div className="success-msg">
                                    <div className="success-circle">
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    <h2>¡Mensaje Enviado!</h2>
                                    <p>Gracias, {form.nombre}. Hemos recibido tu mensaje y te responderemos pronto. Si necesitas respuesta inmediata, escríbenos por WhatsApp.</p>
                                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
                                        <button className="btn-reset" onClick={resetForm}>Enviar otro mensaje</button>
                                        <button
                                            className="btn-reset"
                                            style={{ background: "rgba(37,211,102,0.08)", borderColor: "rgba(37,211,102,0.2)", color: C.greenDark }}
                                            onClick={() => window.open(waUrl)}
                                        >
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Reveal>

                    {/* RIGHT COLUMN */}
                    <div className="ct-right">
                        {/* Info Details */}
                        <Reveal delay={0.2}>
                            <div className="info-card">
                                <h3>Información de Contacto</h3>

                                <div className="info-row">
                                    <div className="info-icon"><WhatsAppIco s={20} /></div>
                                    <div>
                                        <div className="info-label">WhatsApp (respuesta rápida)</div>
                                        <div className="info-value">+56 9 1234 5600</div>
                                        <button className={`copy-btn ${copiedField === "wa" ? "copied" : ""}`} onClick={() => copyToClipboard("+56912345600", "wa")}>
                                            <CopyIco /> {copiedField === "wa" ? "¡Copiado!" : "Copiar número"}
                                        </button>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-icon"><EmailIco s={20} /></div>
                                    <div>
                                        <div className="info-label">Correo electrónico</div>
                                        <div className="info-value">contacto@mmmchile.cl</div>
                                        <button className={`copy-btn ${copiedField === "em" ? "copied" : ""}`} onClick={() => copyToClipboard("contacto@mmmchile.cl", "em")}>
                                            <CopyIco /> {copiedField === "em" ? "¡Copiado!" : "Copiar email"}
                                        </button>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-icon"><MapPinIco s={20} /></div>
                                    <div>
                                        <div className="info-label">Dirección oficina central</div>
                                        <div className="info-value">Av. Libertador B. O'Higgins 2345</div>
                                        <div className="info-hint">Santiago Centro, Región Metropolitana</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 16 }}>
                                    <div className="info-label" style={{ marginBottom: 8 }}>Síguenos</div>
                                    <div className="social-row">
                                        {[
                                            { label: "FB", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
                                            { label: "IG", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg> },
                                            { label: "YT", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
                                        ].map((s, i) => (
                                            <button key={i} className="social-btn" aria-label={s.label}>{s.icon}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* Hours */}
                        <Reveal delay={0.3}>
                            <div className="hours-card">
                                <h3><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><ClockIco s={18} /> Horarios de Atención</span></h3>
                                {[
                                    { day: "Lunes a Viernes", time: "9:00 — 18:00" },
                                    { day: "Sábado", time: "9:00 — 13:00" },
                                    { day: "Domingo", time: "Solo cultos" },
                                ].map((h, i) => (
                                    <div key={i} className="hours-row">
                                        <span className="hours-day">{h.day}</span>
                                        <span className="hours-time">{h.time}</span>
                                    </div>
                                ))}
                                <p className="hours-note">Los domingos nuestras iglesias abren sus puertas para los cultos. Consulta horarios en la página de cada iglesia.</p>
                            </div>
                        </Reveal>

                        {/* Map */}
                        <Reveal delay={0.35}>
                            <div className="map-card" onClick={() => window.open("https://www.google.com/maps/dir/?api=1&destination=-33.445,-70.660")}>
                                <div className="map-inner">
                                    <MapPinIco s={32} />
                                    <span className="map-label">Santiago Centro, Chile</span>
                                    <button className="map-link" onClick={e => e.stopPropagation()}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                                        Abrir en Google Maps
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* FAQ */}
                <section className="faq-section">
                    <Reveal>
                        <h2 className="faq-title">Preguntas Frecuentes</h2>
                        <p className="faq-sub">Respuestas rápidas a las consultas más comunes</p>
                    </Reveal>

                    <div className="faq-grid">
                        {FAQS.map((faq, i) => (
                            <Reveal key={i} delay={0.05 + i * 0.05}>
                                <div className="faq-item">
                                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{faq.q}</span>
                                        <ChevIco open={openFaq === i} />
                                    </button>
                                    <div className={`faq-a ${openFaq === i ? "open" : ""}`}>
                                        <div className="faq-a-inner">
                                            {faq.a}
                                            {faq.link && <div className="faq-link" style={{ cursor: "pointer" }}>Ver más <ArrowIco s={12} /></div>}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <section className="ct-bottom">
                    <h3>¿Buscas Algo Más?</h3>
                    <p className="sub">Explora nuestros recursos o encuentra una iglesia cercana</p>
                    <div className="ct-bottom-btns">
                        <button className="btn-bottom-gold" onClick={() => { }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                            Encontrar una Iglesia
                        </button>
                        <button className="btn-bottom-outline" onClick={() => { }}>
                            Conoce a Jesús <ArrowIco />
                        </button>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="ct-footer">
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/">mmmchile.cl</a>
                </footer>
            </div>
        </>
    );
}