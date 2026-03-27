import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { endOfDay, format, startOfDay } from 'date-fns';
import type { Metadata } from 'next';

import { getUserLocalNow } from '@/lib/timezone';
import { EMOTION_QUERY_KEY } from '@/services/emotion/emotion.keys';
import { getEmotionRecordsServer } from '@/services/emotion/emotion.service.server';

import RecordSelection from './_components/RecordSelection';

export const metadata: Metadata = {
  themeColor: '#111113',
};

export default async function RecordSelectionPage() {
  const queryClient = new QueryClient();
  const today = await getUserLocalNow();

  const todayStart = format(startOfDay(today), "yyyy-MM-dd'T'HH:mm:ss");
  const todayEnd = format(endOfDay(today), "yyyy-MM-dd'T'HH:mm:ss");

  await queryClient.prefetchQuery({
    queryKey: [EMOTION_QUERY_KEY.RECORDS, todayStart, todayEnd],
    queryFn: () => getEmotionRecordsServer({ startDateTime: todayStart, endDateTime: todayEnd }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecordSelection />
    </HydrationBoundary>
  );
}
