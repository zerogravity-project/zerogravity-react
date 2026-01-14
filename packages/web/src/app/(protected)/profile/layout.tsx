import { ReactNode } from 'react';

import { NavigationAdapter } from '@/app/_components/ui/navigation/NavigationAdapter';

import { ProfileLayoutClient } from './_components/ProfileLayoutClient';

/**
 * Profile layout (Server Component)
 * Includes NavigationAdapter with background + border
 * Wraps content with ProfileLayoutClient for responsive menu
 */
export default async function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavigationAdapter background border />
      <ProfileLayoutClient>{children}</ProfileLayoutClient>
    </>
  );
}
