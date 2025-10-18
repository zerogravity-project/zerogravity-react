'use client';

import { useSession } from 'next-auth/react';

import { Navigation } from '@/app/_components/ui';
import { Menu } from '@/app/_components/ui/menu';
import { useIsLg } from '@/app/_hooks/useMediaQuery';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLg = useIsLg();
  const { status } = useSession();
  const isLoading = status === 'loading';

  return (
    <>
      <Navigation border className="fixed top-0" />
      <div className="pt-topnav-height mobile:h-[100dvh] flex w-[100dvw]">
        {!isLg && !isLoading && (
          <div className="flex h-full w-[256px] flex-shrink-0">
            <Menu className="border-r border-[var(--gray-3)]" />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
