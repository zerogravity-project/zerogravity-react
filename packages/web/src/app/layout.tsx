import '@zerogravity/shared/styles';
import { IconDescriptor } from 'next/dist/lib/metadata/types/metadata-types';
import { cookies } from 'next/headers';

import type { Metadata, Viewport } from 'next';

import { MotionProvider, ThemeProvider } from '@zerogravity/shared/components/providers';
import { EMOTION_COLORS, type EmotionColor } from '@zerogravity/shared/entities/emotion';

import NextAuthSessionProvider from '@/app/_components/providers/NextAuthSessionProvider';
import TanstackQueryProvider from '@/app/_components/providers/TanstackQueryProvider';
import { ModalProvider } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { AlertModal } from '@/app/_components/ui/modal/AlertModal';
import { ComponentModal } from '@/app/_components/ui/modal/ComponentModal';
import { ConfirmModal } from '@/app/_components/ui/modal/ConfirmModal';
import { FeedbackModal } from '@/app/_components/ui/modal/FeedbackModal';

export interface CustomIconDescriptorType extends IconDescriptor {
  precedence?: string;
}

const icon: CustomIconDescriptorType = {
  rel: 'stylesheet',
  url: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block&icon_names=add,analytics,arrow_back,arrow_forward,attach_file,auto_awesome,bolt,calendar_today,check,check_box,chevron_left,chevron_right,close,edit_note,error,feedback,image,ios_share,lightbulb,menu,play_circle,refresh,rocket_launch,settings,sticky_note_2,warning',
  precedence: 'default',
};

/** OG Image URL on CDN */
const OG_IMAGE_URL =
  'https://axp1udgkvclx.objectstorage.ap-chuncheon-1.oci.customer-oci.com/n/axp1udgkvclx/b/zerogravity-static/o/og/og-image.png';

/** App description for SEO */
const APP_DESCRIPTION =
  'ZeroGravity is an AI-powered emotion tracking app. Record your daily emotions with AI assistance, get AI-generated insights and period analysis, explore patterns through interactive charts, and visualize your emotional journey with stunning 3D planets.';

/** JSON-LD Structured Data for SEO */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Zero Gravity',
  description: APP_DESCRIPTION,
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  url: 'https://www.zerogv.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.zerogv.com'),
  title: {
    default: 'Zero Gravity',
    template: '%s | Zero Gravity',
  },
  description: APP_DESCRIPTION,
  keywords: [
    'emotion tracking',
    'mood tracker',
    'emotion diary',
    'mental health app',
    'AI emotion analysis',
    'emotion visualization',
    '3D emotion planets',
    'personal wellness',
    'mental wellness',
    'daily mood journal',
  ],
  authors: [{ name: 'Zero Gravity', url: 'https://www.zerogv.com' }],
  creator: 'Zero Gravity',
  publisher: 'Zero Gravity',
  applicationName: 'Zero Gravity',
  themeColor: '#0b0b0c',
  appleWebApp: {
    title: 'Zero Gravity',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    other: icon,
  },
  openGraph: {
    title: 'Zero Gravity',
    description: APP_DESCRIPTION,
    url: 'https://www.zerogv.com',
    siteName: 'Zero Gravity',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Zero Gravity - Emotion Tracking',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero Gravity',
    description: APP_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

/**
 * Root layout
 * Minimal - only html/body structure
 * Providers are handled by route group layouts
 */
/* eslint-disable @next/next/no-page-custom-font, @next/next/google-font-display */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedColor = cookieStore.get('accentColor')?.value;
  const initialColor =
    storedColor && (EMOTION_COLORS as readonly string[]).includes(storedColor)
      ? (storedColor as EmotionColor)
      : undefined;
  return (
    <html lang="ko">
      <head suppressHydrationWarning>
        {/* Favicon (light/dark mode) */}
        <link rel="icon" href="/favicon-light.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.png" media="(prefers-color-scheme: dark)" />
        {/* Font preconnects */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        {/* Material Symbols preload */}
        <link rel="preload" href={icon.url as string} as="style" />
        {/* TypeKit (Helvetica Neue LT Pro) */}
        <link rel="stylesheet" href="https://use.typekit.net/nrd4ucj.css" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {/* Skip Link for keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-md focus:bg-[var(--accent-9)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <NextAuthSessionProvider>
          <TanstackQueryProvider>
            <ThemeProvider initialColor={initialColor}>
              <MotionProvider>
                <ModalProvider>
                  {children}
                  <AlertModal />
                  <ConfirmModal />
                  <ComponentModal />
                  <FeedbackModal />
                </ModalProvider>
              </MotionProvider>
            </ThemeProvider>
          </TanstackQueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
