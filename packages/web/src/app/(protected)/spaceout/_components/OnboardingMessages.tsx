'use client';

import { Heading } from '@radix-ui/themes';
import { AnimatePresence, m } from 'motion/react';

import { useIsSm } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface OnboardingMessagesProps {
  message: string;
  messageIndex: number;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function OnboardingMessages({ message, messageIndex }: OnboardingMessagesProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isSm = useIsSm();

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <AnimatePresence mode="wait">
      <m.div
        key={messageIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="px-6 text-center"
      >
        <Heading size={isSm ? '7' : '8'} weight="medium">
          {message}
        </Heading>
      </m.div>
    </AnimatePresence>
  );
}
