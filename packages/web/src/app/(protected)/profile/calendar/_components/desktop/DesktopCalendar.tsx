'use client';

import dynamic from 'next/dynamic';

import { Text } from '@radix-ui/themes';
import { endOfMonth, format, isAfter, startOfMonth } from 'date-fns';
import { useState } from 'react';

import { QueryErrorState } from '@/app/_components/ui/error/QueryErrorState';
import { useGetEmotionRecordsQuery } from '@/services/emotion/emotion.query';

import { DAYS_OF_WEEK } from '../../_constants/calendar.constants';
import { useCalendar } from '../../_contexts/CalendarContext';

import DesktopCalendarCell from './cell/DesktopCalendarCell';
import DesktopCalendarHeader from './header/DesktopCalendarHeader';

/** Lazy load drawer with Three.js components */
const EmotionDetailDrawer = dynamic(() => import('./drawers/EmotionDetailDrawer'), {
  ssr: false,
});

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DesktopCalendar() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { isToday, getYear, getMonth, getMonthDaysInfo, selectedDate, setSelectedDate } = useCalendar();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const year = getYear();
  const month = getMonth();
  const { daysInMonth, emptyCellsBefore: emptyBefore, emptyCellsAfter: emptyAfter } = getMonthDaysInfo();

  /** Current viewing month range (for calendar grid) */
  const currentMonthDate = new Date(year, month);
  const currentMonthStart = startOfMonth(currentMonthDate);
  const currentMonthEnd = endOfMonth(currentMonthDate);

  /** Selected date's month range (for drawer detail) */
  const selectedMonthStart = startOfMonth(selectedDate);
  const selectedMonthEnd = endOfMonth(selectedDate);

  /*
   * --------------------------------------------
   * 4. Query Hooks
   * --------------------------------------------
   */

  /** Current month data - for calendar grid display */
  const {
    data: currentMonthRecords,
    isLoading: isCurrentMonthLoading,
    isError: isCurrentMonthError,
    refetch: refetchCurrentMonth,
  } = useGetEmotionRecordsQuery({
    startDateTime: format(currentMonthStart, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(currentMonthEnd, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /** Selected date's month data - for drawer detail (uses cache if same month) */
  const { data: selectedMonthRecords } = useGetEmotionRecordsQuery({
    startDateTime: format(selectedMonthStart, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(selectedMonthEnd, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /*
   * --------------------------------------------
   * 5. Derived Values (from query)
   * --------------------------------------------
   */
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  /** Daily emotion record for selected date (from selected month's data) */
  const selectedDailyRecord = selectedMonthRecords?.data?.daily.find(
    record => format(record.createdAt, 'yyyy-MM-dd') === selectedDateString
  );

  /** Moment emotion records for selected date (from selected month's data) */
  const selectedMomentRecords = selectedMonthRecords?.data?.moment.filter(
    record => format(record.createdAt, 'yyyy-MM-dd') === selectedDateString
  );

  /*
   * --------------------------------------------
   * 6. Event Handlers
   * --------------------------------------------
   */

  /** Handle cell click - open drawer and select date */
  const handleCellClick = (date: Date) => {
    setIsDrawerOpen(true);
    setSelectedDate(date);
  };

  /*
   * --------------------------------------------
   * 7. Render Helpers
   * --------------------------------------------
   */

  /** Empty cells before the first day of the month */
  const emptyCellsBefore = Array.from({ length: emptyBefore }, (_, i) => (
    <div key={`empty-before-${i}`} className="h-full w-full outline outline-[0.5px] outline-[var(--gray-3)]" />
  ));

  /** Days of the month */
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const isAfterToday = isAfter(date, new Date());
    const dailyEmotionId = currentMonthRecords?.data?.daily.find(
      record => format(record.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )?.emotionId;

    return (
      <DesktopCalendarCell
        key={date.toISOString()}
        day={day}
        month={month}
        year={year}
        isToday={isToday(date)}
        isAfterToday={isAfterToday}
        isLoading={isCurrentMonthLoading}
        dailyEmotionId={dailyEmotionId}
        onClick={() => handleCellClick(date)}
      />
    );
  });

  /** Empty cells after the last day of the month */
  const emptyCellsAfterMonth = Array.from({ length: emptyAfter }, (_, i) => (
    <div key={`empty-after-${i}`} className="h-full w-full outline outline-[0.5px] outline-[var(--gray-3)]" />
  ));

  /*
   * --------------------------------------------
   * 8. Return
   * --------------------------------------------
   */
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full flex-1 bg-[var(--background-dark)] p-3">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[4px] border border-[var(--gray-3)] bg-[var(--gray-1)] p-3">
          {/* Header - Fixed height */}
          <DesktopCalendarHeader />

          {/* Days of week - Fixed height */}
          <div className="grid shrink-0 grid-cols-7">
            {DAYS_OF_WEEK.map(day => (
              <div
                key={day}
                className="flex items-center justify-center bg-[var(--gray-a2)] p-[4px] outline outline-[0.5px] outline-[var(--gray-3)]"
              >
                <Text size="1" weight="medium" color="gray" className="!text-[11px] !leading-[14px]">
                  {day}
                </Text>
              </div>
            ))}
          </div>

          {/* Calendar grid - Takes remaining height */}
          <div className="relative grid min-h-0 flex-1 auto-rows-fr grid-cols-7">
            {emptyCellsBefore}
            {dayCells}
            {emptyCellsAfterMonth}

            {/* Current Month Error State - Overlay */}
            {isCurrentMonthError && <QueryErrorState onRetry={refetchCurrentMonth} overlay />}
          </div>
        </div>
      </div>
      <EmotionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dailyEmotionId={selectedDailyRecord?.emotionId}
        dailyEmotionReasons={selectedDailyRecord?.reasons}
        diaryEntry={selectedDailyRecord?.diaryEntry ?? ''}
        momentEmotionRecords={selectedMomentRecords}
      />
    </div>
  );
}
