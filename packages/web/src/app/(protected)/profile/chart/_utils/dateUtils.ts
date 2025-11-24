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
 * @param date - Any date within the target week
 * @returns Object with start (Sunday) and end (Saturday) dates
 */
export function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return { start, end };
}

/**
 * Get month range for a given date
 * @param date - Any date within the target month
 * @returns Object with start (1st) and end (last day) dates
 */
export function getMonthRange(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}

/**
 * Get year range for a given date
 * @param date - Any date within the target year
 * @returns Object with start (Jan 1) and end (Dec 31) dates
 */
export function getYearRange(date: Date) {
  const start = startOfYear(date);
  const end = endOfYear(date);
  return { start, end };
}

/**
 * Format date range for display
 * @param date - Reference date for the period
 * @param period - Time period type
 * @returns Formatted date range string for display
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
 * @param date - Current reference date
 * @param period - Time period type
 * @param direction - Navigation direction
 * @returns New date offset by one period in the specified direction
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
