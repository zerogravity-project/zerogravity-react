import type { Metadata } from 'next';

import './globals.css';
import SessionProvider from '@/app/_components/providers/SessionProvider';
import { TopNavigation } from '@/app/_components/ui';

export const metadata: Metadata = {
  title: 'ZeroGravity',
  description: '아무것도 하지 않기 위한 시간, 무중력의 세계로',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-lightgray-background text-black-900 min-h-screen">
        <SessionProvider>
          <TopNavigation />
          <main className="mx-auto w-full max-w-6xl px-4 pt-10 pb-16 lg:px-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
