'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function RadioInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const syncInstalled = () => setInstalled(standalone.matches || !!(navigator as Navigator & { standalone?: boolean }).standalone);
    syncInstalled();
    const ua = navigator.userAgent;
    setPlatform(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : /Android/.test(ua) ? 'android' : 'other');
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); dialogRef.current?.close(); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    standalone.addEventListener('change', syncInstalled);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/radio/sw.js', { scope: '/radio/', updateViaCache: 'none' }).catch(() => {
        // Listening remains available if browser policy blocks service workers.
        setError('No pudimos preparar la instalación. Recarga la página con conexión a internet.');
      });
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      standalone.removeEventListener('change', syncInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) { dialogRef.current?.showModal(); return; }
    setBusy(true);
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      dialogRef.current?.showModal();
    } finally {
      setPrompt(null);
      setBusy(false);
    }
  }

  if (installed) return null;
  return (
    <div className="text-center">
      <button type="button" onClick={install} disabled={busy} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#D4A843]/40 px-5 py-3 text-base font-semibold text-[#E7C575] transition hover:bg-[#D4A843]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E7C575] disabled:opacity-60">
        <Download size={18} aria-hidden="true" />{busy ? 'Abriendo instalación…' : 'Instalar radio'}
      </button>
      {error && <p role="status" className="mt-3 text-sm text-amber-200">{error}</p>}
      <dialog ref={dialogRef} aria-labelledby="radio-install-title" className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border border-white/15 bg-[#111D2D] p-6 text-left text-[#F8F6F0] shadow-2xl backdrop:bg-black/75">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="radio-install-title" className="text-xl font-bold">Lleva la radio contigo</h2>
          <button type="button" autoFocus aria-label="Cerrar instrucciones" onClick={() => dialogRef.current?.close()} className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 focus-visible:outline-2 focus-visible:outline-[#D4A843]"><X size={20} /></button>
        </div>
        {platform === 'ios' ? (
          <ol className="list-decimal space-y-4 pl-5 text-base text-slate-200">
            <li>Abre esta página en <strong>Safari</strong>. Si llegaste desde WhatsApp o Instagram, usa «Abrir en Safari».</li>
            <li>Pulsa <strong>Compartir</strong> <Share2 className="inline" size={17} aria-hidden="true" /> y luego <strong>Agregar a pantalla de inicio</strong>.</li>
            <li>Si aparece «Abrir como app web», déjalo activado. Pulsa <strong>Agregar</strong>.</li>
          </ol>
        ) : (
          <ol className="list-decimal space-y-4 pl-5 text-base text-slate-200">
            <li>Abre esta página en {platform === 'android' ? <strong>Chrome</strong> : <strong>Chrome o Edge</strong>}, fuera del navegador de WhatsApp o Instagram.</li>
            <li>En el menú del navegador, elige <strong>Instalar aplicación</strong> o <strong>Agregar a pantalla de inicio</strong>.</li>
            <li>Confirma la instalación. Si no aparece, vuelve a cargar la página o prueba otro navegador compatible.</li>
          </ol>
        )}
        <p className="mt-6 border-t border-white/10 pt-4 text-sm text-slate-300">La radio es gratuita. La transmisión usa internet y puede consumir tus datos móviles.</p>
      </dialog>
    </div>
  );
}
