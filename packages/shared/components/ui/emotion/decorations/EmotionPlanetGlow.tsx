'use client';

import { AnimatePresence, motion } from 'motion/react';

import { EMOTION_STEPS } from '../../../../entities/emotion';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetGlowProps {
  emotionId: number;
  isVisible: boolean;
  width?: number | string;
  height?: number | string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Box-shadow based glow effect
 * Uses multiple box-shadows for soft glow (more performant than CSS blur filter)
 */
export function EmotionPlanetGlow({ emotionId, isVisible, width, height }: EmotionPlanetGlowProps) {
  /*
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  /** Shrink factor to match planet visual size within canvas */
  const shrinkFactor = 0.765;
  const baseWidth = width || '100%';
  const baseHeight = height || '100%';

  /** Apply shrink factor for numeric/pixel values, keep percentage as-is */
  const applyShrink = (value: number | string): number | string => {
    if (typeof value === 'number') return value * shrinkFactor;
    if (typeof value === 'string' && value.endsWith('px')) {
      return `${parseFloat(value) * shrinkFactor}px`;
    }
    return `calc(${value} * ${shrinkFactor})`;
  };

  const resolvedWidth = applyShrink(baseWidth);
  const resolvedHeight = applyShrink(baseHeight);
  const color = EMOTION_STEPS[emotionId].color;

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 grid place-items-center"
          style={{ zIndex: 0, willChange: 'opacity' }}
        >
          <div
            className="translate-z-0 rounded-[9999px]"
            style={{
              width: resolvedWidth,
              height: resolvedHeight,
              backgroundColor: 'transparent',
              boxShadow: `
                0 0 50px 20px var(--${color}-a3),
                0 0 90px 40px var(--${color}-a2),
                0 0 135px 60px var(--${color}-a2),
                0 0 180px 85px var(--${color}-a1)
              `,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
