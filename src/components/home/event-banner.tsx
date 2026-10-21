'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { featuredEvent } from '@/lib/data/featured-event';

const expiresAt = Date.parse(featuredEvent.expiresAt);
const isActive = () => Date.now() < expiresAt;
// Check in the browser so a cached page cannot keep showing an expired event.
const serverSnapshot = () => false;

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    clearTimeout(timer);
    onChange();
    const remaining = expiresAt - Date.now();
    if (remaining > 0) {
      timer = setTimeout(schedule, Math.min(remaining, 2_147_483_647));
    }
  };
  schedule();
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('focus', schedule);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', schedule);
    window.removeEventListener('focus', schedule);
  };
}

export default function EventBanner() {
  const active = useSyncExternalStore(subscribe, isActive, serverSnapshot);
  return active ? <EventAnnouncement /> : null;
}

function EventAnnouncement() {
  return (
    <section aria-labelledby="convention-heading" className="bg-[#E8F3EC] px-6 py-12 sm:py-16">
      <div className="mx-auto grid max-w-[1120px] items-center gap-8 md:grid-cols-2">
        <Link href={featuredEvent.path} className="overflow-hidden rounded-2xl shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4">
          <Image src={featuredEvent.image} alt={featuredEvent.imageAlt} width={1920} height={1080} sizes="(max-width: 768px) 100vw, 560px" className="h-auto w-full transition-transform hover:scale-[1.02]" />
        </Link>
        <div className="text-[#1E3A5F]">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest">{featuredEvent.subtitle}</p>
          <h2 id="convention-heading" className="font-serif text-3xl sm:text-4xl">{featuredEvent.title}</h2>
          <p className="mt-4 text-lg font-semibold">{featuredEvent.dateLabel}</p>
          <p className="mt-2">{featuredEvent.venue} · {featuredEvent.address}</p>
          <p className="mt-4 font-bold">Entrada libre</p>
          <Link href={featuredEvent.path} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#1E3A5F] px-6 py-3 font-semibold text-white hover:bg-[#0F2035] focus-visible:outline-2 focus-visible:outline-offset-4">Ver invitación y detalles →</Link>
        </div>
      </div>
    </section>
  );
}
