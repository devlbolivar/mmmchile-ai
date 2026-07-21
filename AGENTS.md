# MMM Chile — Plataforma Evangelística Digital

## Contexto del Proyecto
Sitio web del Movimiento Misionero Mundial en Chile (mmmchile.cl).
Plataforma de evangelización digital con enfoque de embudo de conversión,
construida con Next.js 16 (App Router) y desplegada en Vercel.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| CMS | Sanity.io (blog, contenido editorial) |
| Base de datos | Supabase (PostgreSQL — peticiones de oración, decisiones de fe) |
| Email | Resend + React Email |
| Mapas | Leaflet / react-leaflet |
| Anti-spam | Cloudflare Turnstile |
| OG Images | @vercel/og |
| Íconos | lucide-react |
| Validación | Zod |
| Analytics | @next/third-parties (GA4) |
| Deploy | Vercel (rama main) |

## Páginas implementadas

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage — embudo evangelístico |
| `/conoce-a-jesus` | Presentación del evangelio (scroll storytelling) |
| `/blog` | Motor SEO, artículos evangelísticos (Sanity) |
| `/blog/[slug]` | Artículo individual |
| `/iglesias` | Mapa interactivo + fichas por iglesia |
| `/oracion` | Peticiones de oración + muro público (Supabase) |
| `/testimonios` | Historias de vida transformada |
| `/en-vivo` | Transmisión en vivo de cultos |
| `/radio` | Radio online |
| `/conectate` | Página de conexión / membresía |
| `/contacto` | Formulario de contacto |
| `/doctrina` | Declaración de fe |
| `/privacidad` | Política de privacidad |
| `/terminos` | Términos y condiciones |
| `/studio` | Sanity Studio embebido (admin CMS) |

## Principio del Embudo

Todo CTA guía hacia una de 3 conversiones:
1. Conocer a Jesús (`/conoce-a-jesus`)
2. Encontrar una iglesia (`/iglesias`)
3. Dejar contacto (oración, plan de lectura, newsletter)

## Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#1E3A5F` | Azul royal — color principal |
| Accent | `#D4A843` | Oro cálido — CTAs, highlights |
| Background | `#F8F6F0` | Crema suave — fondo general |
| Dark | `#0F2035` | Navy — footer |
| Text | `#2D2D2D` | Gris oscuro — texto principal |
| Light text | `#6B7280` | Gris — texto secundario |
| WhatsApp | `#25D366` | Botón WhatsApp |

## Convenciones de Código

- **Server Components** por defecto; `'use client'` solo cuando hay interactividad real
- **Server Actions** para formularios (`app/[ruta]/actions/`)
- Componentes en `PascalCase`, archivos en `kebab-case`
- Tailwind para todos los estilos — sin CSS Modules
- `next/image` para todas las imágenes con `alt` descriptivo
- `generateMetadata()` en cada `page.tsx` para SEO dinámico
- Schema markup JSON-LD para iglesias y artículos del blog
- Idioma: español (Chile), locale `es-CL`

## Estructura del proyecto

```
src/
├── app/                  # App Router — rutas y pages
│   ├── api/              # API routes (og images)
│   ├── blog/             # Blog (Sanity)
│   ├── conoce-a-jesus/
│   ├── conectate/
│   ├── contacto/
│   ├── doctrina/
│   ├── en-vivo/
│   ├── iglesias/
│   ├── oracion/
│   ├── privacidad/
│   ├── radio/
│   ├── studio/           # Sanity Studio embebido
│   ├── terminos/
│   └── testimonios/
├── components/           # Componentes reutilizables
│   ├── blog/
│   ├── church/
│   ├── contact/
│   ├── doctrine/
│   ├── gospel/
│   ├── home/
│   ├── layout/
│   ├── live/
│   ├── prayer/
│   ├── radio/
│   ├── shared/
│   └── testimony/
├── lib/                  # Clientes y utilidades
│   ├── analytics.ts
│   ├── data/
│   ├── mock-data/
│   ├── rate-limit.ts
│   ├── resend.ts
│   ├── sanity/
│   ├── supabase.ts
│   ├── turnstile.ts
│   ├── types/
│   └── utils/
└── sanity/
    └── schemaTypes/      # Schemas de Sanity
docs/
└── designs/              # Artifacts de diseño de referencia (.jsx + screenshots)
supabase/
└── migrations/           # Migraciones SQL
```

## Migraciones de base de datos (Supabase)

| Archivo | Descripción |
|---------|-------------|
| `20260306000000_create_prayer_requests.sql` | Tabla principal de peticiones de oración |
| `20260310195247_create_rate_limits.sql` | Rate limiting para formularios |
| `20260423000000_add_approved_to_prayer_requests.sql` | Campo de moderación |
| `20260423000002_add_pray_count.sql` | Contador de oraciones por petición |

## Diseños de referencia

Los diseños están en `docs/designs/` como artifacts React (`.jsx`) y screenshots.
Son la referencia visual y funcional para cada página — adaptar a la arquitectura
del proyecto, separando componentes y usando Server Components donde sea posible.

## MCP Servers Disponibles

- **Supabase**: crear tablas, queries, RLS policies
- **Sanity**: crear schemas, ejecutar GROQ, gestionar contenido
- **Playwright**: testing de UI automatizado
