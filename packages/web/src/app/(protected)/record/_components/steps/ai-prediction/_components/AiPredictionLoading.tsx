'use client';

import { Text } from '@radix-ui/themes';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';

import { PlanetLoading } from '@zerogravity/shared/components/ui/loading';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Loading messages for planet generation */
const LOADING_MESSAGES = [
  'Collecting emotional stardust...',
  'Gathering fragments of your day...',
  'Crafting your unique planet...',
  'Weaving pieces of feelings together...',
  'A planet is being born somewhere in the universe...',
  'Painting your day with light...',
];

/*
 * ============================================
 * Component
 * ============================================
 */

export default function AiPredictionLoading() {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [messageIndex, setMessageIndex] = useState(0);

  /*
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */

  /** Cycle through loading messages */
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-24 pb-[108px]">
      <PlanetLoading className="max-w-[200px]" />

      {/* Animated text carousel */}
      <div className="relative h-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <m.div
            key={messageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <Text color="gray" className="mobile:text-base text-md text-center font-light">
              {LOADING_MESSAGES[messageIndex]}
            </Text>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
