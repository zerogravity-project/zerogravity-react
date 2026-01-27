/**
 * [MotionButton component]
 * Animated button with motion effects wrapping Radix UI Button
 */
'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';

import { Button } from '@radix-ui/themes';
import { m } from 'motion/react';

/**
 * ============================================
 * Constants
 * ============================================
 */

/** Motion-enabled Radix Button */
const MotionRadixButton = m.create(Button);

/** Default motion animation settings */
const DEFAULT_MOTION = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

/** Motion-related event props that need to be omitted from Radix Button */
type MotionEventProps = 'onAnimationStart' | 'onAnimationEnd' | 'onDragStart' | 'onDragEnd' | 'onDrag';

type RadixButtonProps = Omit<ComponentPropsWithoutRef<typeof Button>, MotionEventProps>;

interface MotionAnimationProps {
  whileHover?: { scale?: number };
  whileTap?: { scale?: number };
  transition?: { type?: string; stiffness?: number; damping?: number };
}

export interface MotionButtonProps extends RadixButtonProps {
  /** Custom motion animation props */
  motionProps?: MotionAnimationProps;
  /** Disable motion effects */
  disableMotion?: boolean;
}

/**
 * ============================================
 * Component
 * ============================================
 */

/**
 * Button with motion effects
 * Uses motion.create to apply animations directly to Radix UI Button
 */
export const MotionButton = forwardRef<ComponentRef<typeof Button>, MotionButtonProps>(
  ({ motionProps, disableMotion = false, ...props }, ref) => {
    const animationProps = disableMotion ? {} : { ...DEFAULT_MOTION, ...motionProps };

    return <MotionRadixButton ref={ref} {...animationProps} {...props} />;
  }
);

MotionButton.displayName = 'MotionButton';
