/**
 * [calendar dateUtils tests]
 * Unit tests for calendar month and time utilities
 */

import {
  formatTime,
  getMonthInfo,
  getMonthName,
  getWeekOfMonth,
} from '@/app/(protected)/profile/calendar/_utils/dateUtils';

describe('calendar dateUtils', () => {
  describe('getMonthInfo', () => {
    describe('basic month calculations', () => {
      /** Returns correct info for January 2024 */
      it('returns correct info for January 2024', () => {
        // January 2024 starts on Monday
        const info = getMonthInfo(2024, 0);

        expect(info.daysInMonth).toBe(31);
        expect(info.firstDayOfWeek).toBe(1); // Monday
        expect(info.firstDayOfMonth.getDate()).toBe(1);
        expect(info.lastDayOfMonth.getDate()).toBe(31);
      });

      /** Returns correct info for February 2024 (leap year) */
      it('returns correct info for February 2024 (leap year)', () => {
        const info = getMonthInfo(2024, 1);

        expect(info.daysInMonth).toBe(29);
      });

      /** Returns correct info for February 2023 (non-leap) */
      it('returns correct info for February 2023 (non-leap year)', () => {
        const info = getMonthInfo(2023, 1);

        expect(info.daysInMonth).toBe(28);
      });
    });

    describe('week calculations', () => {
      /** Handles months starting on Sunday */
      it('calculates weeks needed correctly when month starts on Sunday', () => {
        // December 2024 starts on Sunday
        const info = getMonthInfo(2024, 11);

        expect(info.firstDayOfWeek).toBe(0);
        expect(info.emptyCellsBefore).toBe(0);
        expect(info.weeksNeeded).toBe(5);
      });

      /** Handles months starting on Saturday */
      it('calculates weeks needed correctly when month starts on Saturday', () => {
        // June 2024 starts on Saturday
        const info = getMonthInfo(2024, 5);

        expect(info.firstDayOfWeek).toBe(6);
        expect(info.emptyCellsBefore).toBe(6);
        expect(info.weeksNeeded).toBe(6); // 30 days + 6 empty = 36, needs 6 weeks
      });

      /** Calculates total cells correctly */
      it('calculates total cells correctly', () => {
        const info = getMonthInfo(2024, 0); // January 2024

        expect(info.totalCells).toBe(info.weeksNeeded * 7);
        expect(info.emptyCellsBefore + info.daysInMonth + info.emptyCellsAfter).toBe(info.totalCells);
      });
    });

    describe('empty cells calculation', () => {
      /** Has correct empty cells before when month starts mid-week */
      it('has correct empty cells before when month starts mid-week', () => {
        // March 2024 starts on Friday
        const info = getMonthInfo(2024, 2);

        expect(info.firstDayOfWeek).toBe(5); // Friday
        expect(info.emptyCellsBefore).toBe(5);
      });

      /** Has correct empty cells after */
      it('has correct empty cells after', () => {
        const info = getMonthInfo(2024, 0); // January 2024

        const expectedEmptyAfter = info.totalCells - info.emptyCellsBefore - info.daysInMonth;
        expect(info.emptyCellsAfter).toBe(expectedEmptyAfter);
      });
    });

    describe('edge cases', () => {
      /** Handles December correctly */
      it('handles December correctly (month 11)', () => {
        const info = getMonthInfo(2024, 11);

        expect(info.daysInMonth).toBe(31);
        expect(info.lastDayOfMonth.getMonth()).toBe(11);
      });

      /** Handles year 2000 (leap year, century rule) */
      it('handles century boundary year', () => {
        // Year 2000 was a leap year (divisible by 400)
        const info = getMonthInfo(2000, 1);

        expect(info.daysInMonth).toBe(29);
      });

      /** Handles year 1900 (not a leap year) */
      it('handles non-century leap year rule', () => {
        // Year 1900 was NOT a leap year (divisible by 100 but not 400)
        const info = getMonthInfo(1900, 1);

        expect(info.daysInMonth).toBe(28);
      });
    });
  });

  describe('getWeekOfMonth', () => {
    /** Returns 0 for first week */
    it('returns 1 for first week dates', () => {
      // December 2024 starts on Sunday
      expect(getWeekOfMonth(new Date(2024, 11, 1))).toBe(1);
      expect(getWeekOfMonth(new Date(2024, 11, 7))).toBe(1);
    });

    /** Returns correct week for mid-month dates */
    it('returns correct week for mid-month dates', () => {
      // December 15, 2024 is in week 3
      expect(getWeekOfMonth(new Date(2024, 11, 15))).toBe(3);
    });

    /** Returns correct week for end of month */
    it('returns correct week for end of month', () => {
      // December 31, 2024
      const result = getWeekOfMonth(new Date(2024, 11, 31));
      expect(result).toBe(5);
    });

    /** Handles months starting on different days */
    it('handles month starting on different days', () => {
      // January 2024 starts on Monday
      expect(getWeekOfMonth(new Date(2024, 0, 1))).toBe(1);
      expect(getWeekOfMonth(new Date(2024, 0, 7))).toBe(2); // Sunday of 2nd visual week
    });

    /** Handles first day when month starts on Saturday */
    it('handles first day when month starts on Saturday', () => {
      // June 2024 starts on Saturday
      expect(getWeekOfMonth(new Date(2024, 5, 1))).toBe(1);
      expect(getWeekOfMonth(new Date(2024, 5, 2))).toBe(2); // Sunday
    });
  });

  describe('formatTime', () => {
    /** Formats time in 12-hour format */
    it('formats morning time correctly', () => {
      const date = new Date(2024, 0, 1, 9, 30);
      const result = formatTime(date);

      expect(result).toBe('9:30 AM');
    });

    /** Formats afternoon time correctly */
    it('formats afternoon time correctly', () => {
      const date = new Date(2024, 0, 1, 14, 45);
      const result = formatTime(date);

      expect(result).toBe('14:45 PM');
    });

    /** Formats midnight as 12:00 AM */
    it('formats midnight correctly', () => {
      const date = new Date(2024, 0, 1, 0, 0);
      const result = formatTime(date);

      expect(result).toBe('0:00 AM');
    });

    /** Formats noon as 12:00 PM */
    it('formats noon correctly', () => {
      const date = new Date(2024, 0, 1, 12, 0);
      const result = formatTime(date);

      expect(result).toBe('12:00 PM');
    });

    /** Pads single digit minutes */
    it('pads single digit minutes', () => {
      const date = new Date(2024, 0, 1, 10, 5);
      const result = formatTime(date);

      expect(result).toBe('10:05 AM');
    });

    /** Does not pad single digit hours */
    it('does not pad single digit hours', () => {
      const date = new Date(2024, 0, 1, 5, 30);
      const result = formatTime(date);

      expect(result).toBe('5:30 AM');
    });

    /** Handles edge case 11:59 PM */
    it('handles edge of AM.PM boundary (11:59 AM)', () => {
      const date = new Date(2024, 0, 1, 11, 59);
      const result = formatTime(date);

      expect(result).toBe('11:59 AM');
    });

    /** Handles 23:59 */
    it('handles 23:59', () => {
      const date = new Date(2024, 0, 1, 23, 59);
      const result = formatTime(date);

      expect(result).toBe('23:59 PM');
    });
  });

  describe('getMonthName', () => {
    /** Returns correct month name for each month (0-11) */
    it('returns correct name for each month', () => {
      expect(getMonthName(new Date(2024, 0, 1))).toBe('January');
      expect(getMonthName(new Date(2024, 1, 1))).toBe('February');
      expect(getMonthName(new Date(2024, 2, 1))).toBe('March');
      expect(getMonthName(new Date(2024, 3, 1))).toBe('April');
      expect(getMonthName(new Date(2024, 4, 1))).toBe('May');
      expect(getMonthName(new Date(2024, 5, 1))).toBe('June');
      expect(getMonthName(new Date(2024, 6, 1))).toBe('July');
      expect(getMonthName(new Date(2024, 7, 1))).toBe('August');
      expect(getMonthName(new Date(2024, 8, 1))).toBe('September');
      expect(getMonthName(new Date(2024, 9, 1))).toBe('October');
      expect(getMonthName(new Date(2024, 10, 1))).toBe('November');
      expect(getMonthName(new Date(2024, 11, 1))).toBe('December');
    });

    /** Handles boundary values (0 and 11) */
    it('works regardless of day of month', () => {
      expect(getMonthName(new Date(2024, 0, 15))).toBe('January');
      expect(getMonthName(new Date(2024, 0, 31))).toBe('January');
    });
  });
});
