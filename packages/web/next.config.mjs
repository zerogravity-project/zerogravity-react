import bundleAnalyzer from '@next/bundle-analyzer';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@zerogravity/shared'],

  /**
   * Security Headers
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'axp1udgkvclx.objectstorage.ap-chuncheon-1.oci.customer-oci.com',
        pathname: '/n/axp1udgkvclx/b/zerogravity-static/o/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/themes',
      '@react-three/drei',
      '@react-three/fiber',
      '@tanstack/react-query',
      'chart.js',
      'date-fns',
      'lodash',
      'lucide-react',
      'motion',
      'react-chartjs-2',
      'three',
    ],
  },
  webpack: config => {
    /* GLSL Loader */
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

export default withBundleAnalyzer(withVanillaExtract(nextConfig));
