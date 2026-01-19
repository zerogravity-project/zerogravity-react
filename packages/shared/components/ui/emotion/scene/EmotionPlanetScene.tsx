'use client';

import { Suspense, useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';

import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { useSquareResize } from '../../../../hooks/useSquareResize';
import { cn } from '../../../../utils/styleUtils';
import { EmotionPlanetGlow } from '../decorations/EmotionPlanetGlow';
import { EmotionPlanetLoading } from '../decorations/EmotionPlanetLoading';

import { EmotionPlanet } from './EmotionPlanet';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionPlanetSceneProps {
  emotionId: number;
  width?: number | '100%';
  height?: number | '100%';

  environmentMapUrl?: string;
  isFreeze?: boolean;
  isGlow?: boolean;
  isSparkles?: boolean;
  isLoading?: boolean;
  isLoadingShowText?: boolean;
  isResize?: boolean;
  isLarge?: boolean;

  /** Show r3f-perf performance monitor (dev mode) */
  showPerf?: boolean;
  /** Force performance mode (auto-detected on mobile if not specified) */
  performanceMode?: boolean;

  delay?: number;
  onSceneLoaded?: () => void;

  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanetScene({
  emotionId,
  width,
  height,
  environmentMapUrl,
  isFreeze = false,
  isGlow = true,
  isSparkles = true,
  isLoading = false,
  isLoadingShowText = true,
  isResize = true,
  isLarge = false,
  showPerf = false,
  performanceMode,
  delay = 0,
  onSceneLoaded,
  className,
}: EmotionPlanetSceneProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCanvas, setShowCanvas] = useState(delay === 0);

  /*
   * --------------------------------------------
   * 2. Custom Hooks
   * --------------------------------------------
   */
  const { ref: containerRef, squareSize } = useSquareResize({ isResize: width && height ? false : isResize });
  const isMobile = useMediaQuery('(max-width: 768px)');

  /*
   * --------------------------------------------
   * 3. Derived Values (Performance)
   * --------------------------------------------
   */
  /** Use performance mode if explicitly set, or auto-detect on mobile */
  const shouldUsePerformanceMode = performanceMode ?? isMobile;

  /*
   * --------------------------------------------
   * 4. Helper Functions
   * --------------------------------------------
   */
  /** Calculate display size based on dimension and square size */
  const getDisplaySize = (dimension: number | string, isFull: boolean) => {
    if (isFull) {
      return squareSize ? `${squareSize}px` : '100%';
    }
    return typeof dimension === 'number' ? dimension : dimension;
  };

  /** Calculate loading indicator size with scale factor */
  const getLoadingSize = (dimension: number | string, isFull: boolean, scale = 0.85) => {
    if (isFull) {
      return squareSize ? `${squareSize * scale}px` : undefined;
    }
    return typeof dimension === 'number' ? dimension * scale : dimension;
  };

  /*
   * --------------------------------------------
   * 5. Derived Values
   * --------------------------------------------
   */
  const resolvedWidth = width || squareSize || '100%';
  const resolvedHeight = height || squareSize || '100%';
  const displayWidth = getDisplaySize(resolvedWidth, resolvedWidth === '100%');
  const displayHeight = getDisplaySize(resolvedHeight, resolvedHeight === '100%');
  const loadingWidth = getLoadingSize(resolvedWidth, resolvedWidth === '100%');
  const loadingHeight = getLoadingSize(resolvedHeight, resolvedHeight === '100%');

  /*
   * --------------------------------------------
   * 6. Event Handlers
   * --------------------------------------------
   */
  /** Handle planet loaded event */
  const handleLoaded = () => {
    setIsLoaded(true);
    onSceneLoaded?.();
  };

  /*
   * --------------------------------------------
   * 7. Effects
   * --------------------------------------------
   */
  /** Handle delay for canvas rendering */
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShowCanvas(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  /*
   * --------------------------------------------
   * 8. Return
   * --------------------------------------------
   */
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
            gl={{
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1,
              powerPreference: 'high-performance',
              precision: 'highp',
              preserveDrawingBuffer: false,
              logarithmicDepthBuffer: false,
            }}
            dpr={[1, 2]}
            onCreated={({ gl }) => {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            {/* Performance Monitor (dev mode) */}
            {showPerf && <Perf position="bottom-right" />}

            <Suspense fallback={null}>
              <EmotionPlanet
                onLoaded={handleLoaded}
                emotionId={emotionId}
                environmentMapUrl={environmentMapUrl}
                isSparkles={isSparkles}
                isLarge={isLarge}
                performanceMode={shouldUsePerformanceMode}
              />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Glow Effect */}
      {isGlow && (
        <EmotionPlanetGlow
          emotionId={emotionId}
          isVisible={isLoaded}
          width={displayWidth}
          height={displayHeight}
          isLarge={isLarge}
        />
      )}

      {/* Loading Indicator */}
      {!isLarge && (
        <EmotionPlanetLoading
          emotionId={emotionId}
          isVisible={!isLoaded || isLoading}
          width={loadingWidth}
          height={loadingHeight}
          isShowText={isLoadingShowText}
        />
      )}
    </div>
  );
}
