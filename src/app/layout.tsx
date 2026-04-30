import type { Metadata } from "next";
import { Playfair_Display, Karla, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import RadioProviderWrapper from "@/components/radio/RadioProviderWrapper";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mmmchile.cl"),
  title: {
    template: "%s | MMM Chile",
    default: "MMM Chile - Plataforma Evangelística Digital",
  },
  description: "Movimiento Misionero Mundial en Chile. Conoce a Jesús, encuentra una iglesia, y fortalece tu fe.",
  openGraph: {
    title: "MMM Chile - Plataforma Evangelística Digital",
    description: "Movimiento Misionero Mundial en Chile. Conoce a Jesús, encuentra una iglesia, y fortalece tu fe.",
    url: "https://mmmchile.cl",
    siteName: "MMM Chile",
    locale: "es_CL",
    type: "website",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MMM Chile",
    "url": "https://mmmchile.cl",
    "logo": "https://mmmchile.cl/logo.png",
    "sameAs": [
      "https://web.facebook.com/MMMCHILEORG/",
      "https://www.instagram.com/chile_mmm/",
      "https://www.youtube.com/@KoinoniaMMMChileOficial"
    ]
  };

  return (
    <html lang="es-CL" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${karla.variable} ${jetbrainsMono.variable} antialiased font-sans overflow-x-hidden`}>
        <RadioProviderWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </RadioProviderWrapper>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
