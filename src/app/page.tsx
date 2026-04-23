import type { Metadata } from 'next';
import dynamic from "next/dynamic";
import HeroSection from '../components/home/HeroSection';
import IntentRouter from '../components/home/IntentRouter';
import { sanityFetch } from "@/lib/sanity/client";
import { GET_ALL_CHURCHES_QUERY } from "@/lib/sanity/queries";
import type { ChurchListItem } from "@/lib/types/church";

const TestimoniesPreview = dynamic(() => import('../components/home/TestimoniesPreview'));
const WhyBelieveSection = dynamic(() => import('../components/home/WhyBelieveSection'));
const BlogPreview = dynamic(() => import('../components/home/BlogPreview'));
const ChurchFinderPreview = dynamic(() => import('../components/home/ChurchFinderPreview'));
const LiveStreamBanner = dynamic(() => import('../components/home/LiveStreamBanner'));
const WhatsappCTA = dynamic(() => import('../components/home/WhatsappCTA'));

const BASE_URL = 'https://mmmchile.cl';

export const metadata: Metadata = {
  title: "MMM Chile | Iglesias Cristianas y Evangelio en Chile",
  description: "Movimiento Misionero Mundial en Chile. Conoce a Jesús, encuentra una iglesia cristiana cerca de ti, y accede a recursos de fe. Más de 30 congregaciones en todo el país.",
  keywords: [
    "iglesias cristianas Chile", "Movimiento Misionero Mundial Chile",
    "MMM Chile", "conocer a Jesús", "fe cristiana", "evangelio Chile",
    "iglesias evangélicas Chile", "congregaciones Chile",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "MMM Chile | Iglesias Cristianas y Evangelio en Chile",
    description: "Conoce a Jesús, encuentra una iglesia cristiana cerca de ti, y accede a recursos de fe. Más de 30 congregaciones en todo Chile.",
    url: BASE_URL,
    siteName: "Movimiento Misionero Mundial Chile",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Movimiento Misionero Mundial Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MMM Chile | Iglesias Cristianas y Evangelio en Chile",
    description: "Conoce a Jesús, encuentra una iglesia cristiana cerca de ti. Más de 30 congregaciones en todo Chile.",
    images: [`${BASE_URL}/opengraph-image`],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Movimiento Misionero Mundial Chile',
  alternateName: 'MMM Chile',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.png`,
    width: 724,
    height: 446,
  },
  description: 'Llevando esperanza, fe y propósito a cada rincón de Chile a través del mensaje transformador del Evangelio.',
  inLanguage: 'es-CL',
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
  sameAs: [
    'https://web.facebook.com/MMMCHILEORG/',
    'https://www.instagram.com/chile_mmm/',
    'https://www.youtube.com/@KoinoniaMMMChileOficial',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${BASE_URL}/contacto`,
    availableLanguage: 'Spanish',
  },
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MMM Chile',
  url: BASE_URL,
  inLanguage: 'es-CL',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/iglesias?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default async function Home() {
  const churches = await sanityFetch<ChurchListItem[]>({ query: GET_ALL_CHURCHES_QUERY });

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <HeroSection />
      <IntentRouter />
      <TestimoniesPreview />
      <WhyBelieveSection />
      <BlogPreview />
      <ChurchFinderPreview churches={churches} />
      <LiveStreamBanner />
      <WhatsappCTA />
    </main>
  );
}
