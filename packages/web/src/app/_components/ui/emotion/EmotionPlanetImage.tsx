'use client';

import Image from 'next/image';

import { motion } from 'motion/react';
import { useState } from 'react';

import { EmotionPlanetGlow } from '@zerogravity/shared/components/ui/emotion';
import type { EmotionId } from '@zerogravity/shared/entities/emotion';
import { useSquareResize } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetImageProps {
  emotionId: EmotionId;
  width?: number;
  height?: number;
  fill?: boolean;

  isGlow?: boolean;
  isResize?: boolean;

  className?: string;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanetImage({
  emotionId,
  width,
  height,
  fill,
  isGlow = true,
  isResize = true,
  className,
  ...props
}: EmotionPlanetImageProps) {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * --------------------------------------------
   * 2. Custom Hooks
   * --------------------------------------------
   */
  const { ref: containerRef, squareSize } = useSquareResize({ isResize: width && height ? false : isResize });

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <motion.div
      ref={containerRef}
      className={cn('relative flex flex-shrink-0 items-center justify-center', fill && 'h-full w-full')}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Image
        src={`/images/emotions/emotion-${emotionId}.webp`}
        alt={`emotion-${emotionId}`}
        width={width}
        height={height}
        className={cn('relative z-10', className)}
        fill={fill}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />

      {isGlow && (
        <EmotionPlanetGlow
          emotionId={emotionId}
          isVisible={isLoaded}
          width={fill ? squareSize : width}
          height={fill ? squareSize : height}
        />
      )}
    </motion.div>
  );
}
