import type { Metadata } from 'next';
import Link from 'next/link';
import ConventionMedia from '@/components/events/convention-media';
import { featuredEvent as event } from '@/lib/data/featured-event';

const url = `https://mmmchile.cl${event.path}`;
const description = `${event.dateLabel}. ${event.venue}, ${event.address}. Entrada libre. Mira la invitación y escucha nuestro jingle.`;

export function generateMetadata(): Metadata {
  return {
    title: event.title,
    description,
    alternates: { canonical: url },
    openGraph: { title: event.title, description, url, type: 'website', images: [{ url: event.image, width: 1920, height: 1080, alt: event.imageAlt }] },
    twitter: { card: 'summary_large_image', title: event.title, description, images: [event.image] },
  };
}

export default function ConventionPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.address}, Santiago, Chile`)}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${event.title} — ${event.dateLabel}. Entrada libre. ${url}`)}`;
  return (
    <main className="bg-[#F8F6F0] pb-20 pt-28 text-[#1E3A5F]">
      <header className="bg-[#E8F3EC] px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-sm underline underline-offset-4">← Volver al inicio</Link>
          <p className="mb-3 mt-8 text-sm font-bold uppercase tracking-widest">{event.subtitle}</p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">{event.title}</h1>
          <p className="mt-6 text-xl font-semibold">{event.dateLabel}</p>
          <p className="mt-3 text-lg">Te invitamos a compartir este encuentro. ¡Ven con tu familia!</p>
          <span className="mt-6 inline-block rounded-full bg-white px-5 py-2 font-bold">Entrada libre</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl space-y-12 px-6 pt-12">
        <section aria-labelledby="location-title" className="rounded-2xl border border-[#1E3A5F]/15 bg-white p-6 sm:p-8">
          <h2 id="location-title" className="font-serif text-3xl">Nos encontramos en San Joaquín</h2>
          <p className="mt-4 text-lg font-semibold">{event.venue}</p>
          <p className="mt-1">{event.address}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full bg-[#1E3A5F] px-6 py-3 font-semibold text-white hover:bg-[#0F2035]">Cómo llegar ↗</a>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-[#1E3A5F] px-6 py-3 font-semibold hover:bg-[#E8F3EC]">Compartir por WhatsApp</a>
          </div>
        </section>
        <ConventionMedia />
      </div>
    </main>
  );
}
