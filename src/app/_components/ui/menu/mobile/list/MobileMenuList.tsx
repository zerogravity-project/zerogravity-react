import { usePathname } from 'next/navigation';

import { MenuItem } from '@/app/_components/ui/menu/_types/menu.types';

import MobileMenuListItem from './MobileMenuListItem';

interface MobileMenuListProps {
  menuItems: MenuItem[];
}

export default function MobileMenuList({ menuItems }: MobileMenuListProps) {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-1 flex-col pt-2">
      {menuItems.map(menu => (
        <MobileMenuListItem key={menu.href} href={{ pathname: menu.href }} label={menu.label} />
      ))}
      <MobileMenuListItem href={{ pathname, hash: 'setting' }} label="Setting" />
    </ul>
  );
}
