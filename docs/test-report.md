# Reporte de Auditoría UI — MMM Chile
**Fecha:** 2026-03-07
**Herramienta:** Playwright MCP
**URL base:** http://localhost:3000
**Viewport desktop:** 1280x800 | **Viewport mobile:** 375x812

---

## Resumen

| Métrica | Valor |
|---|---|
| Páginas testeadas | 9 |
| Checks realizados | ~70 |
| Checks pasados | ~55 |
| Checks fallados | ~15 |
| Páginas con 404 | 4 |
| Formularios funcionales | 1/3 |

---

## Por Página

### 1. Homepage (/)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "¿Buscas algo más en la vida?" |
| Header con logo y links | ✅ | Logo, 6 links de nav |
| Footer con 4 columnas | ✅ | MMM Chile, Enlaces Rápidos, Recursos, Radio en Vivo |
| WhatsApp flotante | ✅ | `wa.me/56975587223` correcto |
| Sección HeroSection | ✅ | CTAs principales visibles |
| Sección IntentRouter | ✅ | 3 cards con links funcionales |
| Sección TestimoniesPreview | ✅ | 3 testimonios con links |
| Sección BlogPreview | ✅ | 3 artículos visibles |
| Sección ChurchFinderPreview | ✅ | Mini buscador + 3 iglesias de muestra |
| Sección LiveStreamBanner | ✅ | Con horarios y CTAs |
| Sección NewsletterCTA | ✅ | Form visible |
| CTA Hero → /conoce-a-jesus | ✅ | Navega correctamente |
| CTA → /iglesias | ✅ | Navega correctamente |
| Newsletter submit | ❌ | Error: "Ocurrió un error al intentar suscribirte" |
| Link /blog/superar-ansiedad | ❌ | 404 — slug incorrecto en homepage |
| Link /blog/despues-muerte | ❌ | 404 — slug incorrecto en homepage |
| "Radio" en header | ❌ | No existe en nav (brief menciona link de Radio) |

**Screenshots:** `homepage-desktop.png`, `homepage-mobile.png`, `homepage-newsletter-test.png`
**Bugs:**
- [HIGH] Newsletter devuelve error al enviar (Supabase no configurado / credenciales placeholder)
- [HIGH] 2 links de BlogPreview en homepage apuntan a slugs inexistentes (`/blog/superar-ansiedad`, `/blog/despues-muerte`)
- [LOW] Header no incluye link a Radio ni a "Nosotros"

---

### 2. Conoce a Jesús (/conoce-a-jesus)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "Hay Alguien que Te Conoce y Te Ama" |
| Capítulo 1 — Propósito | ✅ | "No eres un accidente" |
| Capítulo 2 — El Vacío | ✅ | "¿Por qué siento un vacío?" |
| Capítulo 3 — El Amor | ✅ | "El Amor Más Grande de la Historia" |
| Capítulo 4 — Vida Nueva | ✅ | "Una Nueva Vida Te Espera" |
| Cita Jeremías 1:5 | ✅ | Visible |
| Cita Romanos 3:23 | ✅ | Visible |
| Cita Juan 3:16 | ✅ | Visible |
| Cita 2 Corintios 5:17 | ✅ | Visible |
| Sección oración de fe | ✅ | Con botón "Escuchar esta oración" |
| Formulario de decisión (nombre) | ✅ | Campo visible |
| Formulario de decisión (ciudad) | ✅ | Campo visible |
| Formulario de decisión (contacto) | ✅ | Campo visible |
| Formulario de decisión (toggle contacto) | ✅ | Switch visible y funcional |
| Form submit | ❌ | Error: "Ocurrió un error al guardar tu decisión" |
| Botón compartir WhatsApp | ✅ | Enlace con `api.whatsapp.com` y URL de página |
| Botón compartir Facebook | ✅ | Enlace a sharer de Facebook |
| Link → /iglesias | ✅ | "Buscar iglesia" al final |
| FAQ accordions | ✅ | 3 preguntas expandibles |

**Screenshots:** `conoce-a-jesus-desktop.png`, `conoce-a-jesus-mobile.png`, `conoce-a-jesus-form-success.png`
**Bugs:**
- [HIGH] Formulario de decisión falla al enviar (Supabase no configurado)
- [MEDIUM] Secciones 2 y 3 muestran texto muy oscuro sobre fondo oscuro en mobile (posible problema de contraste/legibilidad)

