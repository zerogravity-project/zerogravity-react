/**
 * [CalendarContext tests]
 * Unit tests for calendar navigation and date selection context
 */

import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { CalendarProvider, useCalendar } from '@/app/(protected)/profile/calendar/_contexts/CalendarContext';

/*
 * ============================================
 * Test Utilities
 * ============================================
 */

/** Create wrapper with CalendarProvider */
function CalendarWrapper({ children }: { children: ReactNode }) {
  return <CalendarProvider>{children}</CalendarProvider>;
}
const createWrapper = () => CalendarWrapper;

/*
 * ============================================
 * Tests
 * ============================================
 */

describe('CalendarContext', () => {
  /*
   * --------------------------------------------
   * useCalendar hook
   * --------------------------------------------
   */
  describe('useCalendar', () => {
    /** Throws error when used outside provider */
    it('throws error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useCalendar());
      }).toThrow('useCalendar must be used within a CalendarProvider');

      consoleSpy.mockRestore();
    });

    /** Returns context when used inside provider */
    it('returns context when used inside provider', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.currentDate).toBeInstanceOf(Date);
      expect(result.current.selectedDate).toBeInstanceOf(Date);
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
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const now = new Date();
      expect(result.current.currentDate.getFullYear()).toBe(now.getFullYear());
      expect(result.current.currentDate.getMonth()).toBe(now.getMonth());
      expect(result.current.currentDate.getDate()).toBe(now.getDate());
    });

    /** Sets today as initial selectedDate */
    it('sets today as initial selectedDate', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const now = new Date();
      expect(result.current.selectedDate.getFullYear()).toBe(now.getFullYear());
      expect(result.current.selectedDate.getMonth()).toBe(now.getMonth());
      expect(result.current.selectedDate.getDate()).toBe(now.getDate());
    });

    /** Provides today reference */
    it('provides today reference', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(result.current.today).toBeInstanceOf(Date);
    });
  });

  /*
   * --------------------------------------------
   * Month navigation
   * --------------------------------------------
   */
  describe('month navigation', () => {
    /** goToNextMonth advances by one month */
    it('goToNextMonth advances by one month', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const initialMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.goToNextMonth();
      });

      const expectedMonth = (initialMonth + 1) % 12;
      expect(result.current.currentDate.getMonth()).toBe(expectedMonth);
    });

    /** goToPreviousMonth goes back by one month */
    it('goToPreviousMonth goes back by one month', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const initialMonth = result.current.currentDate.getMonth();

      act(() => {
        result.current.goToPreviousMonth();
      });

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(result.current.currentDate.getMonth()).toBe(expectedMonth);
    });

    /** Handles year boundary when going to next month from December */
    it('handles year boundary when going to next month from December', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Navigate to December
      const currentMonth = result.current.currentDate.getMonth();
      const monthsToDecember = 11 - currentMonth;

      for (let i = 0; i < monthsToDecember; i++) {
        act(() => {
          result.current.goToNextMonth();
        });
      }

      expect(result.current.currentDate.getMonth()).toBe(11);
      const yearInDecember = result.current.currentDate.getFullYear();

      // Go to next month (should be January of next year)
      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(0);
      expect(result.current.currentDate.getFullYear()).toBe(yearInDecember + 1);
    });

    /** Handles year boundary when going to previous month from January */
    it('handles year boundary when going to previous month from January', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Navigate to January
      const currentMonth = result.current.currentDate.getMonth();

      for (let i = 0; i < currentMonth; i++) {
        act(() => {
          result.current.goToPreviousMonth();
        });
      }

      expect(result.current.currentDate.getMonth()).toBe(0);
      const yearInJanuary = result.current.currentDate.getFullYear();

      // Go to previous month (should be December of previous year)
      act(() => {
        result.current.goToPreviousMonth();
      });

      expect(result.current.currentDate.getMonth()).toBe(11);
      expect(result.current.currentDate.getFullYear()).toBe(yearInJanuary - 1);
    });
  });

  /*
   * --------------------------------------------
   * Week navigation
   * --------------------------------------------
   */
  describe('week navigation', () => {
    /** goToNextWeek advances by 7 days */
    it('goToNextWeek advances by 7 days', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const initialTime = result.current.currentDate.getTime();

      act(() => {
        result.current.goToNextWeek();
      });

      const newTime = result.current.currentDate.getTime();
      const daysDiff = Math.round((newTime - initialTime) / (1000 * 60 * 60 * 24));

      expect(daysDiff).toBe(7);
    });

    /** goToPreviousWeek goes back by 7 days */
    it('goToPreviousWeek goes back by 7 days', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const initialTime = result.current.currentDate.getTime();

      act(() => {
        result.current.goToPreviousWeek();
      });

      const newTime = result.current.currentDate.getTime();
      const daysDiff = Math.round((initialTime - newTime) / (1000 * 60 * 60 * 24));

      expect(daysDiff).toBe(7);
    });

    /** Handles month boundary when navigating weeks */
    it('handles month boundary when navigating weeks', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // This test verifies week navigation works across months
      const initialMonth = result.current.currentDate.getMonth();

      // Navigate forward 5 weeks (35 days) - should cross at least one month
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.goToNextWeek();
        });
      }

      // Month should have changed (or could be same if started late in month)
      const finalMonth = result.current.currentDate.getMonth();
      const monthsAdvanced = finalMonth >= initialMonth ? finalMonth - initialMonth : finalMonth + 12 - initialMonth;

      expect(monthsAdvanced).toBeGreaterThanOrEqual(1);
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
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Navigate away from today
      act(() => {
        result.current.goToNextMonth();
        result.current.goToNextMonth();
      });

      const today = result.current.today;

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.currentDate.getFullYear()).toBe(today.getFullYear());
      expect(result.current.currentDate.getMonth()).toBe(today.getMonth());
      expect(result.current.currentDate.getDate()).toBe(today.getDate());
    });

    /** Resets selectedDate to today */
    it('resets selectedDate to today', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Select a different date
      const differentDate = new Date(2020, 5, 15);
      act(() => {
        result.current.setSelectedDate(differentDate);
      });

      expect(result.current.selectedDate.getFullYear()).toBe(2020);

      const today = result.current.today;

      act(() => {
        result.current.goToToday();
      });

      expect(result.current.selectedDate.getFullYear()).toBe(today.getFullYear());
      expect(result.current.selectedDate.getMonth()).toBe(today.getMonth());
      expect(result.current.selectedDate.getDate()).toBe(today.getDate());
    });
  });

  /*
   * --------------------------------------------
   * setSelectedDate
   * --------------------------------------------
   */
  describe('setSelectedDate', () => {
    /** Updates selectedDate */
    it('updates selectedDate', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const newDate = new Date(2024, 6, 20);

      act(() => {
        result.current.setSelectedDate(newDate);
      });

      expect(result.current.selectedDate.getFullYear()).toBe(2024);
      expect(result.current.selectedDate.getMonth()).toBe(6);
      expect(result.current.selectedDate.getDate()).toBe(20);
    });

    /** Does not affect currentDate */
    it('does not affect currentDate', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const initialCurrentDate = new Date(result.current.currentDate);
      const newDate = new Date(2024, 6, 20);

      act(() => {
        result.current.setSelectedDate(newDate);
      });

      expect(result.current.currentDate.getFullYear()).toBe(initialCurrentDate.getFullYear());
      expect(result.current.currentDate.getMonth()).toBe(initialCurrentDate.getMonth());
    });
  });

  /*
   * --------------------------------------------
   * isToday
   * --------------------------------------------
   */
  describe('isToday', () => {
    /** Returns true for today */
    it('returns true for today', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const today = new Date();
      expect(result.current.isToday(today)).toBe(true);
    });

    /** Returns false for yesterday */
    it('returns false for yesterday', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      expect(result.current.isToday(yesterday)).toBe(false);
    });

    /** Returns false for tomorrow */
    it('returns false for tomorrow', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(result.current.isToday(tomorrow)).toBe(false);
    });

    /** Returns true for today with different time */
    it('returns true for today with different time', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const todayMorning = new Date();
      todayMorning.setHours(8, 0, 0, 0);

      expect(result.current.isToday(todayMorning)).toBe(true);
    });
  });

  /*
   * --------------------------------------------
   * isSelected
   * --------------------------------------------
   */
  describe('isSelected', () => {
    /** Returns true for selected date */
    it('returns true for selected date', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Initially, today is selected
      expect(result.current.isSelected(result.current.selectedDate)).toBe(true);
    });

    /** Returns false for non-selected date */
    it('returns false for non-selected date', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const otherDate = new Date(2020, 0, 1);
      expect(result.current.isSelected(otherDate)).toBe(false);
    });

    /** Updates when selectedDate changes */
    it('updates when selectedDate changes', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const newDate = new Date(2024, 6, 20);

      act(() => {
        result.current.setSelectedDate(newDate);
      });

      expect(result.current.isSelected(newDate)).toBe(true);
    });
  });

  /*
   * --------------------------------------------
   * Helper functions
   * --------------------------------------------
   */
  describe('helper functions', () => {
    /** getMonthName returns current month name */
    it('getMonthName returns current month name', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const currentMonth = result.current.currentDate.getMonth();
      expect(result.current.getMonthName()).toBe(monthNames[currentMonth]);
    });

    /** getSelectedMonthName returns selected date month name */
    it('getSelectedMonthName returns selected date month name', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const newDate = new Date(2024, 0, 15); // January

      act(() => {
        result.current.setSelectedDate(newDate);
      });

      expect(result.current.getSelectedMonthName()).toBe('January');
    });

    /** getYear returns current year */
    it('getYear returns current year', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(result.current.getYear()).toBe(result.current.currentDate.getFullYear());
    });

    /** getMonth returns current month (0-indexed) */
    it('getMonth returns current month (0-indexed)', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      expect(result.current.getMonth()).toBe(result.current.currentDate.getMonth());
    });

    /** getWeekInfo returns month and week of month */
    it('getWeekInfo returns month and week of month', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const weekInfo = result.current.getWeekInfo();

      expect(weekInfo).toHaveProperty('month');
      expect(weekInfo).toHaveProperty('weekOfMonth');
      expect(weekInfo.month).toBeGreaterThanOrEqual(1);
      expect(weekInfo.month).toBeLessThanOrEqual(12);
      expect(weekInfo.weekOfMonth).toBeGreaterThanOrEqual(0);
      expect(weekInfo.weekOfMonth).toBeLessThanOrEqual(5);
    });

    /** getMonthDaysInfo returns calendar grid info */
    it('getMonthDaysInfo returns calendar grid info', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const monthInfo = result.current.getMonthDaysInfo();

      expect(monthInfo).toHaveProperty('firstDayOfWeek');
      expect(monthInfo).toHaveProperty('daysInMonth');
      expect(monthInfo).toHaveProperty('weeksNeeded');
      expect(monthInfo).toHaveProperty('emptyCellsBefore');
      expect(monthInfo).toHaveProperty('emptyCellsAfter');

      expect(monthInfo.firstDayOfWeek).toBeGreaterThanOrEqual(0);
      expect(monthInfo.firstDayOfWeek).toBeLessThanOrEqual(6);
      expect(monthInfo.daysInMonth).toBeGreaterThanOrEqual(28);
      expect(monthInfo.daysInMonth).toBeLessThanOrEqual(31);
      expect(monthInfo.weeksNeeded).toBeGreaterThanOrEqual(4);
      expect(monthInfo.weeksNeeded).toBeLessThanOrEqual(6);
    });
  });

  /*
   * --------------------------------------------
   * Edge cases
   * --------------------------------------------
   */
  describe('edge cases', () => {
    /** Handles rapid navigation */
    it('handles rapid navigation', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      // Rapid forward and backward
      act(() => {
        for (let i = 0; i < 24; i++) {
          result.current.goToNextMonth();
        }
        for (let i = 0; i < 24; i++) {
          result.current.goToPreviousMonth();
        }
      });

      // Should be back to approximately the same month
      const today = new Date();
      expect(result.current.currentDate.getMonth()).toBe(today.getMonth());
    });

    /** Handles selecting past dates */
    it('handles selecting past dates', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const pastDate = new Date(2000, 0, 1);

      act(() => {
        result.current.setSelectedDate(pastDate);
      });

      expect(result.current.selectedDate.getFullYear()).toBe(2000);
    });

    /** Handles selecting future dates */
    it('handles selecting future dates', () => {
      const { result } = renderHook(() => useCalendar(), {
        wrapper: createWrapper(),
      });

      const futureDate = new Date(2050, 11, 31);

      act(() => {
        result.current.setSelectedDate(futureDate);
      });

      expect(result.current.selectedDate.getFullYear()).toBe(2050);
    });
  });
});
