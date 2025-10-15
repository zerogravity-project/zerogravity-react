'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { MONTH_NAMES } from '../_utils/constants';
import { getMonthInfo as getMonthInfoUtil, getWeekOfMonth, isSameDay } from '../_utils/dateUtils';

interface MonthDaysInfo {
  firstDayOfWeek: number;
  daysInMonth: number;
  weeksNeeded: number;
  emptyCellsBefore: number;
  emptyCellsAfter: number;
}

interface CalendarContextType {
  // Current state
  currentDate: Date;
  selectedDate: Date;
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

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: React.ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Navigation functions
  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + 1);
      return next;
    });
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => {
      const prevDate = new Date(prev);
      prevDate.setMonth(prev.getMonth() - 1);
      return prevDate;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate(prev => {
      const prevDate = new Date(prev);
      prevDate.setDate(prev.getDate() - 7);
      return prevDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  // Helper functions
  const isToday = useCallback((date: Date) => {
    return isSameDay(date, today);
  }, []);

  const isSelected = useCallback(
    (date: Date) => {
      return isSameDay(date, selectedDate);
    },
    [selectedDate]
  );

  const getMonthName = useCallback(() => {
    return MONTH_NAMES[currentDate.getMonth()];
  }, [currentDate]);

  const getYear = useCallback(() => currentDate.getFullYear(), [currentDate]);
  const getMonth = useCallback(() => currentDate.getMonth(), [currentDate]);

  const getSelectedMonthName = useCallback(() => {
    return MONTH_NAMES[selectedDate.getMonth()];
  }, [selectedDate]);

  const getWeekInfo = useCallback(() => {
    const month = currentDate.getMonth() + 1;
    const weekOfMonth = getWeekOfMonth(currentDate);
    return { month, weekOfMonth };
  }, [currentDate]);

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

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
