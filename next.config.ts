import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/quienes-somos',
        destination: '/doctrina',
        permanent: true,
      },
      {
        source: '/nosotros',
        destination: '/doctrina',
        permanent: true,
      },
      {
        source: '/oficiales-internacionales',
        destination: '/doctrina',
        permanent: true, // 308
      },
      // Cubre también posibles variantes con trailing slash o paths hijos
      {
        source: '/oficiales-internacionales/:path*',
        destination: '/doctrina',
        permanent: true,
      },
      /*
      // Standard template for addressing recurring 404s captured in GA4
      {
        source: '/ruta-obsoleta',
        destination: '/nueva-ruta',
        permanent: true,
      }
      */
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
