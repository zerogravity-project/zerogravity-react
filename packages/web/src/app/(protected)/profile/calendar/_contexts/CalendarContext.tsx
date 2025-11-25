'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { isSameDay } from '@zerogravity/shared/utils';

import { MONTH_NAMES } from '../_constants/calendar.constants';
import { getMonthInfo as getMonthInfoUtil, getWeekOfMonth } from '../_utils/dateUtils';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MonthDaysInfo {
  firstDayOfWeek: number;
  daysInMonth: number;
  weeksNeeded: number;
  emptyCellsBefore: number;
  emptyCellsAfter: number;
}

interface CalendarContextType {
  /** Current displayed date for calendar navigation */
  currentDate: Date;
  /** User selected date */
  selectedDate: Date;
  /** Today's date */
  today: Date;

  // Navigation
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  setSelectedDate: (date: Date) => void;

  // Helper functions
  isToday: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  getMonthName: () => string;
  getSelectedMonthName: () => string;
  getYear: () => number;
  getMonth: () => number;
  getWeekInfo: () => { month: number; weekOfMonth: number };
  getMonthDaysInfo: () => MonthDaysInfo;
}

interface CalendarProviderProps {
  children: React.ReactNode;
}

/**
 * ============================================
 * Context
 * ============================================
 */

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

/**
 * ============================================
 * Provider
 * ============================================
 */

export function CalendarProvider({ children }: CalendarProviderProps) {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  /**
   * --------------------------------------------
   * 2. Callbacks - Navigation
   * --------------------------------------------
   */

  /** Navigate to next month */
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  }, []);

  /** Navigate to previous month */
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const prevDate = new Date(prev);
      prevDate.setMonth(prev.getMonth() - 1);
      return prevDate;
    });
  }, []);

  /** Navigate to next week */
  const goToNextWeek = useCallback(() => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  }, []);

  /** Navigate to previous week */
  const goToPreviousWeek = useCallback(() => {
    setCurrentDate(prev => {
      const prevDate = new Date(prev);
      prevDate.setDate(prev.getDate() - 7);
      return prevDate;
    });
  }, []);

  /** Navigate to today and select it */
  const goToToday = useCallback(() => {
    setCurrentDate(today);
    setSelectedDate(today);
  }, [today]);

  /**
   * --------------------------------------------
   * 3. Callbacks - Helpers
   * --------------------------------------------
   */

  /** Check if given date is today */
  const isToday = useCallback(
    (date: Date) => {
      return isSameDay(date, today);
    },
    [today]
  );

  /** Check if given date is selected */
  const isSelected = useCallback(
    (date: Date) => {
      return isSameDay(date, selectedDate);
    },
    [selectedDate]
  );

  /** Get current month name */
  const getMonthName = useCallback(() => {
    return MONTH_NAMES[currentDate.getMonth()];
  }, [currentDate]);

  /** Get current year */
  const getYear = useCallback(() => currentDate.getFullYear(), [currentDate]);

  /** Get current month (0-indexed) */
  const getMonth = useCallback(() => currentDate.getMonth(), [currentDate]);

  /** Get selected date's month name */
  const getSelectedMonthName = useCallback(() => {
    return MONTH_NAMES[selectedDate.getMonth()];
  }, [selectedDate]);

  /** Get week info for current date */
  const getWeekInfo = useCallback(() => {
    const month = currentDate.getMonth() + 1;
    const weekOfMonth = getWeekOfMonth(currentDate);
    return { month, weekOfMonth };
  }, [currentDate]);

  /** Get month days info for calendar grid */
  const getMonthDaysInfo = useCallback((): MonthDaysInfo => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const info = getMonthInfoUtil(year, month);

    return {
      firstDayOfWeek: info.firstDayOfWeek,
      daysInMonth: info.daysInMonth,
      weeksNeeded: info.weeksNeeded,
      emptyCellsBefore: info.emptyCellsBefore,
      emptyCellsAfter: info.emptyCellsAfter,
    };
  }, [currentDate]);

  /**
   * --------------------------------------------
   * 4. Context Value
   * --------------------------------------------
   */
  const value = useMemo(
    () => ({
      currentDate,
      selectedDate,
      today,
      goToNextMonth,
      goToPreviousMonth,
      goToNextWeek,
      goToPreviousWeek,
      goToToday,
      setSelectedDate,
      isToday,
      isSelected,
      getMonthName,
      getSelectedMonthName,
      getYear,
      getMonth,
      getWeekInfo,
      getMonthDaysInfo,
    }),
    [
      currentDate,
      selectedDate,
      today,
      goToNextMonth,
      goToPreviousMonth,
      goToNextWeek,
      goToPreviousWeek,
      goToToday,
      isToday,
      isSelected,
      getMonthName,
      getSelectedMonthName,
      getYear,
      getMonth,
      getWeekInfo,
      getMonthDaysInfo,
    ]
  );

  /**
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

/**
 * ============================================
 * Custom Hook
 * ============================================
 */

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
