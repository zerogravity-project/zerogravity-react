'use client';

import { format, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { formatDateRange, navigatePeriod } from '../_utils/dateUtils';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

export type TimePeriod = 'week' | 'month' | 'year';

interface ChartContextType {
  /** Current date for chart navigation */
  currentDate: Date;
  /** Selected time period (week/month/year) */
  timePeriod: TimePeriod;
  /** Start date string in YYYY-MM-DD format */
  startDate: string;

  // Navigation
  goToNextPeriod: () => void;
  goToPreviousPeriod: () => void;
  goToToday: () => void;
  setTimePeriod: (period: TimePeriod) => void;
  setCurrentDate: (date: Date) => void;

  // Navigation state
  canGoNext: boolean;
  canGoPrevious: boolean;

  // Helper functions
  getFormattedDateRange: () => string;
  getTotalEntries: () => number;
}

interface ChartProviderProps {
  children: React.ReactNode;
}

/**
 * ============================================
 * Context
 * ============================================
 */

const ChartContext = createContext<ChartContextType | undefined>(undefined);

/**
 * ============================================
 * Provider
 * ============================================
 */

export function ChartProvider({ children }: ChartProviderProps) {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  /**
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */

  /** Calculate start date based on time period */
  const startDate = useMemo(() => {
    switch (timePeriod) {
      case 'week':
        return format(startOfWeek(currentDate), 'yyyy-MM-dd');
      case 'month':
        return format(startOfMonth(currentDate), 'yyyy-MM-dd');
      case 'year':
        return format(startOfYear(currentDate), 'yyyy-MM-dd');
      default:
        return format(currentDate, 'yyyy-MM-dd');
    }
  }, [currentDate, timePeriod]);

  /** Check if can navigate to next period */
  const canGoNext = useMemo(() => {
    const nextDate = navigatePeriod(currentDate, timePeriod, 'next');
    return nextDate <= today;
  }, [currentDate, timePeriod, today]);

  /** Check if can navigate to previous period (up to 2 years ago) */
  const canGoPrevious = useMemo(() => {
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const prevDate = navigatePeriod(currentDate, timePeriod, 'prev');
    return prevDate >= twoYearsAgo;
  }, [currentDate, timePeriod, today]);

  /**
   * --------------------------------------------
   * 3. Callbacks - Navigation
   * --------------------------------------------
   */

  /** Navigate to next period */
  const goToNextPeriod = useCallback(() => {
    if (canGoNext) {
      setCurrentDate(prev => navigatePeriod(prev, timePeriod, 'next'));
    }
  }, [timePeriod, canGoNext]);

  /** Navigate to previous period */
  const goToPreviousPeriod = useCallback(() => {
    if (canGoPrevious) {
      setCurrentDate(prev => navigatePeriod(prev, timePeriod, 'prev'));
    }
  }, [timePeriod, canGoPrevious]);

  /** Navigate to today */
  const goToToday = useCallback(() => {
    setCurrentDate(today);
  }, [today]);

  /**
   * --------------------------------------------
   * 4. Callbacks - Helpers
   * --------------------------------------------
   */

  /** Get formatted date range string for display */
  const getFormattedDateRange = useCallback(() => {
    return formatDateRange(currentDate, timePeriod);
  }, [currentDate, timePeriod]);

  /** Get total number of entries for current time period */
  const getTotalEntries = useCallback(() => {
    switch (timePeriod) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'year':
        return 365;
      default:
        return 7;
    }
  }, [timePeriod]);

  /**
   * --------------------------------------------
   * 5. Context Value
   * --------------------------------------------
   */
  const value = useMemo(
    () => ({
      currentDate,
      timePeriod,
      startDate,
      goToNextPeriod,
      goToPreviousPeriod,
      goToToday,
      setTimePeriod,
      setCurrentDate,
      canGoNext,
      canGoPrevious,
      getFormattedDateRange,
      getTotalEntries,
    }),
    [
      currentDate,
      timePeriod,
      startDate,
      goToNextPeriod,
      goToPreviousPeriod,
      goToToday,
      canGoNext,
      canGoPrevious,
      getFormattedDateRange,
      getTotalEntries,
    ]
  );

  /**
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

/**
 * ============================================
 * Custom Hook
 * ============================================
 */

export function useChart() {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
}
