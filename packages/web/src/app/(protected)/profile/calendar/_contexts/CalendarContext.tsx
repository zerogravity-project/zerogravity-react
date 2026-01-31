/**
 * [CalendarContext]
 * State management for emotion calendar navigation and selection
 */

'use client';

import { addDays, addMonths, format } from 'date-fns';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useMediaQuery } from '@zerogravity/shared/hooks';
import { isSameDay } from '@zerogravity/shared/utils';

import { getMonthInfo as getMonthInfoUtil, getWeekOfMonth } from '../_utils/dateUtils';

/*
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

  /** Navigation functions */
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToToday: () => void;
  setSelectedDate: (date: Date) => void;

  /** Helper functions */
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

/*
 * ============================================
 * Context
 * ============================================
 *
 * Calendar navigation and date selection state
 * Manages month/week views and selected date
 */

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

/*
 * ============================================
 * Provider
 * ============================================
 *
 * Provides calendar navigation and date selection
 * Handles month/week calculations and date helpers
 *
 * @param children - Child components to wrap
 */
export function CalendarProvider({ children }: CalendarProviderProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const isMobile = useMediaQuery('(max-width: 480px)');
  const prevIsMobileRef = useRef(isMobile);

  /*
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */

  /** Sync currentDate to selectedDate on viewport change (PC ↔ Mobile) */
  useEffect(() => {
    if (prevIsMobileRef.current !== isMobile) {
      setCurrentDate(selectedDate);
      prevIsMobileRef.current = isMobile;
    }
  }, [isMobile, selectedDate]);

  /*
   * --------------------------------------------
   * 3. Callbacks - Navigation
   * --------------------------------------------
   */

  /** Navigate to next month */
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  /** Navigate to previous month */
  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, -1));
  }, []);

  /** Navigate to next week */
  const goToNextWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, 7));
  }, []);

  /** Navigate to previous week */
  const goToPreviousWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, -7));
  }, []);

  /** Navigate to today and select it */
  const goToToday = useCallback(() => {
    setCurrentDate(today);
    setSelectedDate(today);
  }, [today]);

  /*
   * --------------------------------------------
   * 4. Callbacks - Helpers
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
    return format(currentDate, 'MMMM');
  }, [currentDate]);

  /** Get current year */
  const getYear = useCallback(() => currentDate.getFullYear(), [currentDate]);

  /** Get current month (0-indexed) */
  const getMonth = useCallback(() => currentDate.getMonth(), [currentDate]);

  /** Get selected date's month name */
  const getSelectedMonthName = useCallback(() => {
    return format(selectedDate, 'MMMM');
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

  /*
   * --------------------------------------------
   * 5. Context Value
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

  /*
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

/*
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
