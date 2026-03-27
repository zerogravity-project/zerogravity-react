import { Avatar, Text } from '@radix-ui/themes';

import { auth } from '@/lib/auth';

/*
 * ============================================
 * Component
 * ============================================
 */

export async function DesktopMenuHeader() {
  /*
   * --------------------------------------------
   * 1. Server Data Fetching
   * --------------------------------------------
   */
  const session = await auth();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const profileImage = session?.user?.image ?? undefined;
  const displayName = session?.user?.name ?? 'ZeroGravity User';
  const email = session?.user?.email;

  /*
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
