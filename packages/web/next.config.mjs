import { withSentryConfig } from '@sentry/nextjs';
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
              "report-uri https://o4510777101975552.ingest.us.sentry.io/api/4510777103024128/security/?sentry_key=3266c405a313e58b725029a578cbe546",
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
  webpack: (config, { webpack }) => {
    /* GLSL Loader */
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: 'asset/source',
    });

    /* Sentry tree-shaking: remove tracing code from bundle */
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_TRACING__: false,
      })
    );

    return config;
  },
};

export default withSentryConfig(withBundleAnalyzer(withVanillaExtract(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "minuk-hwang",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
