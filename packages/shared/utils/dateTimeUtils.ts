import { addDays, format, startOfWeek } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Format a date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get a date string data
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
 */
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(start, i));
  }
  return weekDates;
}
