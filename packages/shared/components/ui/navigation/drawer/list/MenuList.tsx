'use client';

import { Text } from '@radix-ui/themes';

import { LinkProps, MenuItem } from '../../types/navigation.types';

import { MenuListItem } from './MenuListItem';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MenuListProps {
  menuItems: MenuItem[];
  currentPath: string;
  LinkComponent: React.ComponentType<LinkProps>;
  onFeedbackClick?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function MenuList({ menuItems, currentPath, LinkComponent, onFeedbackClick }: MenuListProps) {
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
      {onFeedbackClick && (
        <li className="w-full">
          <button
            onClick={onFeedbackClick}
            className="flex w-full cursor-pointer items-center gap-4 bg-transparent px-5 py-[18px] text-[var(--gray-9)] transition-colors hover:bg-[var(--accent-a3)] hover:text-[var(--accent-9)]"
          >
            <Text size="3" weight="light">
              Feedback
            </Text>
          </button>
        </li>
      )}
    </ul>
  );
}
