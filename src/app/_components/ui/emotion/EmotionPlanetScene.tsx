'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

import { useSquareResize } from '@/app/_hooks/useSquareResize';
import { cn } from '@/app/_utils/styleUtils';

import { EmotionPlanetGlow } from './decorations/EmotionPlanetGlow';
import { EmotionPlanetLoading } from './decorations/EmotionPlanetLoading';
import { EmotionPlanet } from './EmotionPlanet';

interface EmotionPlanetSceneProps {
  emotionId: number;
  width?: number | '100%';
  height?: number | '100%';

  isFreeze?: boolean;
  isGlow?: boolean;
  isSparkles?: boolean;
  isLoadingShowText?: boolean;
  isResize?: boolean;

  delay?: number;
  onSceneLoaded?: () => void;

  className?: string;
}

export default function EmotionPlanetScene({
  emotionId,
  width,
  height,
  isFreeze = false,
  isGlow = true,
  isSparkles = true,
  isLoadingShowText = true,
  isResize = true,
  delay = 0,
  onSceneLoaded,
  className,
}: EmotionPlanetSceneProps) {
  const { ref: containerRef, squareSize } = useSquareResize({ isResize: width && height ? false : isResize });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCanvas, setShowCanvas] = useState(delay === 0);

  const resolvedWidth = width || squareSize || '100%';
  const resolvedHeight = height || squareSize || '100%';

  const handleLoaded = () => {
    setIsLoaded(true);
    onSceneLoaded?.();
  };

  // Calculate display sizes
  const getDisplaySize = (dimension: number | string, isFull: boolean) => {
    if (isFull) {
      return squareSize ? `${squareSize}px` : '100%';
    }
    return typeof dimension === 'number' ? dimension : dimension;
  };

  const getLoadingSize = (dimension: number | string, isFull: boolean, scale = 0.85) => {
    if (isFull) {
      return squareSize ? `${squareSize * scale}px` : undefined;
    }
    return typeof dimension === 'number' ? dimension * scale : dimension;
  };

  const displayWidth = getDisplaySize(resolvedWidth, resolvedWidth === '100%');
  const displayHeight = getDisplaySize(resolvedHeight, resolvedHeight === '100%');
  const loadingWidth = getLoadingSize(resolvedWidth, resolvedWidth === '100%');
  const loadingHeight = getLoadingSize(resolvedHeight, resolvedHeight === '100%');

  // Handle delay for canvas rendering
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowCanvas(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full', !width && !height && 'aspect-square', className)}
      style={{ width, height }}
    >
      {/* 3D Canvas */}
      {showCanvas && (
        <div className="absolute inset-0 z-1 grid h-full w-full place-items-center">
          <Canvas
            frameloop={isFreeze ? 'never' : 'always'}
            resize={{ offsetSize: true }}
            style={{ width: resolvedWidth, height: resolvedHeight }}
            shadows
            camera={{ position: [0, 0, -25], fov: 15, near: 0.1, far: 100 }}
            gl={{ alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            <Suspense fallback={null}>
              <EmotionPlanet onLoaded={handleLoaded} emotionId={emotionId} isSparkles={isSparkles} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Glow Effect */}
      {isGlow && (
        <EmotionPlanetGlow emotionId={emotionId} isVisible={isLoaded} width={displayWidth} height={displayHeight} />
      )}

      {/* Loading Indicator */}
      <EmotionPlanetLoading
        emotionId={emotionId}
        isVisible={!isLoaded}
        width={loadingWidth}
        height={loadingHeight}
        isShowText={isLoadingShowText}
      />
    </div>
  );
}
