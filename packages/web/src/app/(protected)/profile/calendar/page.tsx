import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';

import { EMOTION_QUERY_KEY } from '@/services/emotion/emotion.keys';
import { getEmotionRecordsServer } from '@/services/emotion/emotion.service.server';

import Calendar from './_components/EmotionCalendar';

/*
 * ============================================
 * Page Component (Server)
 * ============================================
 */

export default async function ProfileCalendarPage() {
  const queryClient = new QueryClient();
  const today = new Date();

  // Desktop: current month range
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const monthStartDateTime = format(monthStart, "yyyy-MM-dd'T'HH:mm:ss");
  const monthEndDateTime = format(monthEnd, "yyyy-MM-dd'T'HH:mm:ss");

  // Mobile: current week range
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const weekStartDateTime = format(weekStart, "yyyy-MM-dd'T'HH:mm:ss");
  const weekEndDateTime = format(weekEnd, "yyyy-MM-dd'T'HH:mm:ss");

  // Parallel prefetch for both Desktop (month) and Mobile (week)
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [EMOTION_QUERY_KEY.RECORDS, monthStartDateTime, monthEndDateTime],
      queryFn: () => getEmotionRecordsServer({ startDateTime: monthStartDateTime, endDateTime: monthEndDateTime }),
    }),
    queryClient.prefetchQuery({
      queryKey: [EMOTION_QUERY_KEY.RECORDS, weekStartDateTime, weekEndDateTime],
      queryFn: () => getEmotionRecordsServer({ startDateTime: weekStartDateTime, endDateTime: weekEndDateTime }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full w-full flex-1">
        <Calendar />
      </div>
    </HydrationBoundary>
  );
}
