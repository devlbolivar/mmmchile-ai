'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, CalendarDays, Headphones, Info, LoaderCircle, Pause, Play, Radio, RotateCcw, WifiOff } from 'lucide-react';
import { useRadio } from './RadioContext';
import RadioInstall from './radio-install';
import { schedule } from '@/lib/data/radio-schedule';
import { trackEvent } from '@/lib/analytics';

type Screen = 'listen' | 'schedule' | 'about';
const tabs = [
  { id: 'listen', label: 'Escuchar', icon: Headphones },
  { id: 'schedule', label: 'Programación', icon: CalendarDays },
  { id: 'about', label: 'La radio', icon: Info },
] as const;

function subscribeOnline(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => { window.removeEventListener('online', callback); window.removeEventListener('offline', callback); };
}
function subscribeDay(callback: () => void) {
  const timer = window.setInterval(callback, 60_000);
  return () => window.clearInterval(timer);
}
function getDay(): keyof typeof schedule {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Santiago', weekday: 'short' }).format(new Date());
  return weekday === 'Sun' ? 'sunday' : weekday === 'Sat' ? 'saturday' : 'weekdays';
}

export default function RadioApp() {
  const radio = useRadio();
  const [screen, setScreen] = useState<Screen>('listen');
  const [selectedDay, setDay] = useState<keyof typeof schedule | null>(null);
  const today = useSyncExternalStore(subscribeDay, getDay, () => 'weekdays' as const);
  const day = selectedDay ?? today;
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

  const active = radio.isPlaying || radio.isLoading;
  const status = !online ? 'Sin conexión a internet' : radio.hasError ? 'No pudimos conectar con la señal' : radio.isLoading ? 'Conectando con la radio…' : radio.isPlaying ? 'Estás escuchando en vivo' : 'Un momento para escuchar';
  const toggle = () => {
    if (active) { radio.pause(); trackEvent('radio_pause'); }
    else { radio.play(); trackEvent('radio_play', { method: 'pwa' }); }
  };

  return (
    <main className="min-h-dvh bg-[#0A0F18] text-[#F8F6F0] selection:bg-[#D4A843]/30">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link href="/radio/app" aria-label="Radio Bethel Chile, inicio" className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-[#D4A843]">
            <Radio size={23} className="text-[#D4A843]" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-[0.12em]">BETHEL <span className="font-normal text-slate-400">CHILE</span></span>
          </Link>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-300">RADIO 24/7</span>
        </header>

        {!online && <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm text-amber-200"><WifiOff size={20} className="shrink-0" />La transmisión necesita internet. Puedes reintentar cuando vuelva la conexión.</div>}

        <section hidden={screen !== 'listen'} aria-label="Escuchar radio" className="flex-1">
          <div className="relative mx-auto mb-6 grid aspect-square w-[min(60vw,260px)] place-items-center overflow-hidden rounded-[2rem] border border-[#D4A843]/20 bg-[#101B2A] shadow-[0_24px_80px_-24px_#000]">
            <Image src="/radio/icons/icon-512.png" alt="Logo Radio Bethel Chile" width={260} height={260} priority className="h-full w-full object-contain" />
          </div>
          <div className="text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#D4A843]">Fe que te acompaña</p>
            <h1 className="font-serif text-3xl sm:text-4xl">Radio Bethel Chile</h1>
            <p className="mt-3 text-base text-slate-300">Música y la Palabra de Dios</p>
            <div className="my-5 flex min-h-6 items-center justify-center gap-2 text-sm text-slate-300" role="status" aria-live="polite">
              {radio.isPlaying && !radio.isLoading && <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />}{status}
            </div>
            <button type="button" onClick={toggle} disabled={!online && !active} aria-label={active ? 'Pausar radio' : radio.hasError ? 'Reintentar reproducción' : 'Reproducir radio'} className="mx-auto grid size-20 cursor-pointer place-items-center rounded-full bg-[#D4A843] text-[#0A0F18] shadow-[0_8px_35px_-10px_#D4A84380] transition hover:bg-[#E5BA59] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#E7C575] disabled:cursor-not-allowed disabled:opacity-40">
              {radio.isLoading ? <LoaderCircle size={32} className="motion-safe:animate-spin" aria-hidden="true" /> : radio.isPlaying ? <Pause size={32} fill="currentColor" aria-hidden="true" /> : radio.hasError ? <RotateCcw size={30} aria-hidden="true" /> : <Play size={32} fill="currentColor" className="ml-1" aria-hidden="true" />}
            </button>
            <p className="mb-7 mt-4 text-sm text-slate-400">{active ? 'Pausar transmisión' : 'Escuchar en vivo'}</p>
            <RadioInstall />
          </div>
        </section>

        <section hidden={screen !== 'schedule'} aria-labelledby="schedule-heading" className="flex-1">
          <p className="mb-2 text-sm text-[#D4A843]">Cada día contigo</p>
          <h2 id="schedule-heading" className="font-serif text-3xl">Programación</h2>
          <p className="mb-6 mt-3 text-sm text-slate-400">Horarios de Santiago de Chile.</p>
          <div className="mb-5 grid grid-cols-3 gap-2" aria-label="Día de programación">
            {Object.entries(schedule).map(([key, value]) => <button type="button" key={key} aria-pressed={day === key} onClick={() => setDay(key as keyof typeof schedule)} className={`min-h-12 cursor-pointer rounded-xl border text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#D4A843] ${day === key ? 'border-[#D4A843]/40 bg-[#D4A843]/15 text-[#E7C575]' : 'border-white/10 text-slate-300'}`}>{value.shortLabel}</button>)}
          </div>
          <ul className="divide-y divide-white/10">
            {schedule[day].programs.map((program) => <li key={`${program.time}-${program.name}`} className="flex items-baseline gap-5 py-5"><span className="w-20 shrink-0 text-sm tabular-nums text-[#E7C575]">{program.time}</span><span className="text-base">{program.name}</span></li>)}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-slate-400">La programación puede cambiar durante transmisiones especiales.</p>
        </section>

        <section hidden={screen !== 'about'} aria-labelledby="about-heading" className="flex-1">
          <h2 id="about-heading" className="font-serif text-3xl">Una voz de esperanza</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">Radio Bethel Chile te acompaña con música de adoración, predicaciones y devocionales, las 24 horas del día.</p>
          <div className="my-7 rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="mb-2 font-semibold">Siempre a mano</h3><p className="mb-5 text-sm leading-relaxed text-slate-300">Agrega la radio a tu pantalla de inicio y ábrela desde su propio icono. Para escuchar necesitas conexión a internet.</p><button type="button" onClick={() => setScreen('listen')} className="min-h-12 cursor-pointer rounded-xl border border-[#D4A843]/40 px-5 text-[#E7C575]">Ir al reproductor</button></div>
          <a href="/oracion" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between border-b border-white/10 py-4 text-[#E7C575]">Necesito oración <ArrowUpRight size={20} aria-hidden="true" /></a>
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between border-b border-white/10 py-4">Visitar MMM Chile <ArrowUpRight size={20} aria-hidden="true" /></a>
          <div className="mt-8 flex gap-6 text-sm text-slate-400"><a href="/privacidad" target="_blank" rel="noopener noreferrer" className="py-3 underline">Privacidad</a><a href="/terminos" target="_blank" rel="noopener noreferrer" className="py-3 underline">Términos</a></div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#101B2A] pb-[env(safe-area-inset-bottom)]">
        {screen !== 'listen' && active && <div className="mx-auto flex max-w-lg items-center justify-between border-b border-white/10 px-6 py-2"><button type="button" onClick={() => setScreen('listen')} className="min-h-11 cursor-pointer text-sm text-slate-200">{radio.isLoading ? 'Conectando…' : 'Escuchando Radio Bethel'}</button><button type="button" onClick={radio.pause} aria-label="Pausar radio" className="grid size-11 cursor-pointer place-items-center rounded-full bg-[#D4A843]/15 text-[#E7C575]"><Pause size={18} /></button></div>}
        <nav aria-label="Radio Bethel" className="mx-auto grid max-w-lg grid-cols-3 px-3">
          {tabs.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-current={screen === id ? 'page' : undefined} onClick={() => setScreen(id)} className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl text-sm focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D4A843] ${screen === id ? 'text-[#E7C575]' : 'text-slate-400 hover:text-slate-200'}`}><Icon size={22} strokeWidth={screen === id ? 2 : 1.6} aria-hidden="true" />{label}</button>)}
        </nav>
      </div>
    </main>
  );
}
