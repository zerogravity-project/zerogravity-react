/**
 * [ChartContext tests]
 * Unit tests for chart period navigation and date range management
 */

import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ChartProvider, useChart } from '@/app/(protected)/profile/chart/_contexts/ChartContext';

/*
 * ============================================
 * Test Utilities
 * ============================================
 */

/** Create wrapper with ChartProvider */
function ChartWrapper({ children }: { children: ReactNode }) {
  return <ChartProvider>{children}</ChartProvider>;
}
const createWrapper = () => ChartWrapper;

/*
 * ============================================
 * Tests
 * ============================================
 */

describe('ChartContext', () => {
  /*
   * --------------------------------------------
   * useChart hook
   * --------------------------------------------
   */
  describe('useChart', () => {
    /** Throws error when used outside provider */
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useChart());
      }).toThrow('useChart must be used within a ChartProvider');

      consoleSpy.mockRestore();
    });

    /** Returns context when used inside provider */
    it('returns context when used inside provider', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.currentDate).toBeInstanceOf(Date);
      expect(result.current.timePeriod).toBeDefined();
    });
  });

  /*
   * --------------------------------------------
   * Initial state
   * --------------------------------------------
   */
  describe('initial state', () => {
    /** Sets today as initial currentDate */
    it('sets today as initial currentDate', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const now = new Date();
      expect(result.current.currentDate.getFullYear()).toBe(now.getFullYear());
      expect(result.current.currentDate.getMonth()).toBe(now.getMonth());
      expect(result.current.currentDate.getDate()).toBe(now.getDate());
    });

    /** Sets week as initial timePeriod */
    it('sets week as initial timePeriod', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      expect(result.current.timePeriod).toBe('week');
    });

    /** Calculates startDate based on timePeriod */
    it('calculates startDate based on timePeriod', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // startDate should be YYYY-MM-DD format
      expect(result.current.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  /*
   * --------------------------------------------
   * TimePeriod changes
   * --------------------------------------------
   */
  describe('timePeriod', () => {
    /** setTimePeriod updates timePeriod to month */
    it('setTimePeriod updates timePeriod to month', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('month');
      });

      expect(result.current.timePeriod).toBe('month');
    });

    /** setTimePeriod updates timePeriod to year */
    it('setTimePeriod updates timePeriod to year', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('year');
      });

      expect(result.current.timePeriod).toBe('year');
    });

    /** startDate updates when timePeriod changes */
    it('startDate updates when timePeriod changes', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const weekStartDate = result.current.startDate;

      act(() => {
        result.current.setTimePeriod('month');
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _monthStartDate = result.current.startDate;

      act(() => {
        result.current.setTimePeriod('year');
      });

      const yearStartDate = result.current.startDate;

      // All should be different (unless edge case at period boundary)
      // At minimum, year start should be different from week start
      expect(yearStartDate).not.toBe(weekStartDate);
    });
  });

  /*
   * --------------------------------------------
   * Period navigation
   * --------------------------------------------
   */
  describe('period navigation', () => {
    /** goToPreviousPeriod moves back by one period */
    it('goToPreviousPeriod moves back by one period', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const initialDate = new Date(result.current.currentDate);

      act(() => {
        result.current.goToPreviousPeriod();
      });

      // Week period - should be 7 days earlier
      const daysDiff = Math.round(
        (initialDate.getTime() - result.current.currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(7);
    });

    /** goToPreviousPeriod moves back by month when in month period */
    it('goToPreviousPeriod moves back by month when in month period', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('month');
      });

      const initialMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.goToPreviousPeriod();
      });

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(result.current.currentDate.getMonth()).toBe(expectedMonth);
    });

    /** goToPreviousPeriod moves back by year when in year period */
    it('goToPreviousPeriod moves back by year when in year period', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('year');
      });

      const initialYear = result.current.currentDate.getFullYear();

      act(() => {
        result.current.goToPreviousPeriod();
      });

      expect(result.current.currentDate.getFullYear()).toBe(initialYear - 1);
    });

    /** canGoNext is false when at current period (today) */
    it('canGoNext is false when at current period (today)', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Initially at today, so can't go next
      expect(result.current.canGoNext).toBe(false);
    });

    /** canGoNext is true after going to previous period */
    it('canGoNext is true after going to previous period', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.goToPreviousPeriod();
      });

      expect(result.current.canGoNext).toBe(true);
    });

    /** goToNextPeriod does not advance when canGoNext is false */
    it('goToNextPeriod does not advance when canGoNext is false', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const initialDate = new Date(result.current.currentDate);

      act(() => {
        result.current.goToNextPeriod();
      });

      // Should stay at same date
      expect(result.current.currentDate.getTime()).toBe(initialDate.getTime());
    });

    /** goToNextPeriod advances when canGoNext is true */
    it('goToNextPeriod advances when canGoNext is true', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Go back first
      act(() => {
        result.current.goToPreviousPeriod();
      });

      const dateAfterPrev = new Date(result.current.currentDate);

      act(() => {
        result.current.goToNextPeriod();
      });

      // Should advance by 7 days
      const daysDiff = Math.round(
        (result.current.currentDate.getTime() - dateAfterPrev.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(daysDiff).toBe(7);
    });

    /** canGoPrevious is true initially */
    it('canGoPrevious is true initially', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canGoPrevious).toBe(true);
    });

    /** canGoPrevious becomes false near 2 year limit */
    it('canGoPrevious becomes false near 2 year limit', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Set to year period and go back 2 years
      act(() => {
        result.current.setTimePeriod('year');
      });

      act(() => {
        result.current.goToPreviousPeriod();
        result.current.goToPreviousPeriod();
      });

      // Should be at or near 2 year limit
      expect(result.current.canGoPrevious).toBe(false);
    });
  });

  /*
   * --------------------------------------------
   * goToToday
   * --------------------------------------------
   */
  describe('goToToday', () => {
    /** Resets currentDate to today */
    it('resets currentDate to today', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Navigate away from today
      act(() => {
        result.current.goToPreviousPeriod();
        result.current.goToPreviousPeriod();
      });

      const today = new Date();

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.currentDate.getFullYear()).toBe(today.getFullYear());
      expect(result.current.currentDate.getMonth()).toBe(today.getMonth());
      expect(result.current.currentDate.getDate()).toBe(today.getDate());
    });

    /** Resets canGoNext to false */
    it('resets canGoNext to false', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Go back then forward to today
      act(() => {
        result.current.goToPreviousPeriod();
      });

      expect(result.current.canGoNext).toBe(true);

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.canGoNext).toBe(false);
    });
  });

  /*
   * --------------------------------------------
   * setCurrentDate
   * --------------------------------------------
   */
  describe('setCurrentDate', () => {
    /** Updates currentDate directly */
    it('updates currentDate directly', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const targetDate = new Date(2024, 5, 15);

      act(() => {
        result.current.setCurrentDate(targetDate);
      });

      expect(result.current.currentDate.getFullYear()).toBe(2024);
      expect(result.current.currentDate.getMonth()).toBe(5);
      expect(result.current.currentDate.getDate()).toBe(15);
    });

    /** Recalculates startDate when currentDate changes */
    it('recalculates startDate when currentDate changes', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      const initialStartDate = result.current.startDate;

      act(() => {
        result.current.setCurrentDate(new Date(2024, 0, 15));
      });

      expect(result.current.startDate).not.toBe(initialStartDate);
    });
  });

  /*
   * --------------------------------------------
   * Helper functions
   * --------------------------------------------
   */
  describe('helper functions', () => {
    describe('getFormattedDateRange', () => {
      /** Returns formatted date range string */
      it('returns formatted date range string', () => {
        const { result } = renderHook(() => useChart(), {
          wrapper: createWrapper(),
        });

        const range = result.current.getFormattedDateRange();

        // Should return non-empty string
        expect(typeof range).toBe('string');
        expect(range.length).toBeGreaterThan(0);
      });

      /** Format changes based on timePeriod */
      it('format changes based on timePeriod', () => {
        const { result } = renderHook(() => useChart(), {
          wrapper: createWrapper(),
        });

        const weekRange = result.current.getFormattedDateRange();

        act(() => {
          result.current.setTimePeriod('year');
        });

        const yearRange = result.current.getFormattedDateRange();

        // Formats should be different
        expect(yearRange).not.toBe(weekRange);
      });
    });

    describe('getTotalEntries', () => {
      /** Returns 7 for week period */
      it('returns 7 for week period', () => {
        const { result } = renderHook(() => useChart(), {
          wrapper: createWrapper(),
        });

        expect(result.current.getTotalEntries()).toBe(7);
      });

      /** Returns 30 for month period */
      it('returns 30 for month period', () => {
        const { result } = renderHook(() => useChart(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.setTimePeriod('month');
        });

        expect(result.current.getTotalEntries()).toBe(30);
      });

      /** Returns 365 for year period */
      it('returns 365 for year period', () => {
        const { result } = renderHook(() => useChart(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.setTimePeriod('year');
        });

        expect(result.current.getTotalEntries()).toBe(365);
      });
    });
  });

  /*
   * --------------------------------------------
   * startDate calculation
   * --------------------------------------------
   */
  describe('startDate calculation', () => {
    /** Week startDate is beginning of week */
    it('week startDate is beginning of week', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Set to a known date
      act(() => {
        result.current.setCurrentDate(new Date(2024, 0, 15)); // Monday Jan 15, 2024
      });

      // Week starts on Sunday, so should be Jan 14, 2024
      expect(result.current.startDate).toBe('2024-01-14');
    });

    /** Month startDate is first of month */
    it('month startDate is first of month', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setCurrentDate(new Date(2024, 5, 15)); // June 15, 2024
        result.current.setTimePeriod('month');
      });

      expect(result.current.startDate).toBe('2024-06-01');
    });

    /** Year startDate is January 1st */
    it('year startDate is January 1st', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setCurrentDate(new Date(2024, 5, 15)); // June 15, 2024
        result.current.setTimePeriod('year');
      });

      expect(result.current.startDate).toBe('2024-01-01');
    });
  });

  /*
   * --------------------------------------------
   * Edge cases
   * --------------------------------------------
   */
  describe('edge cases', () => {
    /** Handles rapid period switching */
    it('handles rapid period switching', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('month');
        result.current.setTimePeriod('year');
        result.current.setTimePeriod('week');
        result.current.setTimePeriod('month');
      });

      expect(result.current.timePeriod).toBe('month');
    });

    /** Handles navigation at period boundaries */
    it('handles navigation at period boundaries', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      // Set to end of December
      act(() => {
        result.current.setTimePeriod('month');
        result.current.setCurrentDate(new Date(2024, 11, 31)); // Dec 31, 2024
      });

      act(() => {
        result.current.goToPreviousPeriod();
      });

      // Should be November
      expect(result.current.currentDate.getMonth()).toBe(10);
    });

    /** Maintains timePeriod when navigating */
    it('maintains timePeriod when navigating', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('month');
      });

      act(() => {
        result.current.goToPreviousPeriod();
        result.current.goToPreviousPeriod();
      });

      expect(result.current.timePeriod).toBe('month');
    });

    /** goToToday preserves timePeriod */
    it('goToToday preserves timePeriod', () => {
      const { result } = renderHook(() => useChart(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTimePeriod('year');
        result.current.goToPreviousPeriod();
      });

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.timePeriod).toBe('year');
    });
  });
});
