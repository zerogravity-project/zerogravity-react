import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { format, startOfWeek } from 'date-fns';

import { getUserLocalNow } from '@/lib/timezone';
import { CHART_QUERY_KEY } from '@/services/chart/chart.keys';
import { getChartCountServer, getChartLevelServer, getChartReasonServer } from '@/services/chart/chart.service.server';

import { EmotionsCharts } from './_components/EmotionsCharts';
import { ChartProvider } from './_contexts/ChartContext';

/*
 * ============================================
 * Page Component (Server)
 * ============================================
 */

export default async function ProfileChartPage() {
  const queryClient = new QueryClient();

  // Default: week period, starting from this week (Sunday)
  const defaultPeriod = 'week';
  const defaultStartDate = format(startOfWeek(await getUserLocalNow(), { weekStartsOn: 0 }), 'yyyy-MM-dd');

  // Parallel prefetch all 3 chart queries
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [CHART_QUERY_KEY.LEVEL, defaultPeriod, defaultStartDate],
      queryFn: () => getChartLevelServer({ period: defaultPeriod, startDate: defaultStartDate }),
    }),
    queryClient.prefetchQuery({
      queryKey: [CHART_QUERY_KEY.COUNT, defaultPeriod, defaultStartDate],
      queryFn: () => getChartCountServer({ period: defaultPeriod, startDate: defaultStartDate }),
    }),
    queryClient.prefetchQuery({
      queryKey: [CHART_QUERY_KEY.REASON, defaultPeriod, defaultStartDate],
      queryFn: () => getChartReasonServer({ period: defaultPeriod, startDate: defaultStartDate }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChartProvider>
        <EmotionsCharts />
      </ChartProvider>
    </HydrationBoundary>
  );
}
