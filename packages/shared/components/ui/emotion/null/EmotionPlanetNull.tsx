'use client';

import { motion } from 'motion/react';

import { EMOTION_STEPS } from '../../../../entities/emotion';
import { useSquareResize } from '../../../../hooks/useSquareResize';
import { cn } from '../../../../utils/styleUtils';
import { EmotionPlanetGlow } from '../decorations/EmotionPlanetGlow';

/*
 * ============================================
 * Constants
 * ============================================
 */

const CIRCLE_RADIUS = 45;

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetNullProps {
  emotionId: number;
  width?: number | '100%';
  height?: number | '100%';

  isShowText?: boolean;
  isResize?: boolean;

  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanetNull({
  emotionId,
  width,
  height,
  isShowText = true,
  isResize = true,
  className,
}: EmotionPlanetNullProps) {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const { ref: containerRef, squareSize } = useSquareResize({ isResize: width && height ? false : isResize });

  /*
   * --------------------------------------------
   * 2. Helper Functions
   * --------------------------------------------
   */
  /** Calculate display size based on dimension and square size */
  const getDisplaySize = (dimension: number | string, isFull: boolean) => {
    if (isFull) {
      return squareSize ? `${squareSize}px` : '100%';
    }
    return typeof dimension === 'number' ? dimension : dimension;
  };

  /** Calculate null indicator size with scale factor */
  const getNullSize = (dimension: number | string, isFull: boolean, scale = 0.85) => {
    if (isFull) {
      return squareSize ? `${squareSize * scale}px` : undefined;
    }
    return typeof dimension === 'number' ? dimension * scale : dimension;
  };

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const resolvedWidth = width || squareSize || '100%';
  const resolvedHeight = height || squareSize || '100%';
  const displayWidth = getDisplaySize(resolvedWidth, resolvedWidth === '100%');
  const displayHeight = getDisplaySize(resolvedHeight, resolvedHeight === '100%');
  const nullWidth = getNullSize(resolvedWidth, resolvedWidth === '100%');
  const nullHeight = getNullSize(resolvedHeight, resolvedHeight === '100%');

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full', !width && !height && 'aspect-square', className)}
      style={{ width, height }}
    >
      {/* Glow Effect */}
      <EmotionPlanetGlow emotionId={emotionId} isVisible={true} width={displayWidth} height={displayHeight} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
      >
        <div className="relative" style={{ width: nullWidth, height: nullHeight }}>
          <svg className="h-full w-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={CIRCLE_RADIUS}
              fill="var(--background-dark)"
              stroke={`var(--${EMOTION_STEPS[emotionId].color}-a2)`}
              strokeWidth="1"
            />
            {/* Loading text */}
            {isShowText && (
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--gray-a5)"
                fontSize="6"
                fontWeight="500"
              >
                No Emotion
              </text>
            )}
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
