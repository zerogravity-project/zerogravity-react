'use client';

import Image from 'next/image';

import { motion } from 'motion/react';
import { useState } from 'react';

import { useSquareResize } from '@/app/_hooks/useSquareResize';
import { cn } from '@/app/_utils/styleUtils';

import { EmotionPlanetGlow } from './decorations/EmotionPlanetGlow';

interface EmotionPlanetImageProps {
  emotionId: number;
  width?: number;
  height?: number;
  fill?: boolean;
  isGlow?: boolean;
  isResize?: boolean;
  className?: string;
}

export default function EmotionPlanetImage({
  emotionId,
  width,
  height,
  fill,
  isGlow = true,
  isResize = true,
  className,
  ...props
}: EmotionPlanetImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: containerRef, squareSize } = useSquareResize({ isResize });

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
