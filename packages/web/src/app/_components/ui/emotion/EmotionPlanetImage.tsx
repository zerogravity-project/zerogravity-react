'use client';

import Image from 'next/image';

import { motion } from 'motion/react';
import { useState } from 'react';

import { EmotionPlanetGlow } from '@zerogravity/shared/components/ui/emotion';
import { useSquareResize } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

interface EmotionPlanetImageProps {
  emotionId: number;
  width?: number;
  height?: number;
  fill?: boolean;

  isGlow?: boolean;
  isResize?: boolean;

  className?: string;
}

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
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref: containerRef, squareSize } = useSquareResize({ isResize: width && height ? false : isResize });

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
