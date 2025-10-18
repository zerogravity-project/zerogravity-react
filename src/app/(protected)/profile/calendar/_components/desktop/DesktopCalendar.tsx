'use client';

import { Text } from '@radix-ui/themes';
import { LayoutGroup, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { useCalendar } from '../../_contexts/CalendarContext';
import { DAYS_OF_WEEK } from '../../_utils/constants';

import DesktopCalendarCell from './cell/DesktopCalendarCell';
import EmotionDetailDrawer from './drawers/EmotionDetailDrawer';
import DesktopCalendarHeader from './header/DesktopCalendarHeader';

export default function DesktopCalendar() {
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isToday: isTodayDate, getYear, getMonth, getMonthDaysInfo, setSelectedDate } = useCalendar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = getYear();
  const month = getMonth();
  const { daysInMonth, emptyCellsBefore: emptyBefore, emptyCellsAfter: emptyAfter } = getMonthDaysInfo();

  // Empty cells for days before the first day of the month
  const emptyCellsBefore = Array.from({ length: emptyBefore }, (_, i) => (
    <div key={`empty-before-${i}`} className="h-full w-full outline outline-[0.5px] outline-[var(--gray-3)]" />
  ));

  // Days of the month
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const isCurrentDay = isTodayDate(date);
    return <DesktopCalendarCell key={day} day={day} isToday={isCurrentDay} onClick={() => handleCellClick(date)} />;
  });

  // Empty cells for days after the last day of the month
  const emptyCellsAfterMonth = Array.from({ length: emptyAfter }, (_, i) => (
    <div key={`empty-after-${i}`} className="h-full w-full outline outline-[0.5px] outline-[var(--gray-3)]" />
  ));

  const handleCellClick = (date: Date) => {
    setIsDrawerOpen(true);
    setSelectedDate(date);
  };

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg p-4">
        <Text size="2" color="gray">
          Loading...
        </Text>
      </div>
    );
  }

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
        <EmotionDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </LayoutGroup>
  );
}
