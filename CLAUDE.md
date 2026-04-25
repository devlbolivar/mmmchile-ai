# MMM Chile — Plataforma Evangelística Digital.

## Contexto del Proyecto
Sitio web del Movimiento Misionero Mundial en Chile (mmmchile.cl).
Estamos transformando la página institucional actual en una plataforma
de evangelización digital con enfoque de embudo de conversión.

## Stack Actual
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Deploy: [completar: Vercel/otro]
- [Agregar el resto del stack actual]

## Stack Objetivo (nuevas integraciones)
- CMS: Sanity.io (headless, para blog y contenido editorial)
- Database: Supabase (PostgreSQL — contactos, oración, decisiones de fe)
- Email: Resend + React Email
- Maps: Leaflet/react-leaflet (gratuito) o Google Maps API
- Analytics: Google Analytics 4 + Search Console

## Diseños de Referencia
Los diseños están en docs/designs/ como artifacts React (.jsx) + screenshots.
Estos son la referencia visual y funcional para cada página.
IMPORTANTE: No copiar directamente — adaptar a la arquitectura del proyecto,
separando componentes, usando Server Components donde sea posible,
y conectando con datos reales (Sanity/Supabase).

## Paleta de Colores
- Primary: #1E3A5F (royal blue)
- Accent: #D4A843 (warm gold)
- Background: #F8F6F0 (soft cream)
- Dark: #0F2035 (navy, footer)
- Text: #2D2D2D (dark gray)
- Light text: #6B7280
- WhatsApp: #25D366

## Estructura de Páginas Nuevas
- /conoce-a-jesus — Presentación del evangelio (scroll storytelling)
- /blog — Motor SEO, artículos evangelísticos
- /blog/[slug] — Artículo individual
- /oracion — Peticiones de oración + muro público
- /plan-de-lectura — Planes bíblicos con registro por email
- /testimonios — Historias de vida transformada
- /en-vivo — Transmisión en vivo de cultos
- /iglesias (mejorar) — Mapa interactivo + geolocalización

## Páginas a Mejorar
- / (homepage) — Rediseñar como embudo evangelístico
- /iglesias — Agregar mapa interactivo, fichas por iglesia, geolocalización
- /doctrina — Mantener, mejorar SEO

## Convenciones de Código
- Server Components por defecto; 'use client' solo cuando hay interactividad
- Server Actions para formularios (app/[ruta]/actions/)
- Componentes en PascalCase, archivos en kebab-case
- Tailwind para estilos, sin CSS modules
- Next/Image para todas las imágenes con alt text descriptivo
- Metadata dinámica con generateMetadata() en cada page.tsx
- Schema markup JSON-LD para iglesias y artículos del blog
- Idioma: español (Chile), locale: es-CL

## Principio del Embudo
Todo CTA guía hacia una de 3 conversiones:
1. Conocer a Jesús (/conoce-a-jesus)
2. Encontrar una iglesia (/iglesias)
3. Dejar contacto (oración, plan de lectura, newsletter)

## MCP Servers Disponibles
- Supabase: crear tablas, queries, RLS policies
- Sanity: crear schemas, ejecutar GROQ, gestionar contenido
- Playwright: testing de UI automatizado