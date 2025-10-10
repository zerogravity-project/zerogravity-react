import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    // GLSL 로더: .glsl, .vert, .frag 파일을 문자열로 import
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: 'asset/source',
    });
    return config;
  },
};

export default withVanillaExtract(nextConfig);
