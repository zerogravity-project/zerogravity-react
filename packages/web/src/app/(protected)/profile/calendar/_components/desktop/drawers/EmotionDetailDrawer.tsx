'use client';

import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { EmotionId, EmotionReason } from '@zerogravity/shared/entities/emotion';
import { useIsLg } from '@zerogravity/shared/hooks';
import { cn, formatDateString, isSameDay } from '@zerogravity/shared/utils';

import { useScroll } from '@/app/_hooks/useScroll';
import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import { useCalendar } from '../../../_contexts/CalendarContext';

import SectionTitle from './common/SectionTitle';
import DrawerHeader from './header/DrawerHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import DiarySection from './sections/diary/DiarySection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dailyEmotionId?: EmotionId;
  dailyEmotionReasons?: EmotionReason[];
  diaryEntry?: string;
  momentEmotionRecords?: EmotionRecordDetail[];
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionDetailDrawer({
  isOpen,
  onClose,
  dailyEmotionId,
  dailyEmotionReasons,
  diaryEntry,
  momentEmotionRecords,
}: EmotionDetailDrawerProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  /*
   * --------------------------------------------
   * 2. External Hooks
   * --------------------------------------------
   */
  const { selectedDate } = useCalendar();
  const isOverLargeScreen = !useIsLg();

  /*
   * --------------------------------------------
   * 3. Custom Hooks
   * --------------------------------------------
   */
  const { isScrollable, isScrolling, isScrollAtBottom } = useScroll({
    scrollRef,
    enable: isOpen,
    enablePreventBackgroundScroll: isOpen && !isOverLargeScreen,
  });

  /*
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */
  /** Close drawer on Escape key press */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /** Reset exiting state when drawer opens */
  useEffect(() => {
    if (isOpen) setIsExiting(false);
  }, [isOpen]);

  /*
   * --------------------------------------------
   * 5. Derived Values
   * --------------------------------------------
   */
  const selectedDateString = formatDateString(selectedDate);
  const isToday = isSameDay(selectedDate, new Date());
  const isEmpty = dailyEmotionId === undefined;

  /** Animation variants based on screen size */
  const wrapperAnimation = isOverLargeScreen
    ? {
        initial: { width: 0 },
        animate: { width: 300 },
        exit: { width: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const } },
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring' as const, damping: 25, stiffness: 180 },
      };

  const wrapperClassName = isOverLargeScreen
    ? 'h-full flex-shrink-0 overflow-hidden'
    : 'top-topnav-height fixed right-0 z-101 h-[calc(100dvh-var(--spacing-topnav-height))] shadow-2xl';

  /*
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <AnimatePresence>
      {isOpen && (
        <m.aside
          {...wrapperAnimation}
          onAnimationStart={definition => {
            if (typeof definition === 'object' && 'width' in definition && definition.width === 0) {
              setIsExiting(true);
            }
          }}
          className={wrapperClassName}
          role="dialog"
          aria-modal="true"
          aria-label="Emotion details"
        >
          <div className="relative flex h-full w-[300px] flex-col border-l border-[var(--gray-3)] bg-[var(--gray-1)]">
            {/* Header - Fixed */}
            <div className={cn('z-10 flex-shrink-0', isScrolling && 'border-b border-[var(--gray-3)]')}>
              <DrawerHeader onClose={onClose} />
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto">
              {/* Daily Emotion */}
              <SectionTitle
                title="Daily Emotion"
                linkText={isEmpty ? 'Add' : isToday ? 'Edit' : undefined}
                href={`/record/daily?date=${selectedDateString}`}
              />
              <DailyEmotionSection
                emotionId={dailyEmotionId}
                emotionReasons={dailyEmotionReasons}
                isOpen={!isExiting}
              />

              {/* Daily Note */}
              <SectionTitle
                title="Diary"
                linkText={isEmpty ? 'Add' : isToday ? 'Edit' : undefined}
                href={isToday && !isEmpty ? `/record/daily?date=${selectedDateString}&step=diary` : undefined}
              />
              <DiarySection diaryEntry={diaryEntry} />

              {/* Moment Emotion */}
              <SectionTitle title="Moment Emotion" linkText="Add" href={`/record/moment?date=${selectedDateString}`} />
              <MomentEmotionSection momentEmotionRecords={momentEmotionRecords} />

              {/* Gradient - Only show if content is scrollable and not at bottom */}
              {isScrollable && !isScrollAtBottom && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 z-9 h-20 w-full bg-gradient-to-t from-[var(--black-a9)] to-transparent"
                />
              )}
            </div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
