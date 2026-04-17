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

export const metadata: Metadata = {
  title: "MMM Chile | Iglesias Cristianas en Chile",
  description: "Conoce a Jesús, encuentra una iglesia, y fortalece tu fe.",
  alternates: {
    canonical: '/',
  },
};



export default async function Home() {
  const churches = await sanityFetch<ChurchListItem[]>({ query: GET_ALL_CHURCHES_QUERY });

  return (
    <main className="flex min-h-screen flex-col">
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
