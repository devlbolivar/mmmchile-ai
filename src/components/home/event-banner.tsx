'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
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
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const dialogTitleId = useId();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const triggerElement = trigger.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <section aria-labelledby={headingId} className="bg-[#F8F6F0] px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[#1E3A5F]">{featuredEvent.subtitle}</p>
            <h2 id={headingId} className="font-serif text-3xl text-[#1E3A5F] sm:text-4xl">{featuredEvent.title}</h2>
          </div>
          <time dateTime={featuredEvent.date} className="text-base font-semibold text-[#1E3A5F]">{featuredEvent.dateLabel}</time>
        </div>
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Ampliar afiche de Conciencia Misionera"
          className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-[#0F2035] text-left shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A5F]"
        >
          <Image src={featuredEvent.image} alt={featuredEvent.imageAlt} width={1536} height={625} sizes="(max-width: 1168px) calc(100vw - 48px), 1120px" className="h-auto w-full" />
          <span className="flex min-h-11 items-center justify-center px-4 py-2 text-sm font-semibold text-[#E8C976] group-hover:underline">Ampliar imagen</span>
        </button>
      </div>
      {open && (
        <dialog
          ref={dialog}
          aria-labelledby={dialogTitleId}
          onCancel={close}
          onClose={close}
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}
          className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-[1600px] overflow-y-auto rounded-2xl bg-[#0F2035] p-4 text-white shadow-xl backdrop:bg-black/80 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 id={dialogTitleId} className="font-serif text-xl sm:text-2xl">{featuredEvent.title}</h3>
            <button type="button" onClick={close} aria-label="Cerrar imagen ampliada" className="min-h-11 shrink-0 cursor-pointer rounded-lg border border-white/30 px-4 text-base hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Cerrar</button>
          </div>
          <p className="mb-3 text-sm text-white/80 sm:hidden">Desliza la imagen hacia los lados para ver el afiche completo.</p>
          <div tabIndex={0} role="region" aria-label="Afiche ampliado, desplazamiento horizontal" className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-white">
            <Image src={featuredEvent.image} alt={featuredEvent.imageAlt} width={1536} height={625} sizes="1536px" quality={100} className="h-auto w-full min-w-[900px]" />
          </div>
        </dialog>
      )}
    </section>
  );
}
