'use client';

import { useState } from 'react';
import { featuredEvent } from '@/lib/data/featured-event';

export default function ConventionMedia() {
  const [showJingle, setShowJingle] = useState(false);
  return (
    <div className="space-y-12">
      <section aria-labelledby="invitation-title">
        <h2 id="invitation-title" className="mb-4 font-serif text-3xl">Una invitación para ti</h2>
        <video controls playsInline preload="none" poster={featuredEvent.image} aria-label="Anuncio de la Convención Nacional Chile 2026" className="aspect-video w-full rounded-2xl bg-[#0F2035]" src={featuredEvent.video}>
          Tu navegador no puede reproducir este video. <a href={featuredEvent.video}>Abrir video de invitación</a>.
        </video>
        <p className="mt-3 text-sm text-gray-600">Convención Nacional Chile 2026. Del 29 de octubre al 1 de noviembre, en el Gimnasio San Joaquín, Sierra Bella #2888. Entrada libre.</p>
      </section>
      <section aria-labelledby="jingle-title">
        <h2 id="jingle-title" className="mb-4 font-serif text-3xl">Escucha nuestro jingle</h2>
        {showJingle ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${featuredEvent.youtubeId}?autoplay=1`} title="Jingle promocional de la Convención Nacional Chile 2026" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="aspect-video w-full rounded-2xl border-0" />
        ) : (
          <button type="button" onClick={() => setShowJingle(true)} className="flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-[#1E3A5F] p-8 text-white hover:bg-[#0F2035] focus-visible:outline-2 focus-visible:outline-offset-4">
            <span aria-hidden="true" className="text-4xl">▶</span>
            <span className="text-lg font-semibold">Reproducir jingle</span>
            <span className="text-sm text-white/75">Convención Nacional Chile 2026</span>
          </button>
        )}
        <a href={`https://www.youtube.com/watch?v=${featuredEvent.youtubeId}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block underline underline-offset-4">Ver en YouTube ↗</a>
      </section>
    </div>
  );
}
