/**
 * [Robots configuration]
 * Dynamic robots.txt generation based on environment
 * Blocks all crawlers in non-production environments
 */

import { MetadataRoute } from 'next';

const PRODUCTION_URL = 'https://zerogv.com';

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.AUTH_URL === PRODUCTION_URL;

  // Block all crawlers in non-production environments
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/login', '/terms/'],
      disallow: ['/api/', '/record', '/profile', '/spaceout', '/consent'],
    },
    sitemap: 'https://www.zerogv.com/sitemap.xml',
  };
}
