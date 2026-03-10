import type { Metadata } from "next";
import { Playfair_Display, Karla, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingBtn from "@/components/layout/WhatsAppFloatingBtn";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className="scroll-smooth">
      <body className={`${playfair.variable} ${karla.variable} ${jetbrainsMono.variable} antialiased font-sans overflow-x-hidden`}>
        <RadioProviderWrapper>
          <Header />
          {children}
          <Footer />
          <WhatsAppFloatingBtn />
        </RadioProviderWrapper>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
