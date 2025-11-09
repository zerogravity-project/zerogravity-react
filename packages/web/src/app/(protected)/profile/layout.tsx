'use client';

import { useSession } from 'next-auth/react';
import { useRef } from 'react';

import { useIsLg } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

import { DesktopMenu } from '@/app/_components/ui/menu/desktop/DesktopMenu';
import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';
import { useScroll } from '@/app/_hooks/useScroll';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  const isLoading = status === 'loading';

  const isLg = useIsLg();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isScrolling } = useScroll({
    scrollRef,
    enable: !isLoading,
  });

  return (
    <>
      <NavigationAdapter border background className={cn('fixed top-0', isScrolling && 'shadow-2xl shadow-black')} />
      <div ref={scrollRef} className="pt-topnav-height flex h-[100dvh] w-[100dvw] overflow-auto">
        {!isLg && (
          <div className="flex h-full w-[256px] flex-shrink-0">
            <DesktopMenu className="border-r border-[var(--gray-3)]" />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
