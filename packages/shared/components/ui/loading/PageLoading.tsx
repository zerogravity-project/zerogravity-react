'use client';

import { Progress } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';

import { DefaultLoading } from './DefaultLoading';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface PageLoadingProps {
  isLoaded: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function PageLoading({ isLoaded }: PageLoadingProps) {
  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-50 flex h-full w-full justify-center bg-[var(--background-dark)]"
        >
          <Progress
            size="1"
            variant="soft"
            radius="none"
            className="!h-0.5"
            duration="15s"
            value={isLoaded ? 100 : undefined}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <DefaultLoading />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
