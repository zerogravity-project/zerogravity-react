import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@zerogravity/shared'],
  webpack: config => {
    /* GLSL Loader */
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

export default withVanillaExtract(nextConfig);
