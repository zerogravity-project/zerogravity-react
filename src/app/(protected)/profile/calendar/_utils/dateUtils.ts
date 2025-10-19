import { MONTH_NAMES } from '../_constants/calendar.constants';

/**
 * Get information about a specific month
 */
export function getMonthInfo(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysInMonth = lastDayOfMonth.getDate();

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
 */
export function getWeekOfMonth(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const dayOfMonth = date.getDate();
  return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
}

/**
 * Format the time of a date
 */
export function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Get the name of the month of a date
 * @param date
 * @returns
 */
export function getMonthName(date: Date) {
  return MONTH_NAMES[date.getMonth()];
}