---

### 3. Oración (/oracion)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "No Estás Solo. Estamos Orando por Ti." |
| Form nombre (opcional) | ✅ | Campo visible |
| Form petición (textarea) | ✅ | Campo obligatorio visible |
| Form contacto (opcional) | ✅ | Campo visible |
| Checkbox "publicar en muro" | ✅ | Checkbox funcional |
| Form submit | ✅ | Éxito: "Tu petición fue recibida / Estamos orando por ti" |
| Muro de oración | ✅ | Sección existe, tabs "Más recientes"/"Más oradas" |
| Muro vacío (sin peticiones) | ✅ | Mensaje "Aún no hay peticiones" mostrado correctamente |
| Versículo 1 Pedro 5:7 | ✅ | Visible en sidebar |
| CTA → /conoce-a-jesus | ✅ | "¿Quieres conocer al Dios que escucha?" |
| CTA → /iglesias | ✅ | "¿Buscas una comunidad que ore contigo?" |
| Título de página | ❌ | "Petición de Oración \| MMM Chile \| MMM Chile" (duplicado) |

**Screenshots:** `oracion-desktop.png`, `oracion-mobile.png`, `oracion-form-success.png`
**Bugs:**
- [MEDIUM] Título de página duplica "MMM Chile" → afecta SEO

---

### 4. Blog (/blog y /blog/[slug])

| Check | Estado | Notas |
|---|---|---|
| H1 visible (/blog) | ✅ | "Reflexiones para Tu Vida" |
| Artículos listados | ✅ | 7+ artículos visibles |
| Filtros de categoría | ✅ | Todos, Preguntas de Vida, Primeros Pasos, Vida Cristiana, Testimonios |
| Sidebar "Más Leídos" | ✅ | 5 artículos |
| Sidebar newsletter | ✅ | Form visible |
| Sidebar CTAs (/oracion, /conoce-a-jesus) | ✅ | Presentes |
| H1 en detalle | ✅ | "¿Existe Dios? Lo que la Ciencia..." |
| Contenido del artículo | ✅ | Texto del body visible |
| Meta info (autor, fecha, lectura) | ✅ | "Pastor Roberto Méndez, 28 feb 2026, 8 min" |
| CTA final → /conoce-a-jesus | ✅ | "¿Quieres saber más sobre Jesús?" |
| Botón compartir WhatsApp | ✅ | Presente |
| Botón compartir Facebook | ✅ | Presente |
| Artículos relacionados | ✅ | 3 artículos al final |
| Contenido completo del artículo | ❌ | Texto truncado ("...potencia 60...") — artículo incompleto en datos |
| Título de página (detalle) | ❌ | "Existe Dios? \| MMM Chile \| MMM Chile" (duplicado) |

**Screenshots:** `blog-listing.png`, `blog-detail.png`
**Bugs:**
- [MEDIUM] Contenido del artículo `/blog/existe-dios` está truncado
- [MEDIUM] Título de página duplica "MMM Chile" → afecta SEO

---

### 5. Iglesias (/iglesias)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "Encuentra Tu Iglesia" |
| Input de búsqueda | ✅ | "Busca por ciudad, comuna o dirección" |
| Filtros de zona | ✅ | Todas, Zona Norte, Zona Centro, Zona Centro-Sur, Zona Sur |
| Cantidad de iglesias | ✅ | "32 iglesias encontradas" |
| Mapa Leaflet | ✅ | Renderiza con pins en todo Chile |
| Botón "Usar mi ubicación" | ✅ | Presente |
| WhatsApp en cada iglesia | ✅ | Links `wa.me` con mensaje pre-escrito |
| Modal "Ver detalles" | ✅ | Dirección, horarios, pastor, Google Maps, WhatsApp |
| CTA → /en-vivo | ✅ | "Conéctate al culto en vivo" |
| CTA WhatsApp general | ✅ | `wa.me/56912345600` |
| Datos de iglesias | ⚠️ | Todos los teléfonos son placeholders (5691234560X) |

**Screenshots:** `iglesias-desktop.png`, `iglesias-mobile.png`
**Bugs:**
- [LOW] Números de WhatsApp de todas las iglesias son datos de prueba (56912345601–632)

---

