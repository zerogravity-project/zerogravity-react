import { MENU_ITEMS } from '@/app/_components/ui/menu/_constants/menu.constants';
import { cn } from '@/app/_utils/styleUtils';

import DesktopMenuFooter from './footer/DesktopMenuFooter';
import DesktopMenuHeader from './header/DesktopMenuHeader';
import DesktopMenuList from './list/DesktopMenuList';

interface DesktopMenuProps {
  className?: string;
}

export default function DesktopMenu({ className }: DesktopMenuProps) {
  return (
    <aside className={cn('flex h-full w-full flex-col items-center justify-between bg-[var(--gray-1)]', className)}>
      <DesktopMenuHeader />
      <DesktopMenuList menuItems={MENU_ITEMS.profile} />
      <DesktopMenuFooter />
    </aside>
  );
}
