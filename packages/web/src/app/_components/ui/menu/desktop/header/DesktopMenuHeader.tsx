'use client';

import { Avatar, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

/**
 * ============================================
 * Component
 * ============================================
 */

export function DesktopMenuHeader() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { data: session } = useSession();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const profileImage = session?.user?.image ?? undefined;
  const displayName = session?.user?.name ?? 'ZeroGravity User';
  const email = session?.user?.email;

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <header className="flex w-full items-center gap-3 border-b border-[var(--gray-3)] px-4 py-6">
      <Avatar variant="solid" src={profileImage} size="2" fallback={displayName.charAt(0)} radius="full" />
      <div className="flex flex-col">
        <Text size="2">{displayName}</Text>
        {email && (
          <Text size="1" weight="light" color="gray">
            {email}
          </Text>
        )}
      </div>
    </header>
  );
}
