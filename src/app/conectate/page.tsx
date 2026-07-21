import type { Metadata } from 'next'
import React from 'react'
import Image from 'next/image'
import './conectate.css'

export const metadata: Metadata = {
  title: 'Conéctate | MMM Chile',
  description:
    'Movimiento Misionero Mundial Chile. Conéctate con nuestros canales: sitio web, radio, Facebook, Instagram y YouTube.',
  openGraph: {
    title: 'MMM Chile · Conéctate con nosotros',
    description: 'Todos nuestros canales y plataformas en un solo lugar.',
    url: 'https://mmmchile.cl/conectate',
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────

type IconKey = 'globe' | 'radio' | 'facebook' | 'instagram' | 'youtube'

interface LinkItem {
  title: string
  handle: string
  url: string
  icon: IconKey
  featured?: boolean
  live?: boolean
}

interface Section {
  label: string
  num: string
  links: LinkItem[]
}

const DATA: Section[] = [
  {
    label: 'Principal',
    num: '01',
    links: [
      {
        title: 'Sitio Web Oficial',
        handle: 'mmmchile.cl',
        url: 'https://mmmchile.cl',
        icon: 'globe',
        featured: true,
      },
      {
        title: 'Radio Bethel Chile',
        handle: 'Escucha en vivo',
        url: 'https://mmmchile.cl/radio',
        icon: 'radio',
        featured: true,
        live: true,
      },
    ],
  },
  {
    label: 'Facebook',
    num: '02',
    links: [
      {
        title: 'MMM Chile',
        handle: 'Página oficial',
        url: 'https://www.facebook.com/MMMCHILEORG/',
        icon: 'facebook',
      },
      {
        title: 'Koinonia MMM Chile',
        handle: '@koinoniammmchile',
        url: 'https://www.facebook.com/KoinoniaCo/',
        icon: 'facebook',
      },
      {
        title: 'Radio Bethel Chile',
        handle: '@radiobethelchile',
        url: 'https://www.facebook.com/people/Radio-Bethel-Chile/61559256342757',
        icon: 'facebook',
      },
    ],
  },
  {
    label: 'Instagram',
    num: '03',
    links: [
      {
        title: 'MMM Chile',
        handle: '@chile_mmm',
        url: 'https://www.instagram.com/chile_mmm/',
        icon: 'instagram',
      },
      {
        title: 'Koinonia MMM Chile',
        handle: '@koinoniammmchile',
        url: 'https://www.instagram.com/koinoniachile/',
        icon: 'instagram',
      },
      {
        title: 'Radio Bethel Chile',
        handle: '@radiobethelchile',
        url: 'https://www.instagram.com/radiobethelchile/',
        icon: 'instagram',
      },
    ],
  },
  {
    label: 'YouTube',
    num: '04',
    links: [
      {
        title: 'Koinonia MMM Chile',
        handle: 'Canal oficial',
        url: 'https://www.youtube.com/@KoinoniaMMMChileOficial',
        icon: 'youtube',
      },
    ],
  },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z" />
    </svg>
  )
}

function IconRadio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 18.5C2 15 2 9 5.5 5.5" />
      <path d="M8.3 15.7c-2-2-2-5.4 0-7.4" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path d="M15.7 8.3c2 2 2 5.4 0 7.4" />
      <path d="M18.5 5.5C22 9 22 15 18.5 18.5" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.9h-2.34v6.98C18.34 21.13 22 16.99 22 12z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3 3 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 0 0 2.12 2.14c1.87.51 9.38.51 9.38.51s7.5 0 9.38-.51a3 3 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  )
}

const ICON_MAP: Record<IconKey, () => React.ReactElement> = {
  globe: IconGlobe,
  radio: IconRadio,
  facebook: IconFacebook,
  instagram: IconInstagram,
  youtube: IconYoutube,
}

// ── Components ────────────────────────────────────────────────────────────────

function LinkCard({ link }: { link: LinkItem }) {
  const Icon = ICON_MAP[link.icon]
  return (
    <a
      className={`ct-card${link.featured ? ' ct-featured' : ''}`}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${link.title} — ${link.handle}`}
    >
      <span className="ct-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="ct-link-text">
        <span className="ct-link-title">
          {link.title}
          {link.live && (
            <span className="ct-live" aria-label="En vivo">
              en vivo
            </span>
          )}
        </span>
        <span className="ct-link-handle">{link.handle}</span>
      </span>
      <span className="ct-arrow" aria-hidden="true">
        <IconArrow />
      </span>
    </a>
  )
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="ct-section" aria-labelledby={`sec-${section.num}`}>
      <div className="ct-section-label">
        <span className="ct-label-num">{section.num}</span>
        <span id={`sec-${section.num}`}>{section.label}</span>
      </div>
      {section.links.map((link) => (
        <LinkCard key={link.url} link={link} />
      ))}
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConectarePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,30..100;1,9..144,300..600,30..100&family=Manrope:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="ct-root">
        <main className="ct-container">
          {/* Hero */}
          <header className="ct-hero">
            <Image
              src="/logo.png"
              alt="MMM Chile"
              width={72}
              height={72}
              className="ct-logo"
              priority
            />
            <h1>
              Movimiento
              <br />
              Misionero <em>Mundial</em>
            </h1>
            <span className="ct-place">Chile</span>

            <div className="ct-ornament" aria-hidden="true">
              <span />
            </div>

            <p className="ct-welcome">
              Bienvenido. Aquí encontrarás todos
              <br />
              nuestros canales y plataformas.
            </p>
          </header>

          {/* Link sections */}
          {DATA.map((section) => (
            <SectionBlock key={section.num} section={section} />
          ))}

          {/* Footer */}
          <footer className="ct-footer">
            <p className="ct-verse">
              Id por todo el mundo y predicad el evangelio a toda criatura.
            </p>
            <span className="ct-reference">Marcos 16:15 · RVR60</span>
            <p className="ct-meta">
              © MMM Chile ·{' '}
              <a href="https://mmmchile.cl" rel="noopener noreferrer">
                mmmchile.cl
              </a>
            </p>
          </footer>
        </main>
      </div>
    </>
  )
}
