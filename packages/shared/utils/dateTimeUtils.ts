import { addDays, format, startOfWeek } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Format a date to YYYY-MM-DD string
 * @param date - Date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get a date string data
 * @param date - Date object to extract data from
 * @returns Object containing year, month, day, and weekday strings
 */
export function getDateStringData(date: Date) {
  const year = format(date, 'yyyy');
  const month = format(date, 'MMMM'); // Full month name in English
  const day = format(date, 'dd');
  const weekday = format(date, 'EEEE'); // Full weekday name in English

  return {
    year: year,
    month: month,
    day: day,
    weekday: weekday,
  };
}

/**
 * Get a time string data
 * @param date - Date object to extract time from
 * @returns Object containing hours, minutes, and seconds as padded strings
 */
export function getTimeStringData(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

/**
 * Check if two dates are the same day
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if both dates are on the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get dates for a week containing the given date
 * @param date - Any date within the target week
 * @returns Array of 7 Date objects starting from Sunday
 */
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(start, i));
  }
  return weekDates;
}
