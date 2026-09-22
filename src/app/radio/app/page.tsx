import type { Metadata } from 'next';
import RadioApp from '@/components/radio/radio-app';

export function generateMetadata(): Metadata {
  return {
    title: 'Radio Bethel Chile — Escucha en vivo',
    description: 'Lleva Radio Bethel Chile contigo. Escucha en vivo y consulta nuestra programación.',
    alternates: { canonical: '/radio' },
  };
}

export default function RadioAppPage() {
  return <RadioApp />;
}
