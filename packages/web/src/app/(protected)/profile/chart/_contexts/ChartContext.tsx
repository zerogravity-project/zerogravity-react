'use client';

import { format, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { formatDateRange, navigatePeriod } from '../_utils/dateUtils';

export type TimePeriod = 'week' | 'month' | 'year';

interface ChartContextType {
  // Current state
  currentDate: Date;
  timePeriod: TimePeriod;
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

const ChartContext = createContext<ChartContextType | undefined>(undefined);

interface ChartProviderProps {
  children: React.ReactNode;
}

export function ChartProvider({ children }: ChartProviderProps) {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');

  // Start date for the chart
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

  // Navigation state
  const canGoNext = useMemo(() => {
    const nextDate = navigatePeriod(currentDate, timePeriod, 'next');
    return nextDate <= today;
  }, [currentDate, timePeriod, today]);

  const canGoPrevious = useMemo(() => {
    // Allow going back to reasonable past (e.g., 2 years ago)
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const prevDate = navigatePeriod(currentDate, timePeriod, 'prev');
    return prevDate >= twoYearsAgo;
  }, [currentDate, timePeriod, today]);

  // Navigation functions
  const goToNextPeriod = useCallback(() => {
    if (canGoNext) {
      setCurrentDate(prev => navigatePeriod(prev, timePeriod, 'next'));
    }
  }, [timePeriod, canGoNext]);

  const goToPreviousPeriod = useCallback(() => {
    if (canGoPrevious) {
      setCurrentDate(prev => navigatePeriod(prev, timePeriod, 'prev'));
    }
  }, [timePeriod, canGoPrevious]);

  const goToToday = useCallback(() => {
    setCurrentDate(today);
  }, [today]);

  // Helper functions
  const getFormattedDateRange = useCallback(() => {
    return formatDateRange(currentDate, timePeriod);
  }, [currentDate, timePeriod]);

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

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

export function useChart() {
  const context = useContext(ChartContext);
  if (context === undefined) {
    throw new Error('useChart must be used within a ChartProvider');
  }
  return context;
}
