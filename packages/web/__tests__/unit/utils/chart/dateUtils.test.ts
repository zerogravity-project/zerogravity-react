/**
 * [chart dateUtils tests]
 * Unit tests for chart date range utilities
 */

import {
  formatDateRange,
  getMonthRange,
  getWeekRange,
  getYearRange,
  navigatePeriod,
} from '@/app/(protected)/profile/chart/_utils/dateUtils';

describe('chart dateUtils', () => {
  describe('getWeekRange', () => {
    /** Returns Sunday to Saturday for mid-week date */
    it('returns Sunday to Saturday range', () => {
      // Wednesday Dec 18, 2024
      const date = new Date(2024, 11, 18);
      const { start, end } = getWeekRange(date);

      expect(start.getDay()).toBe(0); // Sunday
      expect(end.getDay()).toBe(6); // Saturday
    });

    /** Returns correct range when date is Sunday */
    it('handles date that is Sunday', () => {
      // Sunday Dec 15, 2024
      const date = new Date(2024, 11, 15);
      const { start, end } = getWeekRange(date);

      expect(start.getDate()).toBe(15);
      expect(end.getDate()).toBe(21);
    });

    /** Returns correct range when date is Saturday */
    it('handles date that is Saturday', () => {
      // Saturday Dec 21, 2024
      const date = new Date(2024, 11, 21);
      const { start, end } = getWeekRange(date);

      expect(start.getDate()).toBe(15);
      expect(end.getDate()).toBe(21);
    });

    /** Handles week spanning two months */
    it('handles week spanning two months', () => {
      // Monday Dec 30, 2024 - week spans Dec/Jan
      const date = new Date(2024, 11, 30);
      const { start, end } = getWeekRange(date);

      expect(start.getMonth()).toBe(11); // December
      expect(end.getMonth()).toBe(0); // January
      expect(end.getFullYear()).toBe(2025);
    });

    /** Handles week spanning two years */
    it('handles week spanning two years', () => {
      // Tuesday Dec 31, 2024
      const date = new Date(2024, 11, 31);
      const { start, end } = getWeekRange(date);

      expect(start.getFullYear()).toBe(2024);
      expect(end.getFullYear()).toBe(2025);
    });
  });

  describe('getMonthRange', () => {
    /** Returns first and last day of month */
    it('returns first and last day of month', () => {
      // Any day in December 2024
      const date = new Date(2024, 11, 15);
      const { start, end } = getMonthRange(date);

      expect(start.getDate()).toBe(1);
      expect(end.getDate()).toBe(31);
    });

    /** Handles 30-day months */
    it('handles 30-day month', () => {
      // November 2024
      const date = new Date(2024, 10, 15);
      const { start, end } = getMonthRange(date);

      expect(start.getDate()).toBe(1);
      expect(end.getDate()).toBe(30);
    });

    /** Handles February in leap year */
    it('handles February in leap year', () => {
      // February 2024 (leap year)
      const date = new Date(2024, 1, 15);
      const { start, end } = getMonthRange(date);

      expect(start.getDate()).toBe(1);
      expect(end.getDate()).toBe(29);
    });

    /** Handles February in non-leap year */
    it('handles February in non-leap year', () => {
      // February 2023
      const date = new Date(2023, 1, 15);
      const { start, end } = getMonthRange(date);

      expect(start.getDate()).toBe(1);
      expect(end.getDate()).toBe(28);
    });
  });

  describe('getYearRange', () => {
    /** Returns Jan 1 to Dec 31 */
    it('returns Jan 1 to Dec 31', () => {
      const date = new Date(2024, 5, 15);
      const { start, end } = getYearRange(date);

      expect(start.getMonth()).toBe(0);
      expect(start.getDate()).toBe(1);
      expect(end.getMonth()).toBe(11);
      expect(end.getDate()).toBe(31);
    });

    /** Handles leap year */
    it('preserves year', () => {
      const date = new Date(2024, 0, 1);
      const { start, end } = getYearRange(date);

      expect(start.getFullYear()).toBe(2024);
      expect(end.getFullYear()).toBe(2024);
    });
  });

  describe('formatDateRange', () => {
    describe('week period', () => {
      /** Formats week range within same month */
      it('formats as "MMM d - MMM d, yyyy"', () => {
        const date = new Date(2024, 11, 18);
        const result = formatDateRange(date, 'week');

        expect(result).toMatch(/Dec \d+ - Dec \d+, 2024/);
      });

      /** Formats week range spanning two months */
      it('handles week spanning months', () => {
        const date = new Date(2024, 11, 30);
        const result = formatDateRange(date, 'week');

        expect(result).toMatch(/Dec \d+ - Jan \d+, 2025/);
      });
    });

    describe('month period', () => {
      /** Formats month range */
      it('formats as "MMMM yyyy"', () => {
        const date = new Date(2024, 11, 15);
        const result = formatDateRange(date, 'month');

        expect(result).toBe('December 2024');
      });
    });

    describe('year period', () => {
      /** Formats year range */
      it('formats as "yyyy"', () => {
        const date = new Date(2024, 5, 15);
        const result = formatDateRange(date, 'year');

        expect(result).toBe('2024');
      });
    });

    /** Returns empty string for invalid period */
    it('returns empty string for invalid period', () => {
      const date = new Date(2024, 5, 15);
      const result = formatDateRange(date, 'invalid' as any);

      expect(result).toBe('');
    });
  });

  describe('navigatePeriod', () => {
    describe('week navigation', () => {
      /** Navigates to next week */
      it('navigates to next week (+7 days)', () => {
        const date = new Date(2024, 11, 15);
        const result = navigatePeriod(date, 'week', 'next');

        expect(result.getDate()).toBe(22);
        expect(result.getMonth()).toBe(11);
      });

      /** Navigates to previous week */
      it('navigates to previous week (-7 days)', () => {
        const date = new Date(2024, 11, 15);
        const result = navigatePeriod(date, 'week', 'prev');

        expect(result.getDate()).toBe(8);
        expect(result.getMonth()).toBe(11);
      });

      /** Handles month boundary */
      it('handles month boundary when navigating forward', () => {
        const date = new Date(2024, 11, 30);
        const result = navigatePeriod(date, 'week', 'next');

        expect(result.getMonth()).toBe(0); // January
        expect(result.getFullYear()).toBe(2025);
      });

      /** Handles month boundary when navigating backward */
      it('handles month boundary when navigating backward', () => {
        const date = new Date(2024, 0, 3);
        const result = navigatePeriod(date, 'week', 'prev');

        expect(result.getMonth()).toBe(11); // December
        expect(result.getFullYear()).toBe(2023);
      });
    });

    describe('month navigation', () => {
      /** Navigates to next month */
      it('navigates to next month', () => {
        const date = new Date(2024, 11, 15);
        const result = navigatePeriod(date, 'month', 'next');

        expect(result.getMonth()).toBe(0); // January
        expect(result.getFullYear()).toBe(2025);
      });

      /** Navigates to previous month */
      it('navigates to previous month', () => {
        const date = new Date(2024, 0, 15);
        const result = navigatePeriod(date, 'month', 'prev');

        expect(result.getMonth()).toBe(11); // December
        expect(result.getFullYear()).toBe(2023);
      });

      /** Handles year boundary */
      it('handles end of month date (31st to 30-day month)', () => {
        const date = new Date(2024, 0, 31); // Jan 31
        const result = navigatePeriod(date, 'month', 'next');

        // date-fns addMonths handles this - Feb doesn't have 31 days
        expect(result.getMonth()).toBe(1); // February
      });
    });

    describe('year navigation', () => {
      /** Navigates to next year */
      it('navigates to next year', () => {
        const date = new Date(2024, 5, 15);
        const result = navigatePeriod(date, 'year', 'next');

        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(5);
      });

      /** Navigates to previous year */
      it('navigates to previous year', () => {
        const date = new Date(2024, 5, 15);
        const result = navigatePeriod(date, 'year', 'prev');

        expect(result.getFullYear()).toBe(2023);
        expect(result.getMonth()).toBe(5);
      });

      /** Handles Feb 29 leap year to non-leap year */
      it('handles Feb 29 leap year to non-leap year', () => {
        const date = new Date(2024, 1, 29); // Feb 29, 2024
        const result = navigatePeriod(date, 'year', 'next');

        // 2025 is not a leap year
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(1); // February
      });
    });

    /** Returns same date for invalid period */
    it('returns same date for invalid period', () => {
      const date = new Date(2024, 5, 15);
      const result = navigatePeriod(date, 'invalid' as any, 'next');

      expect(result.getTime()).toBe(date.getTime());
    });
  });
});
