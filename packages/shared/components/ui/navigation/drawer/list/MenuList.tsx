'use client';

import { LinkProps, MenuItem } from '../../types/navigation.types';

import { MenuListItem } from './MenuListItem';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MenuListProps {
  menuItems: MenuItem[];
  currentPath: string;
  LinkComponent: React.ComponentType<LinkProps>;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function MenuList({ menuItems, currentPath, LinkComponent }: MenuListProps) {
  return (
    <ul className="flex w-full flex-1 flex-col pt-2">
      {menuItems.map(menu => (
        <MenuListItem
          key={menu.href}
          href={menu.href}
          label={menu.label}
          currentPath={currentPath}
          LinkComponent={LinkComponent}
        />
      ))}
    </ul>
  );
}
