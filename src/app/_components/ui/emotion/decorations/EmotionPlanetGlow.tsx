'use client';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/app/_utils/styleUtils';

import { EMOTION_STEPS } from '../_constants/emotion.constants';

interface EmotionPlanetGlowProps {
  emotionId: number;
  isVisible: boolean;
  width?: number | string;
  height?: number | string;
  isLarge?: boolean;
}

export function EmotionPlanetGlow({ emotionId, isVisible, width, height, isLarge = false }: EmotionPlanetGlowProps) {
  const resolvedWidth = isLarge && typeof width === 'number' ? width * 0.8 : width || '100%';
  const resolvedHeight = isLarge && typeof height === 'number' ? height * 0.8 : height || '100%';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 grid place-items-center"
          style={{ zIndex: 0 }}
        >
          <div
            className={cn('translate-z-0 rounded-[9999px] blur-[22px]')}
            style={{
              width: resolvedWidth,
              height: resolvedHeight,
              background: `radial-gradient(circle, var(--${EMOTION_STEPS[emotionId].color}-a9) 0%, var(--${EMOTION_STEPS[emotionId].color}-a5) 40%, var(--${EMOTION_STEPS[emotionId].color}-a3) 65%, var(--${EMOTION_STEPS[emotionId].color}-a1) 70%)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
