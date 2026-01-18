import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { USER_QUERY_KEY } from '@/services/user/user.keys';
import { getUserProfileServer } from '@/services/user/user.service.server';

import SettingsPageClient from './_components/SettingsPageClient';

/*
 * ============================================
 * Page Component (Server)
 * ============================================
 */

export default async function ProfileSettingsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY.PROFILE],
    queryFn: getUserProfileServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPageClient />
    </HydrationBoundary>
  );
}
