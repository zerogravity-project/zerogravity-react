import '@zerogravity/shared/styles';
import { IconDescriptor } from 'next/dist/lib/metadata/types/metadata-types';

import type { Metadata } from 'next';

export interface CustomIconDescriptorType extends IconDescriptor {
  precedence?: string;
}

const icon: CustomIconDescriptorType = {
  rel: 'stylesheet',
  url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block',
  precedence: 'default',
};

export const metadata: Metadata = {
  title: {
    default: 'ZeroGravity',
    template: '%s | ZeroGravity',
  },
  description:
    'ZeroGravity is an emotion tracking and personal wellness application that helps users monitor their emotional states, visualize patterns, and receive personalized insights.',
  keywords: [
    'emotion tracking',
    'personal wellness',
    'mental health',
    'wellness',
    'mental wellness',
    'mental health tracking',
    'mental health tracking app',
    'mental health tracking app',
    'mental health tracking app',
  ],
  authors: [{ name: 'ZeroGravity', url: 'https://zerogravity.io' }],
  creator: 'ZeroGravity',
  publisher: 'ZeroGravity',
  applicationName: 'ZeroGravity',
  appleWebApp: {
    title: 'ZeroGravity',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    other: icon,
  },
};

/**
 * Root layout
 * Minimal - only html/body structure
 * Providers are handled by route group layouts
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head suppressHydrationWarning>
        {/* Font preconnects */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        {/* TypeKit (Helvetica Neue LT Pro) */}
        <link rel="stylesheet" href="https://use.typekit.net/nrd4ucj.css" />
      </head>
      <body>
        {/* Skip Link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-[var(--accent-9)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
