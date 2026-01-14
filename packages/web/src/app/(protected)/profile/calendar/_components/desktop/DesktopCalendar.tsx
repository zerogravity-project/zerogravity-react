'use client';

import { Text } from '@radix-ui/themes';
import { endOfMonth, format, isAfter, startOfMonth } from 'date-fns';
import { LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';

import { useGetEmotionRecordsQuery } from '@/services/emotion/emotion.query';

import { DAYS_OF_WEEK } from '../../_constants/calendar.constants';
import { useCalendar } from '../../_contexts/CalendarContext';

import DesktopCalendarCell from './cell/DesktopCalendarCell';
import EmotionDetailDrawer from './drawers/EmotionDetailDrawer';
import DesktopCalendarHeader from './header/DesktopCalendarHeader';

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

  const currentMonthDate = new Date(year, month);
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);

  /*
   * --------------------------------------------
   * 4. Query Hooks
   * --------------------------------------------
   */
  const { data: currentMonthEmotionRecords, isLoading: isMonthDataLoading } = useGetEmotionRecordsQuery({
    startDateTime: format(monthStart, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(monthEnd, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /*
   * --------------------------------------------
   * 5. Derived Values (from query)
   * --------------------------------------------
   */
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  /** Daily emotion record for selected date */
  const selectedDailyRecord = currentMonthEmotionRecords?.data?.daily.find(
    record => format(record.createdAt, 'yyyy-MM-dd') === selectedDateString
  );

  /** Moment emotion records for selected date */
  const selectedMomentRecords = currentMonthEmotionRecords?.data?.moment.filter(
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
    const dailyEmotionId = currentMonthEmotionRecords?.data?.daily.find(
      record => format(record.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )?.emotionId;

    return (
      <DesktopCalendarCell
        key={day}
        day={day}
        isToday={isToday(date)}
        isAfterToday={isAfterToday}
        isLoading={isMonthDataLoading}
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
    <LayoutGroup>
      <div className="flex h-full w-full">
        <motion.div
          layout
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex h-full flex-1 bg-[var(--background-dark)] p-3"
        >
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
            <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-7">
              {emptyCellsBefore}
              {dayCells}
              {emptyCellsAfterMonth}
            </div>
          </div>
        </motion.div>
        <EmotionDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          dailyEmotionId={selectedDailyRecord?.emotionId}
          dailyEmotionReasons={selectedDailyRecord?.reasons}
          diaryEntry={selectedDailyRecord?.diaryEntry ?? ''}
          momentEmotionRecords={selectedMomentRecords}
        />
      </div>
    </LayoutGroup>
  );
}
