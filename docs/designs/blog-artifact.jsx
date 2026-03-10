import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════
// TOKENS
// ═══════════════════════════════════════
const C = {
    primary: "#1E3A5F", primaryDark: "#0F2035",
    accent: "#D4A843", accentLight: "#E8C976", accentPale: "#F5E6C4",
    cream: "#F8F6F0", white: "#FFFFFF",
    text: "#2C2C2C", muted: "#6B7280", light: "#9CA3AF",
    border: "#E8E4DC", green: "#25D366",
    catColors: {
        "Preguntas de Vida": "#7C3AED",
        "Primeros Pasos": "#0891B2",
        "Vida Cristiana": "#059669",
        "Testimonios": "#DC2626",
    },
};

const catColor = (cat) => C.catColors[cat] || C.accent;

// ═══════════════════════════════════════
// ARTICLES DATA
// ═══════════════════════════════════════
const ARTICLES = [
    {
        id: "existe-dios", slug: "existe-dios", featured: true,
        category: "Preguntas de Vida",
        title: "¿Existe Dios? Lo que la Ciencia y la Fe Tienen en Común",
        excerpt: "Una mirada honesta y accesible a la pregunta más importante que puedes hacerte. ¿Hay evidencia de un diseño inteligente en el universo? ¿Qué dicen los científicos que también creen?",
        readTime: 8, date: "28 Feb 2026",
        author: { name: "Pastor Roberto Méndez", role: "Pastor principal, MMM Santiago Centro", initials: "RM" },
        coverGradient: "linear-gradient(135deg, #1E3A5F 0%, #2a5280 50%, #1a4a6f 100%)",
        content: {
            intro: "Es quizás la pregunta más antigua de la humanidad. Una pregunta que no distingue entre ricos y pobres, entre científicos y poetas, entre jóvenes y ancianos. ¿Existe Dios? Y si existe, ¿podemos saberlo?",
            sections: [
                {
                    title: "El universo grita diseño",
                    paragraphs: [
                        "Cuando observamos la complejidad del universo — desde la estructura del ADN hasta las leyes de la física que mantienen todo en equilibrio — es difícil no preguntarse: ¿todo esto surgió por casualidad?",
                        "El cosmólogo Fred Hoyle, quien no era creyente, comparó la probabilidad de que la vida surgiera por azar con la de un tornado ensamblando un avión al pasar por un depósito de chatarra. La precisión del universo es asombrosa.",
                        "Las constantes fundamentales de la física están calibradas con una precisión de una parte en diez elevado a la potencia 60. Si la fuerza de gravedad variara en una fracción infinitesimal, las estrellas no podrían existir. Si la fuerza nuclear fuerte fuera ligeramente diferente, no habría átomos de carbono — y por tanto, no habría vida."
                    ],
                    verse: { text: "Los cielos cuentan la gloria de Dios, y el firmamento anuncia la obra de sus manos.", ref: "Salmos 19:1" }
                },
                {
                    title: "La ciencia no tiene que ser enemiga de la fe",
                    paragraphs: [
                        "Existe un mito popular: que la ciencia y la fe son incompatibles. Pero la historia cuenta una historia diferente. Muchos de los grandes científicos de la historia fueron creyentes profundos: Newton, Faraday, Pasteur, Lemaitre (quien propuso la teoría del Big Bang era sacerdote católico).",
                        "La ciencia responde al \"cómo\" — cómo funciona el universo, cómo se formaron las galaxias, cómo se replica el ADN. La fe responde al \"por qué\" — por qué existe algo en lugar de nada, por qué tenemos conciencia, por qué sentimos que la vida debería tener significado.",
                        "Lejos de contradecirse, la ciencia y la fe pueden complementarse. La ciencia nos muestra la majestuosidad del diseño. La fe nos presenta al Diseñador."
                    ]
                },
                {
                    title: "El vacío que apunta hacia algo más",
                    paragraphs: [
                        "Más allá de los argumentos intelectuales, hay una evidencia que todos experimentamos: el anhelo interior. Esa sensación de que la vida debería significar algo más. Esa búsqueda constante de propósito, amor, trascendencia.",
                        "C.S. Lewis lo expresó así: si sentimos un hambre que ningún alimento terrenal puede satisfacer, tal vez fuimos hechos para otro mundo. Ese vacío no es un defecto — es una brújula. Apunta hacia Alguien que puede llenarlo.",
                        "Dios no solo existe como concepto filosófico. Él se presenta como un Padre que quiere ser conocido. Y la forma en que se dio a conocer más claramente fue a través de Jesús — Dios hecho hombre, caminando entre nosotros."
                    ],
                    verse: { text: "Porque las cosas invisibles de él, su eterno poder y deidad, se hacen claramente visibles desde la creación del mundo, siendo entendidas por medio de las cosas hechas.", ref: "Romanos 1:20" }
                }
            ],
            keyVerse: { text: "Acercaos a Dios, y él se acercará a vosotros.", ref: "Santiago 4:8" },
        },
        related: ["superar-ansiedad", "despues-muerte", "biblia-relevante"]
    },
    {
        id: "superar-ansiedad", slug: "superar-ansiedad",
        category: "Vida Cristiana",
        title: "Cómo Superar la Ansiedad: Una Perspectiva de Esperanza",
        excerpt: "La ansiedad afecta a millones de personas. Pero hay una fuente de paz que va más allá de las técnicas convencionales.",
        readTime: 6, date: "22 Feb 2026",
        author: { name: "Dra. María López", role: "Consejera pastoral, MMM Coquimbo", initials: "ML" },
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        content: {
            intro: "Si alguna vez has sentido que el peso del mundo cae sobre tus hombros, que tu mente no para de girar con preocupaciones, no estás solo. La ansiedad es una de las luchas más comunes de nuestro tiempo.",
            sections: [
                { title: "Reconocer no es debilidad", paragraphs: ["Admitir que luchas con ansiedad no te hace débil — te hace humano. En la Biblia encontramos a personas de gran fe que también experimentaron angustia. David clamó desde la desesperación. Elías quiso rendirse. Pablo habló de sus presiones constantes.", "El primer paso es dejar de fingir que todo está bien. Dios no se aleja de nuestro dolor — se acerca."], verse: { text: "Echa sobre Jehová tu carga, y él te sustentará; no dejará para siempre caído al justo.", ref: "Salmos 55:22" } },
                { title: "Una paz diferente", paragraphs: ["El mundo ofrece soluciones temporales: distracción, medicación, escapismo. Y aunque algunas herramientas son útiles, hay una paz que opera a un nivel más profundo. Jesús dijo: \"Mi paz os doy; no como el mundo la da.\"", "Esta paz no significa ausencia de problemas. Significa tener un ancla firme en medio de la tormenta. Es saber que no estás solo y que hay alguien más grande sosteniendo tu vida."] },
                { title: "Pasos prácticos con fe", paragraphs: ["Habla con Dios como hablarías con un amigo — sin fórmulas, sin palabras perfectas. Encuentra una comunidad de personas reales que te escuchen. Busca ayuda profesional si la necesitas — Dios también obra a través de consejeros y terapeutas.", "La fe no reemplaza el cuidado de tu salud mental. Pero sí te da un fundamento que ninguna técnica puede ofrecer: la certeza de que eres amado incondicionalmente."] }
            ],
            keyVerse: { text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones.", ref: "Filipenses 4:6-7" },
        },
        related: ["existe-dios", "despues-muerte", "perdonar"]
    },
    {
        id: "despues-muerte", slug: "despues-muerte",
        category: "Preguntas de Vida",
        title: "¿Qué Pasa Después de la Muerte?",
        excerpt: "La pregunta que todos nos hacemos tarde o temprano, explorada con honestidad y esperanza.",
        readTime: 7, date: "15 Feb 2026",
        author: { name: "Pastor Roberto Méndez", role: "Pastor principal, MMM Santiago Centro", initials: "RM" },
        coverGradient: "linear-gradient(135deg, #2d1f3d 0%, #4a3560 100%)",
        content: { intro: "Es la pregunta definitiva...", sections: [{ title: "Más allá del miedo", paragraphs: ["La muerte nos asusta porque representa lo desconocido. Pero la Biblia nos da respuestas claras y llenas de esperanza sobre lo que viene después."] }], keyVerse: { text: "Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.", ref: "Juan 11:25" } },
        related: ["existe-dios", "superar-ansiedad", "primeros-pasos"]
    },
    {
        id: "biblia-relevante", slug: "biblia-relevante",
        category: "Primeros Pasos",
        title: "¿Es la Biblia Relevante Hoy?",
        excerpt: "Un libro escrito hace miles de años, ¿puede tener algo que decirle a tu vida en el siglo XXI?",
        readTime: 5, date: "10 Feb 2026",
        author: { name: "Carlos Vega", role: "Maestro bíblico, MMM La Serena", initials: "CV" },
        coverGradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        content: { intro: "Un libro antiguo...", sections: [{ title: "Más actual de lo que crees", paragraphs: ["La Biblia habla de ansiedad, relaciones rotas, injusticia, propósito y esperanza — temas que son tan relevantes hoy como hace 2000 años."] }], keyVerse: { text: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", ref: "Salmos 119:105" } },
        related: ["existe-dios", "primeros-pasos", "superar-ansiedad"]
    },
    {
        id: "perdonar", slug: "perdonar",
        category: "Vida Cristiana",
        title: "El Poder de Perdonar (Aunque No lo Merezcan)",
        excerpt: "El perdón no es para el otro — es para ti. Descubre cómo soltar el peso más pesado que cargas.",
        readTime: 6, date: "5 Feb 2026",
        author: { name: "Dra. María López", role: "Consejera pastoral, MMM Coquimbo", initials: "ML" },
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        content: { intro: "Perdonar duele...", sections: [{ title: "No es lo que piensas", paragraphs: ["Perdonar no significa que lo que te hicieron está bien. Perdonar es soltar la cadena que te ata a esa persona y a ese momento."] }], keyVerse: { text: "Sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó.", ref: "Efesios 4:32" } },
        related: ["superar-ansiedad", "biblia-relevante", "testimonio-carlos"]
    },
    {
        id: "primeros-pasos", slug: "primeros-pasos",
        category: "Primeros Pasos",
        title: "Acepté a Jesús, ¿Y Ahora Qué?",
        excerpt: "Los primeros días de tu vida de fe: guía práctica para nuevos creyentes que quieren crecer.",
        readTime: 5, date: "1 Feb 2026",
        author: { name: "Pastor Roberto Méndez", role: "Pastor principal, MMM Santiago Centro", initials: "RM" },
        coverGradient: "linear-gradient(135deg, #0891B2 0%, #0E7490 100%)",
        content: { intro: "Felicidades por dar el paso más importante...", sections: [{ title: "Tu nueva vida comienza", paragraphs: ["Has tomado la mejor decisión de tu vida. Pero es solo el comienzo de una aventura increíble. Aquí te guiamos en tus primeros pasos."] }], keyVerse: { text: "Como niños recién nacidos, desead la leche espiritual no adulterada, para que por ella crezcáis.", ref: "1 Pedro 2:2" } },
        related: ["biblia-relevante", "superar-ansiedad", "perdonar"]
    },
    {
        id: "testimonio-carlos", slug: "testimonio-carlos",
        category: "Testimonios",
        title: "\"Estaba Hundido en la Depresión. Hoy Tengo Esperanza.\"",
        excerpt: "La historia de Carlos, un joven de Santiago que encontró razones para vivir cuando ya no las buscaba.",
        readTime: 4, date: "25 Ene 2026",
        author: { name: "Carlos M.", role: "Testimonio personal", initials: "CM" },
        coverGradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
        content: { intro: "Mi nombre es Carlos...", sections: [{ title: "El fondo del pozo", paragraphs: ["Tenía 24 años y ya no quería seguir. No veía salida. Hasta que alguien me invitó a un lugar donde encontré algo que no esperaba."] }], keyVerse: { text: "Jehová es mi pastor; nada me faltará.", ref: "Salmos 23:1" } },
        related: ["superar-ansiedad", "existe-dios", "primeros-pasos"]
    },
    {
        id: "matrimonio-crisis", slug: "matrimonio-crisis",
        category: "Vida Cristiana",
        title: "Cuando Tu Matrimonio Está en Crisis",
        excerpt: "No todo está perdido. Principios bíblicos y pasos prácticos para restaurar lo que parece roto.",
        readTime: 7, date: "18 Ene 2026",
        author: { name: "Pastor Fernando Torres", role: "Pastor, MMM Valparaíso", initials: "FT" },
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        content: { intro: "Muchas parejas llegan a un punto...", sections: [{ title: "Hay esperanza", paragraphs: ["El matrimonio fue diseñado por Dios, y Él tiene el poder de restaurar lo que nosotros creemos imposible de arreglar."] }], keyVerse: { text: "Lo que Dios juntó, no lo separe el hombre.", ref: "Marcos 10:9" } },
        related: ["perdonar", "superar-ansiedad", "testimonio-carlos"]
    },
    {
        id: "proposito-trabajo", slug: "proposito-trabajo",
        category: "Vida Cristiana",
        title: "Encontrando Propósito en Tu Trabajo Diario",
        excerpt: "Tu empleo no es solo un medio para ganar dinero — puede ser parte de un llamado más grande.",
        readTime: 5, date: "10 Ene 2026",
        author: { name: "Carlos Vega", role: "Maestro bíblico, MMM La Serena", initials: "CV" },
        coverGradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        content: { intro: "Pasamos la mayor parte de nuestra vida trabajando...", sections: [{ title: "Más que un sueldo", paragraphs: ["Cuando entiendes que tu trabajo es parte de un propósito divino, hasta las tareas más rutinarias cobran significado."] }], keyVerse: { text: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.", ref: "Colosenses 3:23" } },
        related: ["superar-ansiedad", "biblia-relevante", "perdonar"]
    },
];

const CATEGORIES = ["Todos", "Preguntas de Vida", "Primeros Pasos", "Vida Cristiana", "Testimonios"];

// ═══════════════════════════════════════
// ICONS
// ═══════════════════════════════════════
const SearchIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ArrowIco = ({ s = 14 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const BackIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ClockIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const WaIco = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>;
const FbIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
const LinkIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>;

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--serif:'Lora',Georgia,serif;--sans:'Nunito Sans',system-ui,sans-serif;--primary:${C.primary};--accent:${C.accent};--cream:${C.cream};}
body{font-family:var(--sans);color:${C.text};background:${C.cream};}

/* HEADER */
.bl-header{position:sticky;top:0;z-index:50;background:rgba(248,246,240,0.93);backdrop-filter:blur(14px);border-bottom:1px solid ${C.border};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;}
.bl-logo{font-family:var(--serif);font-size:19px;color:${C.primary};text-decoration:none;display:flex;align-items:center;gap:8px;}
.bl-logo .mark{display:inline-flex;width:28px;height:28px;border-radius:5px;align-items:center;justify-content:center;border:1.5px solid ${C.accent};color:${C.accent};font-size:13px;}
.bl-back{font-size:14px;color:${C.muted};text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:600;transition:color 0.2s;}
.bl-back:hover{color:${C.primary};}

/* HERO */
.bl-hero{max-width:1200px;margin:0 auto;padding:40px 24px 0;text-align:center;}
.bl-hero h1{font-family:var(--serif);font-size:clamp(28px,5vw,44px);color:${C.primary};margin-bottom:8px;font-weight:600;}
.bl-hero .sub{font-size:16px;color:${C.muted};margin-bottom:28px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.6;}
.bl-search{max-width:480px;margin:0 auto 20px;display:flex;align-items:center;gap:10px;background:white;border:1.5px solid ${C.border};border-radius:10px;padding:0 14px;transition:border-color 0.3s;}
.bl-search:focus-within{border-color:${C.accent};}
.bl-search input{flex:1;border:none;outline:none;font-size:15px;font-family:var(--sans);padding:12px 0;background:transparent;color:${C.text};}
.bl-search input::placeholder{color:#B0A99E;}
.bl-tabs{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding-bottom:32px;}
.bl-tab{padding:8px 18px;border-radius:20px;font-size:13px;font-weight:700;border:1.5px solid ${C.border};background:white;color:${C.muted};cursor:pointer;transition:all 0.2s;font-family:var(--sans);}
.bl-tab:hover{border-color:${C.accent};color:${C.primary};}
.bl-tab.active{background:${C.primary};color:white;border-color:${C.primary};}

/* LAYOUT */
.bl-layout{max-width:1200px;margin:0 auto;padding:0 24px 60px;display:grid;grid-template-columns:1fr 320px;gap:40px;}

/* FEATURED */
.bl-featured{grid-column:1/-1;border-radius:16px;overflow:hidden;cursor:pointer;display:grid;grid-template-columns:1.2fr 1fr;min-height:340px;background:white;border:1px solid ${C.border};transition:box-shadow 0.3s,transform 0.3s;}
.bl-featured:hover{box-shadow:0 12px 40px rgba(0,0,0,0.08);transform:translateY(-3px);}
.bf-img{position:relative;overflow:hidden;}
.bf-img-inner{width:100%;height:100%;transition:transform 0.5s;}
.bl-featured:hover .bf-img-inner{transform:scale(1.03);}
.bf-body{padding:36px 32px;display:flex;flex-direction:column;justify-content:center;}
.bf-cat{display:inline-block;padding:4px 12px;border-radius:14px;font-size:11px;font-weight:800;letter-spacing:0.5px;color:white;margin-bottom:14px;width:fit-content;}
.bf-title{font-family:var(--serif);font-size:clamp(22px,3vw,30px);color:${C.primary};line-height:1.3;margin-bottom:12px;font-weight:600;}
.bl-featured:hover .bf-title{text-decoration-color:${C.accent};}
.bf-excerpt{font-size:15px;color:${C.muted};line-height:1.7;margin-bottom:18px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.bf-meta{display:flex;align-items:center;gap:10px;font-size:13px;color:${C.light};}
.bf-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:800;flex-shrink:0;}
.bf-author{font-weight:700;color:${C.text};}
.bf-read{display:inline-flex;align-items:center;gap:6px;color:${C.accent};font-weight:700;font-size:14px;margin-top:12px;transition:gap 0.3s;}
.bl-featured:hover .bf-read{gap:10px;}

/* ARTICLE GRID */
.bl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px;}
.bl-card{border-radius:14px;overflow:hidden;background:white;border:1px solid ${C.border};cursor:pointer;transition:all 0.3s;}
.bl-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.06);transform:translateY(-3px);}
.bc-img{height:180px;position:relative;overflow:hidden;}
.bc-img-inner{width:100%;height:100%;transition:transform 0.5s;}
.bl-card:hover .bc-img-inner{transform:scale(1.05);}
.bc-cat{position:absolute;top:12px;left:12px;padding:4px 10px;border-radius:12px;font-size:10px;font-weight:800;letter-spacing:0.5px;color:white;z-index:2;}
.bc-body{padding:20px;}
.bc-title{font-family:var(--serif);font-size:17px;color:${C.primary};line-height:1.35;margin-bottom:8px;font-weight:600;transition:color 0.2s;}
.bl-card:hover .bc-title{color:${C.accent};}
.bc-excerpt{font-size:13px;color:${C.muted};line-height:1.6;margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.bc-meta{display:flex;align-items:center;gap:10px;font-size:12px;color:${C.light};}
.bc-meta .dot{width:3px;height:3px;border-radius:50%;background:${C.light};}

/* SIDEBAR */
.bl-sidebar{display:flex;flex-direction:column;gap:24px;}
.sb-card{background:white;border:1px solid ${C.border};border-radius:14px;padding:24px;overflow:hidden;}
.sb-title{font-family:var(--serif);font-size:18px;color:${C.primary};margin-bottom:16px;font-weight:600;}
.sb-popular-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid ${C.border};cursor:pointer;transition:background 0.2s;}
.sb-popular-item:last-child{border-bottom:none;}
.sb-popular-item:hover{background:rgba(212,168,67,0.04);margin:0 -8px;padding:10px 8px;border-radius:8px;}
.sb-num{font-family:var(--serif);font-size:22px;font-weight:700;color:${C.accent};opacity:0.5;line-height:1;min-width:24px;}
.sb-pop-title{font-size:14px;font-weight:600;color:${C.primary};line-height:1.4;}
.sb-pop-cat{font-size:11px;color:${C.muted};margin-top:2px;}
.sb-nl-input{width:100%;padding:12px 14px;border:1.5px solid ${C.border};border-radius:8px;font-size:14px;font-family:var(--sans);background:${C.cream};outline:none;margin-bottom:10px;transition:border-color 0.3s;}
.sb-nl-input:focus{border-color:${C.accent};}
.sb-nl-btn{width:100%;padding:12px;border-radius:8px;background:${C.accent};color:${C.primaryDark};border:none;font-size:14px;font-weight:800;font-family:var(--sans);cursor:pointer;transition:background 0.2s;}
.sb-nl-btn:hover{background:${C.accentLight};}
.sb-promo{border-left:3px solid ${C.accent};position:relative;overflow:hidden;}
.sb-promo::before{content:'';position:absolute;top:0;right:0;width:80px;height:80px;background:radial-gradient(circle,rgba(212,168,67,0.08) 0%,transparent 70%);border-radius:50%;}
.sb-promo p{font-size:14px;color:${C.muted};line-height:1.6;margin-bottom:14px;}
.sb-promo-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:${C.accent};color:${C.primaryDark};font-size:13px;font-weight:800;border:none;cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
.sb-promo-btn:hover{background:${C.accentLight};transform:translateY(-1px);}
.sb-prayer{background:${C.primary};border-color:${C.primary};}
.sb-prayer .sb-title{color:white;}
.sb-prayer p{font-size:14px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:14px;}
.sb-prayer-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:8px;background:rgba(255,255,255,0.15);color:white;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,0.2);cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
.sb-prayer-btn:hover{background:rgba(255,255,255,0.25);}

/* LOAD MORE */
.load-more-wrap{grid-column:1;text-align:center;padding:20px 0;}
.btn-load{padding:14px 36px;border-radius:10px;background:white;border:1.5px solid ${C.border};font-size:14px;font-weight:700;color:${C.primary};cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
.btn-load:hover{border-color:${C.accent};color:${C.accent};}

/* ═══ ARTICLE DETAIL ═══ */
.ad-cover{width:100%;height:clamp(240px,35vw,400px);position:relative;overflow:hidden;}
.ad-cover-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.ad-cover .cover-cross{font-family:var(--serif);font-size:120px;color:rgba(255,255,255,0.05);user-select:none;}
.ad-header{max-width:740px;margin:0 auto;padding:40px 24px 0;text-align:center;}
.ad-cat{display:inline-block;padding:5px 14px;border-radius:14px;font-size:11px;font-weight:800;letter-spacing:0.5px;color:white;margin-bottom:16px;}
.ad-title{font-family:var(--serif);font-size:clamp(28px,5vw,44px);color:${C.primary};line-height:1.25;margin-bottom:20px;font-weight:600;}
.ad-meta{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;font-size:13px;color:${C.muted};margin-bottom:12px;}
.ad-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:800;flex-shrink:0;}
.ad-author-name{font-weight:700;color:${C.text};}
.ad-meta .dot{width:3px;height:3px;border-radius:50%;background:${C.light};}
.ad-share{display:flex;align-items:center;gap:8px;justify-content:center;margin-top:16px;padding-bottom:32px;border-bottom:1px solid ${C.border};}
.share-btn{display:flex;align-items:center;gap:5px;padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
.share-btn:hover{transform:translateY(-1px);}
.share-wa{background:rgba(37,211,102,0.1);color:#1a9e4a;}
.share-fb{background:rgba(24,119,242,0.1);color:#1877F2;}
.share-link{background:rgba(30,58,95,0.06);color:${C.primary};}
.copied{background:${C.accent} !important;color:${C.primaryDark} !important;}

/* ARTICLE BODY */
.ad-body{max-width:700px;margin:0 auto;padding:40px 24px 0;}
.ad-body .intro{font-size:20px;line-height:1.8;color:${C.text};margin-bottom:32px;font-weight:400;}
.ad-body h2{font-family:var(--serif);font-size:26px;color:${C.primary};margin:40px 0 16px;font-weight:600;line-height:1.3;}
.ad-body p{font-size:18px;line-height:1.85;color:#3a3a3a;margin-bottom:20px;font-weight:400;}
.verse-callout{margin:32px 0;padding:24px 28px;border-left:3px solid ${C.accent};background:rgba(212,168,67,0.04);border-radius:0 12px 12px 0;}
.verse-callout .v-text{font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.7;color:${C.primary};margin-bottom:8px;}
.verse-callout .v-ref{font-family:var(--sans);font-size:13px;font-weight:700;color:${C.accent};}

/* KEY VERSE */
.key-verse{max-width:700px;margin:48px auto;padding:32px;text-align:center;background:linear-gradient(135deg,rgba(212,168,67,0.06),rgba(30,58,95,0.04));border-radius:16px;border:1px solid ${C.border};}
.key-verse .kv-label{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${C.accent};margin-bottom:12px;}
.key-verse .kv-text{font-family:var(--serif);font-style:italic;font-size:22px;line-height:1.6;color:${C.primary};margin-bottom:10px;}
.key-verse .kv-ref{font-size:14px;font-weight:700;color:${C.accent};}

/* AUTHOR BIO */
.author-bio{max-width:700px;margin:0 auto;padding:32px;display:flex;gap:20px;align-items:center;background:white;border:1px solid ${C.border};border-radius:14px;}
.ab-avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-family:var(--serif);font-size:24px;flex-shrink:0;}
.ab-name{font-weight:800;font-size:16px;color:${C.primary};}
.ab-role{font-size:13px;color:${C.muted};margin-top:2px;}

/* END CTA */
.end-cta{max-width:700px;margin:32px auto;padding:32px;text-align:center;border-radius:14px;border:1px solid ${C.border};position:relative;overflow:hidden;}
.end-cta h3{font-family:var(--serif);font-size:22px;color:${C.primary};margin-bottom:8px;}
.end-cta p{font-size:15px;color:${C.muted};margin-bottom:18px;line-height:1.6;}
.btn-cta-gold{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;border-radius:10px;background:${C.accent};color:${C.primaryDark};font-size:15px;font-weight:800;border:none;cursor:pointer;font-family:var(--sans);transition:all 0.2s;box-shadow:0 4px 16px rgba(212,168,67,0.25);}
.btn-cta-gold:hover{background:${C.accentLight};transform:translateY(-2px);}

/* RELATED */
.related-section{max-width:900px;margin:48px auto;padding:0 24px 60px;}
.related-section h3{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:24px;text-align:center;}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;}

/* WA CTA */
.wa-comment{max-width:700px;margin:0 auto 48px;padding:24px;text-align:center;background:rgba(37,211,102,0.05);border:1px solid rgba(37,211,102,0.15);border-radius:14px;}
.wa-comment p{font-size:15px;color:${C.muted};margin-bottom:14px;}
.btn-wa{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:10px;background:${C.green};color:white;font-size:14px;font-weight:800;border:none;cursor:pointer;font-family:var(--sans);transition:all 0.2s;}
.btn-wa:hover{background:#1ea952;transform:translateY(-1px);}

/* RESPONSIVE */
@media(max-width:900px){
  .bl-layout{grid-template-columns:1fr;gap:24px;}
  .bl-featured{grid-template-columns:1fr;min-height:auto;}
  .bf-img{height:220px;}
  .bl-sidebar{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .author-bio{flex-direction:column;text-align:center;}
}
@media(max-width:600px){
  .bl-sidebar{grid-template-columns:1fr;}
  .bl-grid{grid-template-columns:1fr;}
  .related-grid{grid-template-columns:1fr;}
  .ad-share{flex-wrap:wrap;}
}
`;

// ═══════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════

// Category pill
const CatPill = ({ cat, style = {} }) => (
    <span style={{ background: catColor(cat), ...style }}>{cat}</span>
);

// Small article card (reused in grid + related)
const ArticleCard = ({ article, onClick }) => (
    <div className="bl-card" onClick={() => onClick(article.slug)}>
        <div className="bc-img">
            <div className="bc-img-inner" style={{ background: article.coverGradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 56, color: "rgba(255,255,255,0.06)" }}>✦</span>
            </div>
            <span className="bc-cat" style={{ background: catColor(article.category) }}>{article.category}</span>
        </div>
        <div className="bc-body">
            <div className="bc-title">{article.title}</div>
            <div className="bc-excerpt">{article.excerpt}</div>
            <div className="bc-meta">
                <ClockIco /> {article.readTime} min
                <span className="dot" />
                {article.date}
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════
// LISTING VIEW
// ═══════════════════════════════════════
const BlogListing = ({ onOpenArticle, searchQuery, setSearchQuery, activeCategory, setActiveCategory }) => {
    const [visibleCount, setVisibleCount] = useState(6);

    const featured = ARTICLES.find(a => a.featured);
    const rest = ARTICLES.filter(a => !a.featured);

    const filtered = useMemo(() => {
        let list = rest;
        if (activeCategory !== "Todos") list = list.filter(a => a.category === activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
        }
        return list;
    }, [activeCategory, searchQuery, rest]);

    const popular = [...ARTICLES].sort((a, b) => a.readTime - b.readTime).slice(0, 5);

    return (
        <>
            {/* HERO */}
            <div className="bl-hero">
                <h1>Reflexiones para Tu Vida</h1>
                <p className="sub">Artículos sobre fe, esperanza y las preguntas que todos nos hacemos</p>
                <div className="bl-search">
                    <SearchIco />
                    <input placeholder="Buscar artículos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="bl-tabs">
                    {CATEGORIES.map(cat => (
                        <button key={cat} className={`bl-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN LAYOUT */}
            <div className="bl-layout">
                {/* FEATURED */}
                {activeCategory === "Todos" && !searchQuery && featured && (
                    <div className="bl-featured" onClick={() => onOpenArticle(featured.slug)}>
                        <div className="bf-img">
                            <div className="bf-img-inner" style={{ background: featured.coverGradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontFamily: "var(--serif)", fontSize: 100, color: "rgba(255,255,255,0.05)" }}>✦</span>
                            </div>
                        </div>
                        <div className="bf-body">
                            <span className="bf-cat" style={{ background: catColor(featured.category) }}>{featured.category}</span>
                            <h2 className="bf-title">{featured.title}</h2>
                            <p className="bf-excerpt">{featured.excerpt}</p>
                            <div className="bf-meta">
                                <div className="bf-avatar" style={{ background: C.primary }}>{featured.author.initials}</div>
                                <div>
                                    <div className="bf-author">{featured.author.name}</div>
                                    <span>{featured.date} · {featured.readTime} min lectura</span>
                                </div>
                            </div>
                            <span className="bf-read">Leer artículo <ArrowIco /></span>
                        </div>
                    </div>
                )}

                {/* GRID */}
                <div>
                    <div className="bl-grid">
                        {filtered.slice(0, visibleCount).map(a => (
                            <ArticleCard key={a.id} article={a} onClick={onOpenArticle} />
                        ))}
                    </div>
                    {visibleCount < filtered.length && (
                        <div className="load-more-wrap">
                            <button className="btn-load" onClick={() => setVisibleCount(v => v + 6)}>Cargar más artículos</button>
                        </div>
                    )}
                    {filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "48px 0", color: C.muted }}>
                            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🔍</div>
                            <p style={{ fontSize: 16, fontWeight: 600 }}>No encontramos artículos con esa búsqueda</p>
                            <p style={{ fontSize: 14, marginTop: 4 }}>Intenta con otras palabras o explora las categorías</p>
                        </div>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className="bl-sidebar">
                    {/* Popular */}
                    <div className="sb-card">
                        <h3 className="sb-title">Más Leídos</h3>
                        {popular.map((a, i) => (
                            <div key={a.id} className="sb-popular-item" onClick={() => onOpenArticle(a.slug)}>
                                <span className="sb-num">{i + 1}</span>
                                <div>
                                    <div className="sb-pop-title">{a.title}</div>
                                    <div className="sb-pop-cat">{a.category}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter */}
                    <div className="sb-card">
                        <h3 className="sb-title">Recibe Reflexiones Semanales</h3>
                        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>Devocionales y artículos directamente en tu correo.</p>
                        <input className="sb-nl-input" type="email" placeholder="Tu correo electrónico" />
                        <button className="sb-nl-btn">Suscribirme</button>
                    </div>

                    {/* Prayer */}
                    <div className="sb-card sb-prayer">
                        <h3 className="sb-title">¿Necesitas Oración?</h3>
                        <p>Comparte tu necesidad y oraremos por ti. No estás solo.</p>
                        <button className="sb-prayer-btn" onClick={() => { }}>
                            Pedir oración <ArrowIco s={12} />
                        </button>
                    </div>

                    {/* Conoce a Jesús */}
                    <div className="sb-card sb-promo">
                        <h3 className="sb-title">Conoce a Jesús</h3>
                        <p>La decisión más importante de tu vida comienza con una pregunta. ¿Quieres saber más?</p>
                        <button className="sb-promo-btn" onClick={() => { }}>
                            Saber más <ArrowIco s={12} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// ═══════════════════════════════════════
// ARTICLE DETAIL VIEW
// ═══════════════════════════════════════
const ArticleDetail = ({ slug, onBack, onOpenArticle }) => {
    const article = ARTICLES.find(a => a.slug === slug);
    const [copied, setCopied] = useState(false);

    useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

    if (!article) return <div style={{ padding: 60, textAlign: "center" }}>Artículo no encontrado</div>;

    const { content, author, category } = article;
    const relatedArticles = (article.related || []).map(s => ARTICLES.find(a => a.slug === s)).filter(Boolean);

    const ctaMap = {
        "Preguntas de Vida": { title: "¿Quieres saber más sobre Jesús?", desc: "Esta podría ser la decisión más importante de tu vida.", btn: "Conoce a Jesús", bg: `linear-gradient(135deg, rgba(212,168,67,0.06), rgba(30,58,95,0.04))` },
        "Testimonios": { title: "¿Tienes un testimonio?", desc: "Tu historia puede inspirar a alguien más. Compártela con nosotros.", btn: "Compartir mi testimonio", bg: `linear-gradient(135deg, rgba(220,38,38,0.04), rgba(30,58,95,0.03))` },
        "Vida Cristiana": { title: "Encuentra una iglesia para crecer", desc: "La fe crece mejor en comunidad. Hay una iglesia esperándote cerca de ti.", btn: "Buscar iglesia", bg: `linear-gradient(135deg, rgba(5,150,105,0.04), rgba(30,58,95,0.03))` },
        "Primeros Pasos": { title: "¿Diste tus primeros pasos en la fe?", desc: "Queremos acompañarte. Conecta con una comunidad que te apoye.", btn: "Encontrar comunidad", bg: `linear-gradient(135deg, rgba(8,145,178,0.04), rgba(30,58,95,0.03))` },
    };
    const cta = ctaMap[category] || ctaMap["Preguntas de Vida"];

    const handleCopy = () => {
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWA = () => window.open(`https://wa.me/?text=${encodeURIComponent(article.title + " — Lee este artículo: " + window.location.href)}`);
    const shareFB = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);

    return (
        <div>
            {/* COVER */}
            <div className="ad-cover">
                <div className="ad-cover-inner" style={{ background: article.coverGradient }}>
                    <span className="cover-cross">✦</span>
                </div>
            </div>

            {/* HEADER */}
            <div className="ad-header">
                <span className="ad-cat" style={{ background: catColor(category) }}>{category}</span>
                <h1 className="ad-title">{article.title}</h1>
                <div className="ad-meta">
                    <div className="ad-avatar" style={{ background: C.primary }}>{author.initials}</div>
                    <span className="ad-author-name">{author.name}</span>
                    <span className="dot" />
                    <span>{article.date}</span>
                    <span className="dot" />
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ClockIco /> {article.readTime} min lectura</span>
                </div>
                <div className="ad-share">
                    <button className="share-btn share-wa" onClick={shareWA}><WaIco /> WhatsApp</button>
                    <button className="share-btn share-fb" onClick={shareFB}><FbIco /> Facebook</button>
                    <button className={`share-btn share-link ${copied ? "copied" : ""}`} onClick={handleCopy}><LinkIco /> {copied ? "¡Copiado!" : "Copiar link"}</button>
                </div>
            </div>

            {/* BODY */}
            <div className="ad-body">
                <p className="intro">{content.intro}</p>

                {content.sections.map((sec, i) => (
                    <div key={i}>
                        <h2>{sec.title}</h2>
                        {sec.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                        {sec.verse && (
                            <div className="verse-callout">
                                <div className="v-text">{sec.verse.text}</div>
                                <div className="v-ref">— {sec.verse.ref}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* KEY VERSE */}
            <div className="key-verse">
                <div className="kv-label">Versículo Clave</div>
                <div className="kv-text">{content.keyVerse.text}</div>
                <div className="kv-ref">— {content.keyVerse.ref}</div>
            </div>

            {/* AUTHOR BIO */}
            <div className="author-bio" style={{ margin: "32px auto", maxWidth: 700, padding: "24px 32px" }}>
                <div className="ab-avatar" style={{ background: `linear-gradient(135deg, ${C.primary}, #2a5280)` }}>{author.initials}</div>
                <div>
                    <div className="ab-name">{author.name}</div>
                    <div className="ab-role">{author.role}</div>
                </div>
            </div>

            {/* END CTA */}
            <div className="end-cta" style={{ background: cta.bg }}>
                <h3>{cta.title}</h3>
                <p>{cta.desc}</p>
                <button className="btn-cta-gold">{cta.btn} <ArrowIco /></button>
            </div>

            {/* WA COMMENT */}
            <div className="wa-comment">
                <p>¿Qué piensas sobre este artículo? Nos encantaría saber tu opinión.</p>
                <button className="btn-wa" onClick={() => window.open(`https://wa.me/56912345612?text=${encodeURIComponent("Hola, acabo de leer el artículo: " + article.title)}`)}>
                    <WaIco s={18} /> Escríbenos por WhatsApp
                </button>
            </div>

            {/* RELATED */}
            {relatedArticles.length > 0 && (
                <div className="related-section">
                    <h3>Artículos Relacionados</h3>
                    <div className="related-grid">
                        {relatedArticles.slice(0, 3).map(a => (
                            <ArticleCard key={a.id} article={a} onClick={onOpenArticle} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function BlogPage() {
    const [view, setView] = useState("listing"); // "listing" | "detail"
    const [activeSlug, setActiveSlug] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("Todos");

    const openArticle = (slug) => {
        setActiveSlug(slug);
        setView("detail");
    };

    const goBack = () => {
        setView("listing");
        setActiveSlug(null);
    };

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh" }}>
                {/* HEADER */}
                <header className="bl-header">
                    <a className="bl-logo" href="/"><span className="mark">✦</span> MMM Chile</a>
                    {view === "detail" ? (
                        <button className="bl-back" onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <BackIco /> Volver al blog
                        </button>
                    ) : (
                        <a className="bl-back" href="/">
                            <BackIco /> Inicio
                        </a>
                    )}
                </header>

                {view === "listing" ? (
                    <BlogListing
                        onOpenArticle={openArticle}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />
                ) : (
                    <ArticleDetail slug={activeSlug} onBack={goBack} onOpenArticle={openArticle} />
                )}

                {/* FOOTER */}
                <footer style={{ padding: 20, background: C.primaryDark, textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/" style={{ color: C.accent, textDecoration: "none" }}>mmmchile.cl</a>
                </footer>
            </div>
        </>
    );
}