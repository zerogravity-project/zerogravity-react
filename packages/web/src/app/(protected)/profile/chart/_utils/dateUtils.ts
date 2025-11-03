import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';

/**
 * Get week range for a given date
 */
export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return { start, end };
}

/**
 * Get month range for a given date
 */
export function getMonthRange(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}

/**
 * Get year range for a given date
 */
export function getYearRange(date: Date) {
  const start = startOfYear(date);
  const end = endOfYear(date);
  return { start, end };
}

/**
 * Format date range for display
 */
export function formatDateRange(date: Date, period: 'week' | 'month' | 'year'): string {
  switch (period) {
    case 'week': {
      const { start, end } = getWeekRange(date);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    case 'month':
      return format(date, 'MMMM yyyy');
    case 'year':
      return format(date, 'yyyy');
    default:
      return '';
  }
}

/**
 * Navigate to next/previous period
 */
export function navigatePeriod(date: Date, period: 'week' | 'month' | 'year', direction: 'next' | 'prev'): Date {
  switch (period) {
    case 'week':
      return direction === 'next' ? addDays(date, 7) : addDays(date, -7);
    case 'month':
      return direction === 'next' ? addMonths(date, 1) : addMonths(date, -1);
    case 'year':
      return direction === 'next' ? addYears(date, 1) : addYears(date, -1);
    default:
      return date;
  }
}