### 6. Testimonios (/testimonios y /testimonios/[slug])

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "Testimonios de Esperanza" |
| Testimonios listados | ✅ | 6 testimonios |
| Filtros de categoría | ✅ | Sanidad, Restauración Familiar, Provisión, Liberación, Salvación, Otro |
| Navegación a detalle | ✅ | /testimonios/carlos-m carga |
| H1 en detalle | ✅ | "De la Depresión a la Esperanza" |
| Historia completa | ✅ | Contenido visible |
| Versículo bíblico | ✅ | Salmos 147:3 |
| CTA → /conoce-a-jesus (detalle) | ✅ | "Descubre Cómo Conocer a Jesús" |
| CTA → /conoce-a-jesus (listing) | ❌ | No existe en la página de listado |
| Título de página | ❌ | "Testimonios Cristianos \| Vidas Transformadas \| MMM Chile \| MMM Chile" (duplicado) |

**Screenshots:** `testimonios-listing.png` (pendiente), `testimonios-detail.png` (pendiente)
**Bugs:**
- [MEDIUM] Página listing de testimonios no tiene CTA directo a /conoce-a-jesus (falla del embudo)
- [MEDIUM] Título de página duplica "MMM Chile"

---

### 7. Doctrina (/doctrina)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "Nuestra Fe" |
| Índice lateral | ✅ | 11 puntos con anchor links |
| Punto 1 — La Biblia | ✅ | Con contenido y versículo |
| Punto 2 — La Salvación | ✅ | Con contenido y versículo |
| Punto 3 — El Bautismo en Agua | ✅ | Con contenido y versículo |
| Punto 4 — El Bautismo del Espíritu Santo | ✅ | Con contenido y versículo |
| Punto 5 — La Sanidad Divina | ✅ | Con contenido y versículo |
| Punto 6 — Los Dones del Espíritu | ✅ | Con contenido y versículo |
| Punto 7 — La Santidad | ✅ | Con contenido y versículo |
| Punto 8 — El Deber Cristiano | ✅ | Con contenido y versículo |
| Punto 9 — Los Diezmos y Ofrendas | ✅ | Con contenido y versículo |
| Punto 10 — La Resurrección | ✅ | Con contenido y versículo |
| Punto 11 — La Segunda Venida | ✅ | Con contenido y versículo |
| Accordions expandibles | ✅ | Todos muestran contenido expandido por defecto |
| CTA → /conoce-a-jesus | ✅ | "Conoce a Jesús" al final |
| CTA → /plan-de-lectura | ❌ | Link existe pero página es 404 |
| CTA → /iglesias | ✅ | "Visita una Iglesia" |
| Título de página | ❌ | "Doctrina Cristiana \| MMM Chile \| MMM Chile" (duplicado) |

**Screenshots:** `doctrina-desktop.png` (pendiente), `doctrina-mobile.png` (pendiente)
**Bugs:**
- [MEDIUM] CTA "Lee la Biblia" apunta a /plan-de-lectura que es 404
- [MEDIUM] Título duplicado

---

### 8. En Vivo (/en-vivo)

| Check | Estado | Notas |
|---|---|---|
| H1 visible | ✅ | "Cultos en Directo" |
| Horarios de cultos | ✅ | Domingo 11:00, 17:00 / Jueves 19:30 |
| Player / placeholder | ✅ | "Transmisión no disponible en este momento" |
| Sección Radio | ✅ | Radio Bethel con botón play |
| Últimas grabaciones | ✅ | 3 cards visibles |
| Link canal YouTube | ✅ | youtube.com/@mmmchile-oficial |
| CTA → /iglesias | ✅ | "Encontrar una Iglesia Cerca de Mí" |
| CTA → /conoce-a-jesus | ❌ | No hay CTA evangelístico en esta página |
| Título de página | ❌ | "En Vivo \| MMM Chile \| MMM Chile" (duplicado) |

**Screenshot:** `en-vivo.png`
**Bugs:**
- [LOW] Sin CTA a /conoce-a-jesus (oportunidad evangelística perdida)
- [MEDIUM] Título duplicado

---

### 9. Responsive Mobile (375x812)

