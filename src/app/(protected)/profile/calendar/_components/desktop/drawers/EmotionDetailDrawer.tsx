'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef } from 'react';

import { useIsLg } from '@/app/_hooks/useMediaQuery';
import { useScroll } from '@/app/_hooks/useScroll';
import { formatDateString } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';

import { useCalendar } from '../../../_contexts/CalendarContext';

import SectionTitle from './common/SectionTitle';
import DrawerHeader from './header/DrawerHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import DailyNoteSection from './sections/daily-note/DailyNoteSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

interface EmotionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmotionDetailDrawer({ isOpen, onClose }: EmotionDetailDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { selectedDate } = useCalendar();
  const isLargeScreen = useIsLg();
  const { isScrollable, isScrolling, isScrollAtBottom } = useScroll({
    scrollRef,
    enable: isOpen,
    enablePreventBackgroundScroll: isOpen && !isLargeScreen,
  });

  const selectedDateString = formatDateString(selectedDate);

  // Animation variants based on screen size
  const wrapperAnimation = isLargeScreen
    ? {
        initial: { width: 0 },
        animate: { width: 300 },
        exit: { width: 0 },
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring' as const, damping: 25, stiffness: 180 },
      };

  const wrapperClassName = isLargeScreen
    ? 'h-full flex-shrink-0 overflow-hidden'
    : 'top-topnav-height fixed right-0 z-9999 h-[calc(100dvh-var(--spacing-topnav-height))] shadow-2xl';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          layout={isLargeScreen}
          {...wrapperAnimation}
          className={wrapperClassName}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex h-full w-[300px] flex-col border-l border-[var(--gray-3)] bg-[var(--gray-1)]">
            {/* Header - Fixed */}
            <div className={cn('z-10 flex-shrink-0', isScrolling && 'border-b border-[var(--gray-3)]')}>
              <DrawerHeader onClose={onClose} />
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto">
              {/* Daily Emotion */}
              <SectionTitle title="Daily Emotion" linkText="Edit" href={`/record/daily?date=${selectedDateString}`} />
              <DailyEmotionSection />

              {/* Daily Note */}
              <SectionTitle
                title="Daily Note"
                linkText="Edit"
                href={`/record/daily?date=${selectedDateString}&step=diary`}
              />
              <DailyNoteSection />

              {/* Moment Emotion */}
              <SectionTitle title="Moment Emotion" linkText="Edit" href={`/record/moment?date=${selectedDateString}`} />
              <MomentEmotionSection />

              {/* Gradient - Only show if content is scrollable and not at bottom */}
              {isScrollable && !isScrollAtBottom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 z-9 h-20 w-full bg-gradient-to-t from-[var(--black-a9)] to-transparent"
                />
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
