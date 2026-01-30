import { ReactNode } from 'react';

import { DesktopMenu } from '@/app/_components/ui/menu/desktop/DesktopMenu';
import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

/**
 * Profile layout
 * Includes NavigationAdapter with background + border
 * Desktop: Side menu + content
 * Mobile: Content only (menu is in Navigation drawer)
 */
export default async function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationAdapter background border />
      <div className="pt-topnav-height flex h-[100dvh] w-[100dvw]">
        <div className="flex h-full w-[256px] flex-shrink-0 max-lg:hidden">
          <DesktopMenu className="border-r border-[var(--gray-3)]" />
        </div>
        <main id="main-content" className="contents">
          {children}
        </main>
      </div>
    </>
  );
}
