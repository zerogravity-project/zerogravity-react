/**
 * [Settings page]
 * Server component for user profile settings
 * Fetches session on server, prefetches user profile for React Query hydration
 */
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { auth } from '@/lib/auth';
import { USER_QUERY_KEY } from '@/services/user/user.keys';
import { getUserProfileServer } from '@/services/user/user.service.server';

import { AccountActions } from './_components/AccountActions';
import { ConsentSection } from './_components/ConsentSection';
import { ProviderField } from './_components/ProviderField';
import { SettingField } from './_components/SettingField';
import { SettingSection } from './_components/SettingSection';

/*
 * ============================================
 * Page Component (Server)
 * ============================================
 */

export default async function ProfileSettingsPage() {
  /*
   * --------------------------------------------
   * 1. Server Data Fetching
   * --------------------------------------------
   */
  const queryClient = new QueryClient();

  const [session] = await Promise.all([
    auth(),
    queryClient.prefetchQuery({
      queryKey: [USER_QUERY_KEY.PROFILE],
      queryFn: getUserProfileServer,
    }),
  ]);

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const user = session?.user;
  const provider = session?.provider;

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="hide-scrollbar flex h-full w-full flex-1 flex-col gap-7 overflow-y-auto px-6 pt-6 pb-10 md:p-8">
      {/* Profile Settings Section - SSR */}
      <SettingSection title="Profile">
        {provider && <ProviderField provider={provider} />}
        {user?.name && <SettingField label="Name" value={user.name} />}
        {user?.email && <SettingField label="Email" value={user.email} type="email" />}
      </SettingSection>

      {/* Privacy & Consent Section - Client with React Query hydration */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConsentSection />
      </HydrationBoundary>

      {/* Account Actions Section - Client (interactive) */}
      <AccountActions />
    </div>
  );
}
