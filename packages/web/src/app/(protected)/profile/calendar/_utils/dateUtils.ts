/**
 * [Calendar date utilities]
 * Month info, week calculations, and time formatting
 */

import { endOfMonth, format, getDate, getDay, getDaysInMonth, startOfMonth } from 'date-fns';

/**
 * Get information about a specific month
 * @param year - Year to get info for
 * @param month - Month index (0-11)
 * @returns Month information including days, weeks, and empty cells
 */
export function getMonthInfo(year: number, month: number) {
  const date = new Date(year, month, 1);
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  const firstDayOfWeek = getDay(firstDayOfMonth); // 0 (Sunday) to 6 (Saturday)
  const daysInMonth = getDaysInMonth(date);

  // Calculate weeks needed
  const totalDaysNeeded = firstDayOfWeek + daysInMonth;
  const weeksNeeded = Math.ceil(totalDaysNeeded / 7);
  const totalCells = weeksNeeded * 7;
  const emptyCellsAfter = totalCells - firstDayOfWeek - daysInMonth;

  return {
    firstDayOfMonth,
    lastDayOfMonth,
    firstDayOfWeek,
    daysInMonth,
    weeksNeeded,
    totalCells,
    emptyCellsBefore: firstDayOfWeek,
    emptyCellsAfter,
  };
}

/**
 * Get the week number of the month for a given date
 * @param date - Date to calculate week number for
 * @returns Week number within the month (1-based)
 */
export function getWeekOfMonth(date: Date) {
  const firstDayOfMonth = startOfMonth(date);
  const firstDayOfWeek = getDay(firstDayOfMonth);
  const dayOfMonth = getDate(date);
  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
}

/**
 * Format the time of a date
 * @param date - Date to format time from
 * @returns Formatted time string in "h:mm a" format (e.g., "2:30 PM")
 */
export function formatTime(date: Date) {
  return format(date, 'h:mm a');
}

/**
 * Get the name of the month of a date
 * @param date - Date to get month name from
 * @returns Full month name (e.g., "January")
 */
export function getMonthName(date: Date) {
  return format(date, 'MMMM');
}
