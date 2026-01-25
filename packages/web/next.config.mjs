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
          /**
           * CSP Report-Only Mode
           * Logs violations without blocking - for monitoring and testing
           * Three.js requires 'unsafe-eval' (shader compilation)
           * Radix UI requires 'unsafe-inline' (dynamic styles)
           * Next.js requires 'unsafe-inline' for inline scripts
           */
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
              "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://axp1udgkvclx.objectstorage.ap-chuncheon-1.oci.customer-oci.com https://lh3.googleusercontent.com https://k.kakaocdn.net",
              "font-src 'self' data: https://use.typekit.net https://p.typekit.net https://fonts.gstatic.com",
              "connect-src 'self' data: https://accounts.google.com https://kauth.kakao.com https://kapi.kakao.com https://axp1udgkvclx.objectstorage.ap-chuncheon-1.oci.customer-oci.com",
              "frame-src 'self' https://accounts.google.com https://kauth.kakao.com",
              "worker-src 'self' blob:",
              "media-src 'self' https://axp1udgkvclx.objectstorage.ap-chuncheon-1.oci.customer-oci.com",
            ].join('; '),
          },
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
