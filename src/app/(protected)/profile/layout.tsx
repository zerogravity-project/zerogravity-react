'use client';

import { useSession } from 'next-auth/react';
import { useRef } from 'react';

import { Navigation } from '@/app/_components/ui';
import { Menu } from '@/app/_components/ui/menu';
import { useIsLg } from '@/app/_hooks/useMediaQuery';
import { useScroll } from '@/app/_hooks/useScroll';
import { cn } from '@/app/_utils/styleUtils';

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
      <Navigation border background className={cn('fixed top-0', isScrolling && 'shadow-2xl shadow-black')} />
      <div ref={scrollRef} className="pt-topnav-height flex h-[100dvh] w-[100dvw] overflow-auto">
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
