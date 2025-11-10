import { MenuItem } from '@zerogravity/shared/components/ui/navigation';

import { DesktopMenuListItem } from './DesktopMenuListItem';

interface DesktopMenuListProps {
  menuItems: MenuItem[];
}

export function DesktopMenuList({ menuItems }: DesktopMenuListProps) {
  return (
    <ul className="flex w-full flex-1 flex-col gap-3 px-3 py-4">
      {menuItems.map(menu => (
        <DesktopMenuListItem key={menu.href} href={menu.href} icon={menu.icon} label={menu.label} />
      ))}
    </ul>
  );
}
