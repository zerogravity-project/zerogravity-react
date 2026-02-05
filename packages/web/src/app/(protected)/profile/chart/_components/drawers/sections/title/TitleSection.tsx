'use client';

import { Text } from '@radix-ui/themes';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { ChartPeriod } from '@/services/chart/chart.dto';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Period label mapping */
const PERIOD_LABELS: Record<ChartPeriod, string> = {
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
};

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface TitleSectionProps {
  period: ChartPeriod;
  startDateLabel: string;
  endDateLabel: string;
  isLoading?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function TitleSection({ period, startDateLabel, endDateLabel, isLoading }: TitleSectionProps) {
  /*
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  const periodLabel = PERIOD_LABELS[period];

  /** Loading messages to cycle through */
  const loadingMessages = [
    `${periodLabel} Report`,
    'This may take up to 30 seconds...',
    'Our AI is working hard for you!',
  ];

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [messageIndex, setMessageIndex] = useState(0);

  /*
   * --------------------------------------------
   * 3. Refs
   * --------------------------------------------
   */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /*
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */
  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0);
      return;
    }

    // Wait for drawer animation to complete before starting message loop
    const timeout = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading, loadingMessages.length]);

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return (
    <div className="space-y-1 px-4 py-5">
      <div className="flex items-center gap-1.5">
        <Text size="1" className="tracking-wide text-[var(--gray-10)] uppercase">
          {startDateLabel} – {endDateLabel}
        </Text>
      </div>
      <div className="relative h-7 overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <m.div
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Text size="5" weight="medium">
                {loadingMessages[messageIndex]}
              </Text>
            </m.div>
          ) : (
            <m.div
              key="title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Text size="5" weight="medium">
                {periodLabel} Report
              </Text>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
