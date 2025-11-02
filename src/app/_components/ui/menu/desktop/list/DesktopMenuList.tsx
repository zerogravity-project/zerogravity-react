import { MenuItem } from '@/app/_components/ui/menu/_types/menu.types';

import DesktopMenuListItem from './DesktopMenuListItem';

interface DesktopMenuListProps {
  menuItems: MenuItem[];
}

export default function DesktopMenuList({ menuItems }: DesktopMenuListProps) {
  return (
    <ul className="flex w-full flex-1 flex-col gap-3 px-3 py-4">
      {menuItems.map(menu => (
        <DesktopMenuListItem key={menu.href} href={menu.href} icon={menu.icon} label={menu.label} />
      ))}
    </ul>
  );
}
