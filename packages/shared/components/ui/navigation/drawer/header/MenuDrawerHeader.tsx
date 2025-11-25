'use client';

import { Avatar, Text } from '@radix-ui/themes';

import { NavigationUser } from '../../types/navigation.types';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MenuDrawerHeaderProps {
  user?: NavigationUser;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function MenuDrawerHeader({ user }: MenuDrawerHeaderProps) {
  /**
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  const profileImage = user?.image;
  const displayName = user?.name ?? 'ZeroGravity User';
  const email = user?.email;

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <header className="flex w-full items-center gap-5 border-b border-[var(--gray-3)] bg-[var(--gray-2)] px-5 py-6">
      <Avatar variant="solid" src={profileImage} size="3" fallback={displayName.charAt(0)} radius="full" />
      <div className="flex flex-col">
        <Text size="3">{displayName}</Text>
        {email && (
          <Text size="2" weight="light" color="gray">
            {email}
          </Text>
        )}
      </div>
    </header>
  );
}
