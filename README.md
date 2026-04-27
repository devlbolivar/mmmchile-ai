# MMM Chile — Plataforma Evangelística Digital

Sitio web del **Movimiento Misionero Mundial en Chile** ([mmmchile.cl](https://mmmchile.cl)), construido como una plataforma de evangelización digital con enfoque de embudo de conversión.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS v4 |
| CMS | Sanity.io (blog, contenido editorial) |
| Base de datos | Supabase (PostgreSQL — contactos, oración, decisiones de fe) |
| Email | Resend + React Email |
| Mapas | Leaflet / react-leaflet |
| Anti-spam | Cloudflare Turnstile |
| OG Images | @vercel/og |
| Deploy | Vercel |
| Lenguaje | TypeScript |

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage — embudo evangelístico |
| `/conoce-a-jesus` | Presentación del evangelio (scroll storytelling) |
| `/blog` | Motor SEO, artículos evangelísticos (Sanity) |
| `/blog/[slug]` | Artículo individual |
| `/iglesias` | Mapa interactivo + fichas por iglesia |
| `/oracion` | Peticiones de oración + muro público |
| `/testimonios` | Historias de vida transformada |
| `/en-vivo` | Transmisión en vivo de cultos |
| `/radio` | Radio online |
| `/contacto` | Formulario de contacto |
| `/doctrina` | Declaración de fe |
| `/studio` | Sanity Studio (admin CMS) |

## Principio del Embudo

Todo CTA guía hacia una de 3 conversiones:

1. **Conocer a Jesús** → `/conoce-a-jesus`
2. **Encontrar una iglesia** → `/iglesias`
3. **Dejar contacto** → oración, plan de lectura, newsletter

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

## Desarrollo local

### Requisitos previos

- Node.js 20+
- Variables de entorno configuradas (ver `.env.local.example`)

### Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno necesarias

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend
RESEND_API_KEY=

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

## Convenciones de código

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
│   ├── api/              # API routes
│   ├── blog/             # Blog (Sanity)
│   ├── conoce-a-jesus/
│   ├── iglesias/
│   ├── oracion/
│   ├── testimonios/
│   ├── en-vivo/
│   ├── radio/
│   ├── studio/           # Sanity Studio embebido
│   └── ...
├── components/           # Componentes reutilizables
├── lib/                  # Clientes (Sanity, Supabase, Resend)
└── types/                # Tipos TypeScript
docs/
└── designs/              # Artifacts de diseño de referencia (.jsx + screenshots)
supabase/
└── migrations/           # Migraciones SQL
```

## Diseños de referencia

Los diseños están en `docs/designs/` como artifacts React (`.jsx`) y screenshots. Son la referencia visual y funcional para cada página — adaptar a la arquitectura del proyecto, separando componentes y usando Server Components donde sea posible.

## Despliegue

El proyecto se despliega automáticamente en **Vercel** desde la rama `main`.
