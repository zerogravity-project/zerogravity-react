/**
 * [Chart utilities]
 * Configuration and labels for chart display
 */

import { getDaysInMonth } from 'date-fns';

import { ChartPeriod, WEEK_LABELS, YEAR_LABELS } from '@/services/chart/chart.dto';

/**
 * Get chart configuration based on period
 * @param period - Chart period type (week, month, year)
 * @param startDate - Start date string to calculate days in month
 * @returns Object with labels array and max value for the chart
 */
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
