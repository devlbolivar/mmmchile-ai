'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import CTAButton from '@/components/shared/CTAButton';
import { trackEvent } from '@/lib/analytics';

export default function NotFound() {
  useEffect(() => {
    // Log the 404 to GA4
    trackEvent('page_not_found', { 
        path: window.location.pathname,
        url: window.location.href
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-serif text-[#1E3A5F] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Página no encontrada</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        Lo sentimos, no pudimos encontrar la página que buscas. Sin embargo, tenemos algunas sugerencias para ti:
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mb-12">
        <CTAButton href="/conoce-a-jesus" variant="primary" className="w-full">
          Conoce a Jesús
        </CTAButton>
        <CTAButton href="/radio" variant="secondary" className="w-full">
          Escuchar Radio Bethel
        </CTAButton>
        <Link 
          href="/iglesias" 
          className="text-[#1E3A5F] font-semibold hover:underline mt-2"
        >
          Encuentra tu iglesia más cercana
        </Link>
      </div>

      <Link 
        href="/" 
        className="text-[#D4A843] hover:text-[#E8C976] transition-colors font-medium"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
