'use client';

import Link from 'next/link';

import { Badge, Button, Heading, Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';
import { useRef } from 'react';

import { EMOTION_STEPS, EmotionId, EmotionReason } from '@zerogravity/shared/components/ui/emotion';
import { formatDateString, isSameDay } from '@zerogravity/shared/utils';

import { TopAppBar } from '@/app/_components/ui/appbar/TopAppBar';
import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { useScroll } from '@/app/_hooks/useScroll';

import { useCalendar } from '../../../_contexts/CalendarContext';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  emotionId: EmotionId;
  reasons: EmotionReason[];
  diaryEntry: string;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionDetailDrawer({
  isOpen,
  onClose,
  emotionId,
  reasons,
  diaryEntry,
}: EmotionDetailDrawerProps) {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * --------------------------------------------
   * 2. External Hooks
   * --------------------------------------------
   */
  const { selectedDate } = useCalendar();

  /**
   * --------------------------------------------
   * 3. Custom Hooks
   * --------------------------------------------
   */
  const { isScrolling } = useScroll({
    scrollRef,
    enable: isOpen,
    enablePreventBackgroundScroll: isOpen,
  });

  /**
   * --------------------------------------------
   * 4. Derived Values
   * --------------------------------------------
   */
  const selectedDateString = formatDateString(selectedDate);
  const isToday = isSameDay(selectedDate, new Date());
  const isEmpty = emotionId === undefined;

  /**
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-9998 bg-black/50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            role="dialog"
            aria-modal="true"
            className="fixed top-0 right-0 z-9999 h-[100dvh] w-[100dvw] bg-[var(--gray-1)]"
          >
            <div className="flex h-full flex-col">
              {/* Header - Fixed */}
              <TopAppBar
                text="Go Back"
                icon="arrow_back"
                onClick={onClose}
                border
                rightContent={
                  isToday ? (
                    <Link href={`/record/daily?date=${selectedDateString}`}>
                      <Button variant="soft" radius="full" className="!cursor-pointer">
                        {!isEmpty ? 'Edit' : 'Add'}
                      </Button>
                    </Link>
                  ) : undefined
                }
              />

              {/* Emotion Content - Fixed */}
              <div className="flex w-full flex-col items-center gap-6 bg-[var(--background-dark)] pt-6 pb-9">
                <EmotionPlanetImage emotionId={emotionId} width={120} height={120} />
                <div className="flex w-full flex-col items-center gap-3">
                  <Text color={EMOTION_STEPS[emotionId].color} className="!text-center" size="5">
                    {EMOTION_STEPS[emotionId].type}
                  </Text>
                  <div className="flex w-full flex-wrap justify-center gap-2 px-6">
                    {reasons.map(reason => (
                      <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diary - Takes remaining space */}
              <div className="flex flex-1 flex-col overflow-hidden border-t border-[var(--gray-3)]">
                {/* Diary Header - Fixed */}
                <div
                  className={`z-1 flex w-full items-center justify-between bg-[var(--gray-1)] px-5 pt-6 pb-4 transition-shadow duration-200 ${
                    isScrolling && 'shadow-2xl'
                  }`}
                >
                  <Heading as="h2" size="4" weight="medium">
                    Diary
                  </Heading>
                  {isToday && !isEmpty && (
                    <Link href={`/record/daily?date=${selectedDateString}&step=diary`}>
                      <Button variant="soft" radius="full" className="!cursor-pointer">
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Text Area - Scrollable only */}
                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
                  {diaryEntry ? (
                    <Text as="p">{diaryEntry}</Text>
                  ) : (
                    <div className="flex w-full flex-col items-center justify-center py-14">
                      <Text as="p" className="!text-[var(--gray-a7)]" align="center">
                        Unwritten thoughts...
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
