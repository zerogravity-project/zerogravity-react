import '@zerogravity/shared/styles';
import { IconDescriptor } from 'next/dist/lib/metadata/types/metadata-types';

import type { Metadata } from 'next';

import ClientProviders from './_components/providers/ClientProviders';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
