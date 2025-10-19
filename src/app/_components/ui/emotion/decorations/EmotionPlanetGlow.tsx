'use client';

import { AnimatePresence, motion } from 'motion/react';

import { EMOTION_STEPS } from '../_constants/emotion.constants';

interface EmotionPlanetGlowProps {
  emotionId: number;
  isVisible: boolean;
  width?: number | string;
  height?: number | string;
}

export function EmotionPlanetGlow({ emotionId, isVisible, width, height }: EmotionPlanetGlowProps) {
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
            className="translate-z-0 rounded-[9999px] blur-[22px]"
            style={{
              width: width ?? '100%',
              height: height ?? '100%',
              background: `radial-gradient(circle, var(--${EMOTION_STEPS[emotionId].color}-a9) 0%, var(--${EMOTION_STEPS[emotionId].color}-a5) 40%, var(--${EMOTION_STEPS[emotionId].color}-a3) 65%, var(--${EMOTION_STEPS[emotionId].color}-a1) 70%)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
