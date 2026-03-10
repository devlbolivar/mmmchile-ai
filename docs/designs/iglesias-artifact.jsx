import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════
// DESIGN TOKENS
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
    muted: "#6B7280",
    border: "#E8E4DC",
    green: "#25D366",
    red: "#EF4444",
    cardHover: "#FDFCF9",
};

// ═══════════════════════════════════════════════
// CHURCH DATA — 32 locations across Chile
// ═══════════════════════════════════════════════
const CHURCHES = [
    { id: 1, name: "MMM Arica", city: "Arica", zone: "norte", address: "Av. Comandante San Martín 2456", lat: -18.475, lng: -70.298, pastor: "Rev. Marco Gutiérrez", phone: "+56912345601", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:30" }] },
    { id: 2, name: "MMM Iquique", city: "Iquique", zone: "norte", address: "Calle Baquedano 1234", lat: -20.213, lng: -70.152, pastor: "Rev. José Peña", phone: "+56912345602", services: [{ day: "Domingo", time: "10:30" }, { day: "Domingo", time: "18:00" }, { day: "Jueves", time: "19:00" }] },
    { id: 3, name: "MMM Alto Hospicio", city: "Alto Hospicio", zone: "norte", address: "Av. Los Cóndores 567", lat: -20.271, lng: -70.099, pastor: "Rev. Ana Morales", phone: "+56912345603", services: [{ day: "Domingo", time: "11:00" }, { day: "Viernes", time: "19:30" }] },
    { id: 4, name: "MMM Antofagasta", city: "Antofagasta", zone: "norte", address: "Calle Prat 890", lat: -23.650, lng: -70.400, pastor: "Rev. Luis Rojas", phone: "+56912345604", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 5, name: "MMM Calama", city: "Calama", zone: "norte", address: "Av. Granaderos 345", lat: -22.456, lng: -68.929, pastor: "Rev. Pablo Muñoz", phone: "+56912345605", services: [{ day: "Domingo", time: "10:30" }, { day: "Jueves", time: "19:30" }] },
    { id: 6, name: "MMM Copiapó", city: "Copiapó", zone: "norte", address: "Calle Los Carrera 678", lat: -27.367, lng: -70.332, pastor: "Rev. Diego Herrera", phone: "+56912345606", services: [{ day: "Domingo", time: "11:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 7, name: "MMM La Serena", city: "La Serena", zone: "norte", address: "Av. Francisco de Aguirre 1023", lat: -29.907, lng: -71.254, pastor: "Rev. Carlos Vega", phone: "+56912345607", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Viernes", time: "19:00" }] },
    { id: 8, name: "MMM Coquimbo", city: "Coquimbo", zone: "norte", address: "Calle Aldunate 456", lat: -29.953, lng: -71.339, pastor: "Rev. María López", phone: "+56912345608", services: [{ day: "Domingo", time: "10:30" }, { day: "Miércoles", time: "19:30" }] },
    { id: 9, name: "MMM Valparaíso", city: "Valparaíso", zone: "centro", address: "Calle Condell 789", lat: -33.046, lng: -71.620, pastor: "Rev. Fernando Torres", phone: "+56912345609", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Jueves", time: "19:00" }] },
    { id: 10, name: "MMM Viña del Mar", city: "Viña del Mar", zone: "centro", address: "Av. Libertad 1456", lat: -33.015, lng: -71.551, pastor: "Rev. Andrés Silva", phone: "+56912345610", services: [{ day: "Domingo", time: "10:30" }, { day: "Domingo", time: "17:30" }, { day: "Miércoles", time: "19:00" }] },
    { id: 11, name: "MMM Quilpué", city: "Quilpué", zone: "centro", address: "Calle Freire 234", lat: -33.047, lng: -71.442, pastor: "Rev. Sandra Díaz", phone: "+56912345611", services: [{ day: "Domingo", time: "11:00" }, { day: "Viernes", time: "19:30" }] },
    { id: 12, name: "MMM Santiago Centro", city: "Santiago", zone: "centro", address: "Av. Libertador B. O'Higgins 2345", lat: -33.445, lng: -70.660, pastor: "Rev. Roberto Méndez", phone: "+56912345612", services: [{ day: "Domingo", time: "10:00" }, { day: "Domingo", time: "12:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:30" }, { day: "Viernes", time: "19:30" }] },
    { id: 13, name: "MMM Providencia", city: "Providencia", zone: "centro", address: "Av. Providencia 1567", lat: -33.427, lng: -70.611, pastor: "Rev. Patricia Soto", phone: "+56912345613", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Jueves", time: "19:00" }] },
    { id: 14, name: "MMM Maipú", city: "Maipú", zone: "centro", address: "Av. Pajaritos 3456", lat: -33.510, lng: -70.756, pastor: "Rev. Héctor Vargas", phone: "+56912345614", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 15, name: "MMM Puente Alto", city: "Puente Alto", zone: "centro", address: "Av. Concha y Toro 1890", lat: -33.612, lng: -70.576, pastor: "Rev. Claudia Ríos", phone: "+56912345615", services: [{ day: "Domingo", time: "10:30" }, { day: "Domingo", time: "17:30" }, { day: "Viernes", time: "19:00" }] },
    { id: 16, name: "MMM La Florida", city: "La Florida", zone: "centro", address: "Av. Vicuña Mackenna 7890", lat: -33.523, lng: -70.588, pastor: "Rev. Miguel Ángel Castro", phone: "+56912345616", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Jueves", time: "19:30" }] },
    { id: 17, name: "MMM San Bernardo", city: "San Bernardo", zone: "centro", address: "Calle Eyzaguirre 567", lat: -33.593, lng: -70.700, pastor: "Rev. Jorge Navarro", phone: "+56912345617", services: [{ day: "Domingo", time: "11:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 18, name: "MMM Rancagua", city: "Rancagua", zone: "centro", address: "Calle Independencia 234", lat: -34.170, lng: -70.741, pastor: "Rev. Isabel Fuentes", phone: "+56912345618", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Viernes", time: "19:00" }] },
    { id: 19, name: "MMM Talca", city: "Talca", zone: "centro", address: "Calle 1 Sur 890", lat: -35.427, lng: -71.655, pastor: "Rev. Tomás Araya", phone: "+56912345619", services: [{ day: "Domingo", time: "11:00" }, { day: "Jueves", time: "19:30" }] },
    { id: 20, name: "MMM Chillán", city: "Chillán", zone: "sur", address: "Av. O'Higgins 678", lat: -36.607, lng: -72.103, pastor: "Rev. Raúl Espinoza", phone: "+56912345620", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 21, name: "MMM Concepción", city: "Concepción", zone: "sur", address: "Calle Barros Arana 1234", lat: -36.827, lng: -73.050, pastor: "Rev. Carmen Bravo", phone: "+56912345621", services: [{ day: "Domingo", time: "10:30" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:00" }, { day: "Viernes", time: "19:30" }] },
    { id: 22, name: "MMM Talcahuano", city: "Talcahuano", zone: "sur", address: "Calle Colón 567", lat: -36.724, lng: -73.117, pastor: "Rev. Eduardo Leal", phone: "+56912345622", services: [{ day: "Domingo", time: "11:00" }, { day: "Jueves", time: "19:00" }] },
    { id: 23, name: "MMM Los Ángeles", city: "Los Ángeles", zone: "sur", address: "Calle Caupolicán 345", lat: -37.469, lng: -72.354, pastor: "Rev. Gloria Paredes", phone: "+56912345623", services: [{ day: "Domingo", time: "11:00" }, { day: "Miércoles", time: "19:30" }] },
    { id: 24, name: "MMM Temuco", city: "Temuco", zone: "sur", address: "Av. Alemania 890", lat: -38.735, lng: -72.590, pastor: "Rev. Ricardo Cifuentes", phone: "+56912345624", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Viernes", time: "19:00" }] },
    { id: 25, name: "MMM Valdivia", city: "Valdivia", zone: "sur", address: "Calle Arauco 234", lat: -39.814, lng: -73.246, pastor: "Rev. Sofía Contreras", phone: "+56912345625", services: [{ day: "Domingo", time: "10:30" }, { day: "Jueves", time: "19:30" }] },
    { id: 26, name: "MMM Osorno", city: "Osorno", zone: "sur", address: "Calle Ramírez 678", lat: -40.574, lng: -73.134, pastor: "Rev. Alejandro Pino", phone: "+56912345626", services: [{ day: "Domingo", time: "11:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 27, name: "MMM Puerto Montt", city: "Puerto Montt", zone: "sur", address: "Av. Diego Portales 1234", lat: -41.469, lng: -72.937, pastor: "Rev. Daniela Vera", phone: "+56912345627", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Viernes", time: "19:00" }] },
    { id: 28, name: "MMM Castro", city: "Castro (Chiloé)", zone: "sur", address: "Calle Blanco 456", lat: -42.480, lng: -73.762, pastor: "Rev. Martín Oyarzún", phone: "+56912345628", services: [{ day: "Domingo", time: "11:00" }, { day: "Miércoles", time: "19:30" }] },
    { id: 29, name: "MMM Coyhaique", city: "Coyhaique", zone: "sur", address: "Calle Baquedano 123", lat: -45.571, lng: -72.066, pastor: "Rev. Francisca Mansilla", phone: "+56912345629", services: [{ day: "Domingo", time: "11:00" }, { day: "Jueves", time: "19:00" }] },
    { id: 30, name: "MMM Punta Arenas", city: "Punta Arenas", zone: "sur", address: "Av. España 567", lat: -53.154, lng: -70.917, pastor: "Rev. Cristóbal Lagos", phone: "+56912345630", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Miércoles", time: "19:00" }] },
    { id: 31, name: "MMM Las Condes", city: "Las Condes", zone: "centro", address: "Av. Apoquindo 4567", lat: -33.410, lng: -70.572, pastor: "Rev. Valentina Reyes", phone: "+56912345631", services: [{ day: "Domingo", time: "10:00" }, { day: "Domingo", time: "18:00" }, { day: "Martes", time: "19:30" }] },
    { id: 32, name: "MMM Ñuñoa", city: "Ñuñoa", zone: "centro", address: "Av. Irarrázaval 2890", lat: -33.453, lng: -70.600, pastor: "Rev. Esteban Parra", phone: "+56912345632", services: [{ day: "Domingo", time: "11:00" }, { day: "Domingo", time: "18:00" }, { day: "Jueves", time: "19:00" }] },
];

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
const haversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getNextService = (services) => {
    const dayOrder = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const now = new Date();
    const today = dayOrder[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    // Find next upcoming service
    let best = services[0];
    for (const s of services) {
        const si = dayOrder.indexOf(s.day);
        const ti = dayOrder.indexOf(today);
        if (si === ti) {
            const [h, m] = s.time.split(":").map(Number);
            if (h * 60 + m > currentTime) { best = s; break; }
        } else if (si > ti || (si < ti)) {
            best = s; break;
        }
    }
    return best;
};

const formatDist = (km) => km < 1 ? `${Math.round(km * 1000)} m` : km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;

// ═══════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════
const SearchSVG = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const LocateSVG = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" /><circle cx="12" cy="12" r="9" /></svg>;
const PinSVG = ({ color = C.primary, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>;
const ClockSVG = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const PhoneSVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>;
const ArrowSVG = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const CloseSVG = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const BackSVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>;
const ChevSVG = ({ open }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9" /></svg>;
const ListSVG = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
const MapSVG = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>;
const NavSVG = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;

// ═══════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--serif:'DM Serif Display',Georgia,serif;--sans:'Outfit',system-ui,sans-serif;--primary:${C.primary};--accent:${C.accent};--cream:${C.cream};}
body{font-family:var(--sans);color:${C.text};background:${C.cream};}

/* ─── HEADER ─── */
.ig-header{
  position:sticky;top:0;z-index:50;
  background:rgba(248,246,240,0.92);backdrop-filter:blur(14px);
  border-bottom:1px solid ${C.border};
  padding:12px 24px;display:flex;align-items:center;justify-content:space-between;
}
.ig-logo{font-family:var(--serif);font-size:19px;color:${C.primary};text-decoration:none;display:flex;align-items:center;gap:8px;}
.ig-logo .mark{display:inline-flex;width:28px;height:28px;border-radius:5px;align-items:center;justify-content:center;border:1.5px solid ${C.accent};color:${C.accent};font-size:13px;}
.ig-back{font-size:14px;color:${C.muted};text-decoration:none;display:flex;align-items:center;gap:4px;font-weight:500;transition:color 0.2s;}
.ig-back:hover{color:${C.primary};}

/* ─── HERO SEARCH ─── */
.ig-hero{
  padding:32px 24px 0;max-width:1400px;margin:0 auto;
}
.ig-hero h1{font-family:var(--serif);font-size:clamp(26px,4vw,38px);color:${C.primary};margin-bottom:6px;font-weight:400;}
.ig-hero .sub{font-size:15px;color:${C.muted};margin-bottom:20px;font-weight:400;line-height:1.5;}
.search-row{display:flex;gap:8px;margin-bottom:14px;}
.search-box{
  flex:1;display:flex;align-items:center;gap:10px;
  background:white;border:1.5px solid ${C.border};border-radius:10px;
  padding:0 14px;transition:border-color 0.3s;
}
.search-box:focus-within{border-color:${C.accent};}
.search-box input{flex:1;border:none;outline:none;font-size:15px;font-family:var(--sans);padding:13px 0;background:transparent;color:${C.text};}
.search-box input::placeholder{color:#B0A99E;}
.geo-btn{
  display:flex;align-items:center;gap:7px;padding:12px 16px;
  background:white;border:1.5px solid ${C.border};border-radius:10px;
  font-family:var(--sans);font-size:13px;font-weight:600;color:${C.primary};
  cursor:pointer;white-space:nowrap;transition:all 0.2s;
}
.geo-btn:hover{border-color:${C.accent};color:${C.accent};}
.geo-btn.active{background:${C.primary};color:white;border-color:${C.primary};}

/* ─── FILTER PILLS ─── */
.pills{display:flex;gap:8px;flex-wrap:wrap;padding-bottom:20px;}
.pill{
  padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;
  border:1.5px solid ${C.border};background:white;color:${C.muted};
  cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:var(--sans);
}
.pill:hover{border-color:${C.accent};color:${C.primary};}
.pill.active{background:${C.primary};color:white;border-color:${C.primary};}

/* ─── MAIN LAYOUT ─── */
.ig-main{display:flex;max-width:1400px;margin:0 auto;height:calc(100vh - 220px);min-height:500px;}
.ig-list{
  width:42%;overflow-y:auto;padding:0 16px 20px 24px;
  scrollbar-width:thin;scrollbar-color:${C.border} transparent;
}
.ig-list::-webkit-scrollbar{width:5px;}
.ig-list::-webkit-scrollbar-thumb{background:${C.border};border-radius:5px;}
.ig-map-container{flex:1;position:relative;background:#E8E4DC;border-radius:16px 0 0 16px;overflow:hidden;margin:0 24px 0 0;}

/* ─── CHURCH CARD ─── */
.ch-card{
  padding:18px 20px;border-radius:12px;cursor:pointer;
  border:1px solid transparent;margin-bottom:8px;
  transition:all 0.25s;position:relative;background:white;
}
.ch-card:hover{border-color:${C.border};box-shadow:0 2px 12px rgba(0,0,0,0.04);}
.ch-card.selected{border-color:${C.accent};border-left:3px solid ${C.accent};background:${C.cardHover};}
.ch-card .ch-name{font-weight:700;font-size:15px;color:${C.primary};margin-bottom:2px;}
.ch-card .ch-city{font-size:13px;color:${C.muted};margin-bottom:6px;display:flex;align-items:center;gap:4px;}
.ch-card .ch-addr{font-size:13px;color:${C.muted};display:flex;align-items:center;gap:4px;margin-bottom:8px;}
.ch-card .ch-service{display:flex;align-items:center;gap:5px;font-size:13px;color:${C.primary};font-weight:500;}
.ch-card .ch-dist{position:absolute;top:18px;right:20px;font-size:12px;font-weight:700;color:${C.accent};background:rgba(212,168,67,0.1);padding:3px 10px;border-radius:12px;}
.ch-actions{display:flex;gap:8px;margin-top:10px;}
.btn-wa-sm{
  display:inline-flex;align-items:center;gap:5px;padding:7px 14px;
  border-radius:8px;font-size:12px;font-weight:600;
  background:rgba(37,211,102,0.1);color:#1a9e4a;border:none;
  font-family:var(--sans);cursor:pointer;transition:background 0.2s;
}
.btn-wa-sm:hover{background:rgba(37,211,102,0.2);}
.btn-detail{
  display:inline-flex;align-items:center;gap:4px;padding:7px 14px;
  border-radius:8px;font-size:12px;font-weight:600;
  background:rgba(30,58,95,0.06);color:${C.primary};border:none;
  font-family:var(--sans);cursor:pointer;transition:background 0.2s;
}
.btn-detail:hover{background:rgba(30,58,95,0.12);}

/* ─── EMPTY STATE ─── */
.empty-state{padding:60px 24px;text-align:center;color:${C.muted};}
.empty-state .em-icon{font-size:48px;margin-bottom:12px;opacity:0.4;}
.empty-state h3{font-family:var(--serif);color:${C.primary};font-size:20px;margin-bottom:8px;}
.empty-state p{font-size:14px;line-height:1.6;}

/* ─── MAP (simulated) ─── */
.sim-map{width:100%;height:100%;position:relative;overflow:hidden;background:linear-gradient(170deg,#e8edf2 0%,#dce3ea 40%,#d4dbe4 100%);}
.sim-map .watermark{position:absolute;bottom:12px;right:14px;font-size:11px;color:rgba(30,58,95,0.25);font-weight:600;letter-spacing:0.5px;}
.map-chile{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);height:90%;max-height:600px;}
.map-pin{
  position:absolute;cursor:pointer;transform:translate(-50%,-100%);
  transition:transform 0.2s;z-index:2;
}
.map-pin:hover{transform:translate(-50%,-100%) scale(1.3);}
.map-pin.active{transform:translate(-50%,-100%) scale(1.4);z-index:5;}
.map-pin svg path{transition:fill 0.2s;}
.map-pin.active svg path{fill:${C.accent};}

/* Pin popup */
.pin-popup{
  position:absolute;z-index:10;background:white;border-radius:12px;
  padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,0.15);
  width:240px;transform:translate(-50%,-100%);margin-top:-36px;
  animation:popIn 0.25s cubic-bezier(0.16,1,0.3,1);
}
@keyframes popIn{from{opacity:0;transform:translate(-50%,-90%) scale(0.9);}to{opacity:1;transform:translate(-50%,-100%) scale(1);}}
.pin-popup::after{
  content:'';position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);
  border:8px solid transparent;border-top-color:white;
}
.pin-popup h4{font-size:14px;font-weight:700;color:${C.primary};margin-bottom:4px;}
.pin-popup p{font-size:12px;color:${C.muted};margin-bottom:10px;line-height:1.4;}
.pin-popup .popup-btns{display:flex;gap:6px;}
.btn-dir{
  flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
  padding:8px;border-radius:6px;font-size:11px;font-weight:700;
  background:${C.primary};color:white;border:none;cursor:pointer;
  font-family:var(--sans);transition:background 0.2s;
}
.btn-dir:hover{background:#2a5280;}
.btn-wa-map{
  flex:1;display:flex;align-items:center;justify-content:center;gap:4px;
  padding:8px;border-radius:6px;font-size:11px;font-weight:700;
  background:${C.green};color:white;border:none;cursor:pointer;
  font-family:var(--sans);transition:background 0.2s;
}
.btn-wa-map:hover{background:#1ea952;}

/* ─── DETAIL PANEL ─── */
.detail-overlay{
  position:fixed;inset:0;z-index:200;
  background:rgba(15,32,53,0.45);backdrop-filter:blur(4px);
  animation:fadeIn 0.25s ease;
}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.detail-panel{
  position:fixed;top:0;right:0;bottom:0;z-index:210;width:460px;max-width:100%;
  background:${C.cream};overflow-y:auto;box-shadow:-8px 0 40px rgba(0,0,0,0.12);
  animation:slideIn 0.35s cubic-bezier(0.16,1,0.3,1);
}
@keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
.dp-header{
  position:sticky;top:0;z-index:5;background:rgba(248,246,240,0.95);
  backdrop-filter:blur(10px);padding:16px 24px;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid ${C.border};
}
.dp-close{background:none;border:none;cursor:pointer;color:${C.muted};padding:4px;transition:color 0.2s;}
.dp-close:hover{color:${C.primary};}
.dp-body{padding:24px;}
.dp-map{height:200px;border-radius:12px;overflow:hidden;margin-bottom:24px;background:${C.border};display:flex;align-items:center;justify-content:center;}
.dp-map-inner{width:100%;height:100%;background:linear-gradient(135deg,#e8edf2,#d4dbe4);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;}
.dp-name{font-family:var(--serif);font-size:24px;color:${C.primary};margin-bottom:4px;}
.dp-city{font-size:14px;color:${C.muted};margin-bottom:20px;}
.dp-section{margin-bottom:24px;}
.dp-section-title{font-size:12px;font-weight:700;color:${C.muted};letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;}
.dp-addr{font-size:15px;color:${C.text};line-height:1.5;margin-bottom:12px;display:flex;align-items:flex-start;gap:8px;}
.btn-gmaps{
  display:inline-flex;align-items:center;gap:6px;padding:10px 18px;
  border-radius:8px;font-size:13px;font-weight:700;
  background:${C.primary};color:white;border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
}
.btn-gmaps:hover{background:#2a5280;transform:translateY(-1px);}
.sched-table{width:100%;}
.sched-row{display:flex;padding:10px 0;border-bottom:1px solid ${C.border};align-items:center;}
.sched-row:last-child{border-bottom:none;}
.sched-day{flex:1;font-size:14px;font-weight:600;color:${C.primary};}
.sched-time{font-size:14px;color:${C.text};font-weight:500;}
.dp-pastor{font-size:15px;color:${C.text};display:flex;align-items:center;gap:8px;margin-bottom:16px;}
.dp-pastor .pastor-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${C.primary},#2a5280);display:flex;align-items:center;justify-content:center;color:white;font-family:var(--serif);font-size:16px;}
.btn-wa-lg{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
  padding:14px;border-radius:10px;font-size:15px;font-weight:700;
  background:${C.green};color:white;border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
  box-shadow:0 4px 16px rgba(37,211,102,0.25);
}
.btn-wa-lg:hover{background:#1ea952;transform:translateY(-1px);}
.btn-visit{
  display:flex;align-items:center;justify-content:center;gap:8px;width:100%;
  padding:14px;border-radius:10px;font-size:15px;font-weight:700;margin-top:10px;
  background:${C.accent};color:${C.primaryDark};border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
  box-shadow:0 4px 16px rgba(212,168,67,0.25);
}
.btn-visit:hover{background:${C.accentLight};transform:translateY(-1px);}
.first-visit{
  margin-top:20px;background:white;border-radius:12px;border:1px solid ${C.border};overflow:hidden;
}
.fv-toggle{
  width:100%;padding:16px 20px;background:none;border:none;
  display:flex;align-items:center;justify-content:space-between;
  font-family:var(--sans);font-size:14px;font-weight:600;color:${C.primary};
  cursor:pointer;
}
.fv-body{max-height:0;overflow:hidden;transition:max-height 0.4s ease;}
.fv-body.open{max-height:400px;}
.fv-inner{padding:0 20px 20px;font-size:14px;color:${C.muted};line-height:1.7;}

/* ─── MOBILE TAB ─── */
.mobile-tabs{
  display:none;padding:0 24px 12px;
  gap:0;background:${C.cream};
}
.mob-tab{
  flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
  padding:10px;border:1.5px solid ${C.border};font-size:13px;font-weight:600;
  color:${C.muted};background:white;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
}
.mob-tab:first-child{border-radius:8px 0 0 8px;}
.mob-tab:last-child{border-radius:0 8px 8px 0;border-left:none;}
.mob-tab.active{background:${C.primary};color:white;border-color:${C.primary};}

/* ─── BOTTOM CTA ─── */
.ig-bottom{padding:48px 24px;background:linear-gradient(135deg,${C.accentPale},#F0DDB8);text-align:center;position:relative;}
.ig-bottom h3{font-family:var(--serif);font-size:clamp(22px,3.5vw,30px);color:${C.primary};margin-bottom:8px;}
.ig-bottom .sub{font-size:15px;color:${C.muted};margin-bottom:24px;line-height:1.6;}
.ig-bottom-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-bottom-wa{
  display:inline-flex;align-items:center;gap:8px;padding:14px 28px;
  border-radius:10px;font-size:15px;font-weight:700;
  background:${C.green};color:white;border:none;cursor:pointer;
  font-family:var(--sans);transition:all 0.2s;
}
.btn-bottom-wa:hover{background:#1ea952;transform:translateY(-2px);}
.btn-bottom-live{
  display:inline-flex;align-items:center;gap:8px;padding:14px 28px;
  border-radius:10px;font-size:15px;font-weight:600;
  background:white;color:${C.primary};border:1.5px solid ${C.border};
  font-family:var(--sans);cursor:pointer;transition:all 0.2s;
}
.btn-bottom-live:hover{border-color:${C.accent};color:${C.accent};}

/* ─── FOOTER ─── */
.ig-footer{padding:20px 24px;background:${C.primaryDark};text-align:center;font-size:13px;color:rgba(255,255,255,0.35);}
.ig-footer a{color:${C.accent};text-decoration:none;}

/* ─── COUNT BADGE ─── */
.result-count{font-size:13px;color:${C.muted};padding:4px 0 12px;font-weight:500;}
.result-count strong{color:${C.primary};}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){
  .ig-main{flex-direction:column;height:auto;min-height:auto;}
  .ig-list{width:100%;max-height:none;padding:0 20px 20px;}
  .ig-map-container{display:none;width:100%;height:55vh;margin:0;border-radius:0;}
  .ig-map-container.mobile-show{display:block;}
  .ig-list.mobile-hide{display:none;}
  .mobile-tabs{display:flex;}
  .detail-panel{width:100%;}
  .geo-btn span{display:none;}
}
@media(max-width:500px){
  .ig-hero h1{font-size:24px;}
  .search-row{flex-direction:column;}
  .geo-btn{justify-content:center;}
  .geo-btn span{display:inline;}
}
`;

// ═══════════════════════════════════════════════
// CHILE MAP COMPONENT (positioned pins)
// ═══════════════════════════════════════════════
const ChileInteractiveMap = ({ churches, selected, onSelect, popup, onClosePopup }) => {
    // Map Chile lat range (-18 to -56) and lng range (-76 to -66) to percentage positions
    const latToY = (lat) => ((lat - (-18)) / (-56 - (-18))) * 94 + 3;
    const lngToX = (lng) => ((lng - (-76)) / (-66 - (-76))) * 80 + 10;

    return (
        <div className="sim-map">
            {/* Chile silhouette SVG */}
            <svg viewBox="0 0 200 700" className="map-chile" style={{ opacity: 0.12 }}>
                <path d="M110 10 Q120 20,112 50 Q108 80,110 110 Q112 140,108 180 Q104 210,100 250 Q96 290,100 330 Q104 370,100 410 Q96 440,100 470 Q104 500,100 530 Q96 555,100 580 Q104 600,98 630 Q94 650,96 680 L92 695 Q86 690,90 660 Q84 630,88 600 Q82 570,86 540 Q82 510,84 480 Q78 450,82 420 Q78 390,84 360 Q86 330,90 300 Q92 270,90 240 Q88 210,94 180 Q98 150,102 120 Q106 90,108 60 Q110 30,110 10Z"
                    fill={C.primary} />
            </svg>

            {/* Church pins */}
            {churches.map(ch => {
                const y = latToY(ch.lat);
                const x = lngToX(ch.lng);
                const isActive = selected === ch.id;
                return (
                    <div key={ch.id}>
                        <div
                            className={`map-pin ${isActive ? "active" : ""}`}
                            style={{ top: `${y}%`, left: `${x}%` }}
                            onClick={(e) => { e.stopPropagation(); onSelect(ch.id); }}
                        >
                            <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill={isActive ? C.accent : C.primary} />
                                <line x1="12" y1="6" x2="12" y2="16" stroke="white" strokeWidth="1.8" />
                                <line x1="8" y1="10" x2="16" y2="10" stroke="white" strokeWidth="1.8" />
                            </svg>
                        </div>
                        {/* Popup */}
                        {popup === ch.id && (
                            <div className="pin-popup" style={{ top: `${y}%`, left: `${x}%` }} onClick={e => e.stopPropagation()}>
                                <h4>{ch.name}</h4>
                                <p>{ch.address}, {ch.city}</p>
                                <div className="popup-btns">
                                    <button className="btn-dir" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${ch.lat},${ch.lng}`)}>
                                        <NavSVG /> Cómo llegar
                                    </button>
                                    <button className="btn-wa-map" onClick={() => window.open(`https://wa.me/${ch.phone.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, me gustaría visitar la iglesia")}`)}>
                                        <PhoneSVG /> WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="watermark">mmmchile.cl</div>
        </div>
    );
};

// ═══════════════════════════════════════════════
// DETAIL PANEL
// ═══════════════════════════════════════════════
const DetailPanel = ({ church, onClose }) => {
    const [fvOpen, setFvOpen] = useState(false);
    if (!church) return null;

    const waUrl = `https://wa.me/${church.phone.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, me gustaría visitar la iglesia")}`;
    const visitUrl = `https://wa.me/${church.phone.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, quiero visitar la iglesia este domingo. ¿Pueden orientarme?")}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`;

    return (
        <>
            <div className="detail-overlay" onClick={onClose} />
            <div className="detail-panel">
                <div className="dp-header">
                    <button className="dp-close" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: C.muted }}>
                        <BackSVG /> Volver
                    </button>
                    <button className="dp-close" onClick={onClose}><CloseSVG /></button>
                </div>
                <div className="dp-body">
                    {/* Map placeholder */}
                    <div className="dp-map">
                        <div className="dp-map-inner">
                            <PinSVG color={C.accent} size={32} />
                            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{church.city}</span>
                        </div>
                    </div>

                    <h2 className="dp-name">{church.name}</h2>
                    <p className="dp-city">{church.city}</p>

                    {/* Address */}
                    <div className="dp-section">
                        <div className="dp-section-title">Dirección</div>
                        <div className="dp-addr">
                            <PinSVG color={C.accent} size={18} />
                            <span>{church.address}, {church.city}</span>
                        </div>
                        <button className="btn-gmaps" onClick={() => window.open(mapsUrl)}>
                            <NavSVG /> Abrir en Google Maps
                        </button>
                    </div>

                    {/* Schedule */}
                    <div className="dp-section">
                        <div className="dp-section-title">Horarios de Culto</div>
                        <div className="sched-table">
                            {church.services.map((s, i) => (
                                <div key={i} className="sched-row">
                                    <div className="sched-day">{s.day}</div>
                                    <div className="sched-time">{s.time} hrs</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pastor */}
                    <div className="dp-section">
                        <div className="dp-section-title">Pastor</div>
                        <div className="dp-pastor">
                            <div className="pastor-avatar">{church.pastor.split(" ").pop()[0]}</div>
                            <span style={{ fontWeight: 600 }}>{church.pastor}</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="dp-section">
                        <button className="btn-wa-lg" onClick={() => window.open(waUrl)}>
                            <PhoneSVG /> Contactar por WhatsApp
                        </button>
                        <button className="btn-visit" onClick={() => window.open(visitUrl)}>
                            Quiero visitar este domingo
                        </button>
                    </div>

                    {/* First visit collapsible */}
                    <div className="first-visit">
                        <button className="fv-toggle" onClick={() => setFvOpen(!fvOpen)}>
                            ¿Qué esperar en tu primera visita?
                            <ChevSVG open={fvOpen} />
                        </button>
                        <div className={`fv-body ${fvOpen ? "open" : ""}`}>
                            <div className="fv-inner">
                                No necesitas traer nada especial ni vestirte de una manera particular. Llegarás a un lugar cálido donde serás recibido con una sonrisa. El culto dura aproximadamente una hora e incluye música, un mensaje inspirador y un momento de oración. Nadie te obligará a hacer nada que no quieras. Simplemente ven como eres — estamos felices de recibirte.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function IglesiasPage() {
    const [search, setSearch] = useState("");
    const [zone, setZone] = useState("todas");
    const [serviceFilter, setServiceFilter] = useState(null); // "dom" or "sem"
    const [selectedId, setSelectedId] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const [detailChurch, setDetailChurch] = useState(null);
    const [userLoc, setUserLoc] = useState(null);
    const [geoLoading, setGeoLoading] = useState(false);
    const [mobileView, setMobileView] = useState("lista");
    const listRef = useRef(null);
    const cardRefs = useRef({});

    // Geolocation
    const requestGeo = useCallback(() => {
        if (userLoc) { setUserLoc(null); return; }
        setGeoLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoLoading(false); },
                () => { setUserLoc({ lat: -33.445, lng: -70.660 }); setGeoLoading(false); } // Fallback Santiago
            );
        } else {
            setUserLoc({ lat: -33.445, lng: -70.660 }); setGeoLoading(false);
        }
    }, [userLoc]);

    // Filter and sort churches
    const filtered = useMemo(() => {
        let list = [...CHURCHES];

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.city.toLowerCase().includes(q) ||
                c.address.toLowerCase().includes(q)
            );
        }

        // Zone
        if (zone !== "todas") list = list.filter(c => c.zone === zone);

        // Service filter
        if (serviceFilter === "dom") list = list.filter(c => c.services.some(s => s.day === "Domingo"));
        if (serviceFilter === "sem") list = list.filter(c => c.services.some(s => s.day !== "Domingo"));

        // Distance
        if (userLoc) {
            list = list.map(c => ({ ...c, distance: haversine(userLoc.lat, userLoc.lng, c.lat, c.lng) }));
            list.sort((a, b) => a.distance - b.distance);
        }

        return list;
    }, [search, zone, serviceFilter, userLoc]);

    // Scroll to card when selecting on map
    useEffect(() => {
        if (selectedId && cardRefs.current[selectedId]) {
            cardRefs.current[selectedId].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [selectedId]);

    const handlePinClick = (id) => {
        setSelectedId(id);
        setPopupId(popupId === id ? null : id);
        if (window.innerWidth <= 900) setMobileView("lista");
    };

    const handleCardClick = (id) => {
        setSelectedId(id);
        setPopupId(id);
    };

    const activePill = (val) => {
        if (val === "dom" || val === "sem") return serviceFilter === val;
        return zone === val && !serviceFilter;
    };

    const setPill = (val) => {
        if (val === "dom" || val === "sem") {
            setServiceFilter(serviceFilter === val ? null : val);
            if (val === "dom" || val === "sem") setZone("todas");
        } else {
            setZone(val);
            setServiceFilter(null);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

                {/* ─── HEADER ─── */}
                <header className="ig-header">
                    <a className="ig-logo" href="/"><span className="mark">✦</span> MMM Chile</a>
                    <a className="ig-back" href="/"><BackSVG /> Inicio</a>
                </header>

                {/* ─── HERO SEARCH ─── */}
                <div className="ig-hero">
                    <h1>Encuentra Tu Iglesia</h1>
                    <p className="sub">Más de 30 congregaciones en todo Chile te esperan con los brazos abiertos</p>

                    <div className="search-row">
                        <div className="search-box">
                            <SearchSVG />
                            <input
                                type="text"
                                placeholder="Busca por ciudad, comuna o dirección"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            {search && (
                                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4 }}>
                                    <CloseSVG />
                                </button>
                            )}
                        </div>
                        <button className={`geo-btn ${userLoc ? "active" : ""}`} onClick={requestGeo}>
                            <LocateSVG />
                            <span>{geoLoading ? "Buscando..." : userLoc ? "Ubicación activa" : "Usar mi ubicación"}</span>
                        </button>
                    </div>

                    <div className="pills">
                        {[
                            { label: "Todas", val: "todas" },
                            { label: "Zona Norte", val: "norte" },
                            { label: "Zona Centro", val: "centro" },
                            { label: "Zona Sur", val: "sur" },
                            { label: "Culto Dominical", val: "dom" },
                            { label: "Culto entre Semana", val: "sem" },
                        ].map(p => (
                            <button
                                key={p.val}
                                className={`pill ${activePill(p.val) ? "active" : ""}`}
                                onClick={() => setPill(p.val)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── MOBILE TABS ─── */}
                <div className="mobile-tabs">
                    <button className={`mob-tab ${mobileView === "lista" ? "active" : ""}`} onClick={() => setMobileView("lista")}>
                        <ListSVG /> Lista
                    </button>
                    <button className={`mob-tab ${mobileView === "mapa" ? "active" : ""}`} onClick={() => setMobileView("mapa")}>
                        <MapSVG /> Mapa
                    </button>
                </div>

                {/* ─── MAIN SPLIT ─── */}
                <div className="ig-main">
                    {/* LIST */}
                    <div className={`ig-list ${mobileView === "mapa" ? "mobile-hide" : ""}`} ref={listRef}>
                        <div className="result-count">
                            <strong>{filtered.length}</strong> iglesia{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
                            {userLoc && " · ordenadas por cercanía"}
                        </div>

                        {filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="em-icon">🔍</div>
                                <h3>No encontramos resultados</h3>
                                <p>Intenta con otra ciudad o cambia los filtros. También puedes escribirnos por WhatsApp y te ayudamos a encontrar una iglesia cerca de ti.</p>
                            </div>
                        ) : (
                            filtered.map(ch => {
                                const next = getNextService(ch.services);
                                return (
                                    <div
                                        key={ch.id}
                                        ref={el => cardRefs.current[ch.id] = el}
                                        className={`ch-card ${selectedId === ch.id ? "selected" : ""}`}
                                        onClick={() => handleCardClick(ch.id)}
                                    >
                                        <div className="ch-name">{ch.name}</div>
                                        <div className="ch-city">{ch.city}</div>
                                        <div className="ch-addr"><PinSVG color={C.muted} size={13} /> {ch.address}</div>
                                        <div className="ch-service"><ClockSVG /> Próximo culto: {next.day} {next.time} hrs</div>
                                        {ch.distance != null && <div className="ch-dist">{formatDist(ch.distance)}</div>}
                                        <div className="ch-actions">
                                            <button className="btn-wa-sm" onClick={e => { e.stopPropagation(); window.open(`https://wa.me/${ch.phone.replace(/\+/g, "")}?text=${encodeURIComponent("Hola, me gustaría visitar la iglesia")}`); }}>
                                                <PhoneSVG /> WhatsApp
                                            </button>
                                            <button className="btn-detail" onClick={e => { e.stopPropagation(); setDetailChurch(ch); }}>
                                                Ver detalles <ArrowSVG />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* MAP */}
                    <div className={`ig-map-container ${mobileView === "mapa" ? "mobile-show" : ""}`} onClick={() => setPopupId(null)}>
                        <ChileInteractiveMap
                            churches={filtered}
                            selected={selectedId}
                            onSelect={handlePinClick}
                            popup={popupId}
                            onClosePopup={() => setPopupId(null)}
                        />
                    </div>
                </div>

                {/* ─── DETAIL PANEL ─── */}
                {detailChurch && <DetailPanel church={detailChurch} onClose={() => setDetailChurch(null)} />}

                {/* ─── BOTTOM CTA ─── */}
                <div className="ig-bottom">
                    <h3>¿No encuentras una iglesia cerca?</h3>
                    <p className="sub">Escríbenos y te ayudaremos a conectar con la congregación más cercana a ti</p>
                    <div className="ig-bottom-btns">
                        <button className="btn-bottom-wa" onClick={() => window.open("https://wa.me/56912345600?text=" + encodeURIComponent("Hola, busco una iglesia cerca de mi ubicación"))}>
                            <PhoneSVG /> Escríbenos por WhatsApp
                        </button>
                        <button className="btn-bottom-live" onClick={() => window.location.href = "/en-vivo"}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                            Conéctate al culto en vivo
                        </button>
                    </div>
                </div>

                {/* ─── FOOTER ─── */}
                <footer className="ig-footer">
                    © 2026 Movimiento Misionero Mundial Chile · <a href="/">mmmchile.cl</a>
                </footer>
            </div>
        </>
    );
}