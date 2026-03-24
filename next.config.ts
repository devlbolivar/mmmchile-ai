import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
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
      }
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
