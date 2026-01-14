'use client';

import { motion } from 'motion/react';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Blob morphing border-radius keyframes */
const BLOB_BORDER_RADIUS = [
  '60% 40% 30% 70% / 60% 30% 70% 40%',
  '50% 50% 70% 30% / 30% 60% 40% 70%',
  '70% 30% 50% 50% / 70% 40% 60% 30%',
  '40% 60% 60% 40% / 40% 70% 30% 60%',
  '60% 40% 30% 70% / 60% 30% 70% 40%',
];

/** Blob scale keyframes */
const BLOB_SCALE = [1, 1.03, 0.98, 1.02, 1];

/** Hue rotation keyframes (degrees) */
const HUE_ROTATE = [0, 45, 90, 45, 0];

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface PlanetLoadingProps {
  /** Size of the loader in pixels. If not provided, uses 100% of parent */
  size?: number;
  /** Additional class names */
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Veo3-style blob morphing loading animation
 * Features a glowing halo with conic gradient and morphing blob shape
 */
export function PlanetLoading({ size, className = '' }: PlanetLoadingProps) {
  /** When no size, use w-full + aspect-square for responsive sizing */
  const sizeClass = size ? '' : 'w-full';

  return (
    <div
      className={`relative flex aspect-square items-center justify-center ${sizeClass} ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Glowing halo with blob morphing */}
      <motion.div
        className="absolute h-full w-full"
        animate={{
          borderRadius: BLOB_BORDER_RADIUS,
          scale: BLOB_SCALE,
          filter: HUE_ROTATE.map(deg => `hue-rotate(${deg}deg)`),
        }}
        transition={{
          duration: 8,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        {/* Spinning conic gradient glow */}
        <motion.div
          className="absolute -inset-4 opacity-90 blur-[30px]"
          style={{
            borderRadius: 'inherit',
            background: 'conic-gradient(from 0deg, #6d28d9, #db2777, #22d3ee, #6d28d9)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 15,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}
