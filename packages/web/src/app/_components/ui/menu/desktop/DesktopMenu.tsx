import { cn } from '@zerogravity/shared/utils';

import { MENU_ITEMS } from '@/app/_components/ui/menu/_constants/menu.constants';

import { DesktopMenuFooter } from './footer/DesktopMenuFooter';
import { DesktopMenuHeader } from './header/DesktopMenuHeader';
import { DesktopMenuList } from './list/DesktopMenuList';

interface DesktopMenuProps {
  className?: string;
}

export function DesktopMenu({ className }: DesktopMenuProps) {
  return (
    <aside className={cn('flex h-full w-full flex-col items-center justify-between bg-[var(--gray-1)]', className)}>
      <DesktopMenuHeader />
      <DesktopMenuList menuItems={MENU_ITEMS.profile} />
      <DesktopMenuFooter />
    </aside>
  );
}
