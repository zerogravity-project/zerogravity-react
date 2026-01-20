'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { useSquareResize } from '../../../../hooks/useSquareResize';
import { cn } from '../../../../utils/styleUtils';
import { EmotionPlanetGlow } from '../decorations/EmotionPlanetGlow';
import { EmotionPlanetLoading } from '../decorations/EmotionPlanetLoading';

/*
 * ============================================
 * Lazy Import (R3F bundle separation)
 * ============================================
 */

const LazyEmotionPlanetCanvas = lazy(() =>
  import('./EmotionPlanetCanvas').then(mod => ({ default: mod.EmotionPlanetCanvas }))
);

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
      {/* 3D Canvas (lazy loaded) */}
      {showCanvas && (
        <Suspense fallback={null}>
          <LazyEmotionPlanetCanvas
            emotionId={emotionId}
            width={resolvedWidth}
            height={resolvedHeight}
            environmentMapUrl={environmentMapUrl}
            isFreeze={isFreeze}
            isSparkles={isSparkles}
            isLarge={isLarge}
            performanceMode={shouldUsePerformanceMode}
            showPerf={showPerf}
            onLoaded={handleLoaded}
          />
        </Suspense>
      )}

      {/* Glow Effect (NOT lazy - renders immediately) */}
      {isGlow && (
        <EmotionPlanetGlow
          emotionId={emotionId}
          isVisible={isLoaded}
          width={displayWidth}
          height={displayHeight}
          isLarge={isLarge}
        />
      )}

      {/* Loading Indicator (NOT lazy - renders immediately) */}
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