| Página | Sin overflow horizontal | Textos legibles | Botones tocables | Menú mobile |
|---|---|---|---|---|
| / | ✅ | ✅ | ✅ | ✅ hamburger con 6 links |
| /conoce-a-jesus | ✅ | ⚠️ | ✅ | ✅ |
| /oracion | ✅ | ✅ | ✅ | ✅ |
| /blog | ✅ | ✅ | ✅ | ✅ |
| /iglesias | ✅ | ✅ | ✅ | ✅ |
| /doctrina | ✅ | ✅ | ✅ | ✅ |

**Screenshots:** `homepage-mobile.png`, `homepage-mobile-menu.png`, `conoce-a-jesus-mobile.png`
**Bugs:**
- [MEDIUM] /conoce-a-jesus mobile: secciones 2 y 3 tienen fondo muy oscuro con texto potencialmente ilegible

---

## Links Rotos (404)

| URL | Severidad | Referenciado desde |
|---|---|---|
| `/contacto` | CRITICAL | Header "Contáctanos", Footer "Escríbenos", múltiples CTAs — **redirige a /iglesias** |
| `/plan-de-lectura` | HIGH | Footer, /doctrina CTA, múltiples páginas |
| `/privacidad` | MEDIUM | Footer de todas las páginas |
| `/terminos` | MEDIUM | Footer de todas las páginas |
| `/blog/superar-ansiedad` | HIGH | Homepage BlogPreview |
| `/blog/despues-muerte` | HIGH | Homepage BlogPreview |

---

## Formularios

| Formulario | Estado | Detalle |
|---|---|---|
| Newsletter (homepage) | ❌ FALLA | Error: "Ocurrió un error al intentar suscribirte" — Supabase no configurado |
| Decisión de fe (/conoce-a-jesus) | ❌ FALLA | Error: "Ocurrió un error al guardar tu decisión" — Supabase no configurado |
| Petición de oración (/oracion) | ✅ FUNCIONA | Muestra éxito "Tu petición fue recibida" |

> **Nota:** Los 2 formularios que fallan apuntan a tablas de Supabase. Las variables de entorno están como placeholders (`NEXT_PUBLIC_SUPABASE_URL`, etc.). Una vez configuradas las credenciales reales, deberían funcionar.

---

## Problemas de Embudo

### Páginas sin CTA al siguiente paso del embudo

| Página | CTA faltante | Impacto |
|---|---|---|
| `/testimonios` (listing) | Link a /conoce-a-jesus | Visita testimonios pero no se invita a decidir |
| `/en-vivo` | Link a /conoce-a-jesus | Ve el culto pero no se guía a decisión de fe |
| `/blog/[slug]` | ✅ Tiene CTA a /conoce-a-jesus | OK |
| `/doctrina` | ✅ Tiene CTAs | OK |
| `/iglesias` | Sin CTA a /conoce-a-jesus | Usuario encuentra iglesia pero no se guía a decisión previa |

### Callejones sin salida

- `/contacto` redirige a `/iglesias` — usuario que quiere contactar queda confundido en la página de iglesias
- `/plan-de-lectura` es 404 — link aparece en footer de TODAS las páginas y en /doctrina

---

## Bugs Globales (afectan todas las páginas)

| Bug | Severidad | Descripción |
|---|---|---|
| Título duplicado "MMM Chile" | MEDIUM | Páginas: /oracion, /blog/[slug], /testimonios, /doctrina, /en-vivo muestran "X \| MMM Chile \| MMM Chile" en el `<title>`. Afecta SEO y CTR en buscadores. |
| Warning logo.png quality | LOW | Next/Image advierte que `/logo.png` usa `quality` inadecuado o le falta optimización |
| Números WhatsApp placeholder | HIGH | Todos los teléfonos de iglesias son 5691234560X — datos de prueba, no reales |

---

## Resumen de Severidades

| Severidad | Cantidad | Issues |
|---|---|---|
| CRITICAL | 1 | /contacto redirige a /iglesias |
| HIGH | 5 | Newsletter falla, Form decisión falla, /plan-de-lectura 404, 2 slugs blog incorrectos en homepage, números WhatsApp placeholder |
| MEDIUM | 8 | Título duplicado (múltiples páginas), contenido artículo truncado, /privacidad 404, /terminos 404, contraste mobile /conoce-a-jesus, testimonios sin CTA |
| LOW | 3 | /en-vivo sin CTA evangelístico, warning logo, Radio no en nav |

---

*Generado con Playwright MCP — MMM Chile Audit 2026-03-07*
