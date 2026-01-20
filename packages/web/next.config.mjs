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
