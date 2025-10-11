'use client';

import Image from 'next/image';

import { motion } from 'motion/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { EmotionPlanetGlow } from './EmotionPlanetGlow';

interface EmotionPlanetImageProps {
  emotionId: number;
  width?: number;
  height?: number;
  className?: string;
}

export default function EmotionPlanetImage({ emotionId, width, height, className, ...props }: EmotionPlanetImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="relative flex items-center justify-center"
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
        onLoad={() => setIsLoaded(true)}
        {...props}
      />

      <EmotionPlanetGlow emotionId={emotionId} isVisible={isLoaded} width={width} height={height} />
    </motion.div>
  );
}
