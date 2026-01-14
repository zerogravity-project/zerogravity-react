import { MENU_ITEMS } from '@zerogravity/shared/components/ui/navigation';
import { cn } from '@zerogravity/shared/utils';

import { DesktopMenuFooter } from './footer/DesktopMenuFooter';
import { DesktopMenuHeader } from './header/DesktopMenuHeader';
import { DesktopMenuList } from './list/DesktopMenuList';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DesktopMenuProps {
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function DesktopMenu({ className }: DesktopMenuProps) {
  return (
    <aside className={cn('flex h-full w-full flex-col items-center justify-between bg-[var(--gray-1)]', className)}>
      <DesktopMenuHeader />
      <DesktopMenuList menuItems={MENU_ITEMS} />
      <DesktopMenuFooter />
    </aside>
  );
}
