import { getDaysInMonth } from 'date-fns';

import { ChartPeriod, WEEK_LABELS, YEAR_LABELS } from '@/services/chart/chart.dto';

export function getChartConfig(period: ChartPeriod, startDate: string) {
  if (period === 'week') {
    return { labels: WEEK_LABELS, max: 7 };
  }
  if (period === 'month') {
    const daysInMonth = getDaysInMonth(new Date(startDate));
    const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    // Add Next Month's 1st day
    labels.push('1');

    return { labels, max: daysInMonth };
  }
  if (period === 'year') {
    return { labels: YEAR_LABELS, max: 12 };
  }
}
