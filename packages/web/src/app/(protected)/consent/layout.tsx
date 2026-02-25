import type { Metadata } from 'next';

export const metadata: Metadata = {
  themeColor: '#111113',
};

/**
 * Consent layout
 * Provides theme-color metadata for PWA status bar
 */
export default function ConsentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
