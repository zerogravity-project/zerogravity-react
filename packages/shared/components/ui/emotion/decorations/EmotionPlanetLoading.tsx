'use client';

import { AnimatePresence, m } from 'motion/react';

import { EMOTION_STEPS } from '../../../../entities/emotion';

/*
 * ============================================
 * Constants
 * ============================================
 */

const CIRCLE_RADIUS = 45;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 283

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetLoadingProps {
  emotionId: number;
  isVisible: boolean;
  width?: number | string;
  height?: number | string;
  isShowText?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanetLoading({
  emotionId,
  isVisible,
  width,
  height,
  isShowText = true,
}: EmotionPlanetLoadingProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-10 grid place-items-center"
        >
          <div className="relative" style={{ width: width, height: height }}>
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke={`var(--${EMOTION_STEPS[emotionId].color}-a1)`}
                strokeWidth="1"
              />
              {/* Animated progress circle */}
              <m.circle
                cx="50"
                cy="50"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke={`var(--${EMOTION_STEPS[emotionId].color}-a9)`}
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ strokeDashoffset: CIRCLE_CIRCUMFERENCE }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
                style={{
                  strokeDasharray: CIRCLE_CIRCUMFERENCE,
                }}
              />
              {/* Loading text */}
              {isShowText && (
                <text
                  x="50"
                  y="50"
                  transform="rotate(90, 50, 50)"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={`var(--${EMOTION_STEPS[emotionId].color}-a9)`}
                  fontSize="6"
                  fontWeight="500"
                >
                  Launching
                </text>
              )}
            </svg>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
