import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  applicationName: 'Radio Bethel Chile',
  manifest: '/radio/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Radio Bethel', statusBarStyle: 'black-translucent' },
  icons: {
    icon: '/radio/icons/icon-192.png',
    apple: '/radio/icons/icon-180.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0A0F18',
};

export default function RadioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
