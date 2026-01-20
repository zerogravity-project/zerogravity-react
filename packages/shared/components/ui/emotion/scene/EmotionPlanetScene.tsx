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
  /** Emotion ID (0-6) */
  emotionId: number;

  // Size
  width?: number | '100%';
  height?: number | '100%';
  /** Enable responsive square resize (default: true) */
  isResize?: boolean;
  /** Use larger planet size for hero sections */
  isLarge?: boolean;

  // Feature toggles
  /** Freeze animation (default: false) */
  isFreeze?: boolean;
  /** Show glow effect (default: true) */
  isGlow?: boolean;
  /** Show sparkle particles (default: true) */
  isSparkles?: boolean;

  // Loading
  /** Fallback while 3D loads: 'placeholder' (static image) or 'indicator' (spinner) */
  loadingFallback?: 'placeholder' | 'indicator';
  /** External loading state override */
  isLoading?: boolean;
  /** Show loading text with indicator (default: true) */
  isLoadingShowText?: boolean;
  /** Delay before rendering canvas (ms) */
  delay?: number;

  // Performance
  /** Force performance mode (auto-detected on mobile if not set) */
  performanceMode?: boolean;
  /** Show r3f-perf monitor (dev only) */
  showPerf?: boolean;

  // Config
  /** Custom HDR environment map URL */
  environmentMapUrl?: string;

  // Callbacks
  /** Called when 3D scene finishes loading */
  onSceneLoaded?: () => void;

  // Styling
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionPlanetScene({
  // Required
  emotionId,
  // Size
  width,
  height,
  isResize = true,
  isLarge = false,
  // Feature toggles
  isFreeze = false,
  isGlow = true,
  isSparkles = true,
  // Loading
  loadingFallback = 'placeholder',
  isLoading = false,
  isLoadingShowText = true,
  delay = 0,
  // Performance
  performanceMode,
  showPerf = false,
  // Config
  environmentMapUrl,
  // Callbacks
  onSceneLoaded,
  // Styling
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

  /** Calculate loading indicator size (85% of display size) */
  const getLoadingSize = (dimension: number | string, isFull: boolean) => {
    if (isFull) {
      return squareSize ? squareSize * 0.85 : '85%';
    }
    return typeof dimension === 'number' ? dimension * 0.85 : dimension;
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

      {/* Static Placeholder Image (prevents layout shift) */}
      {loadingFallback === 'placeholder' && (
        <div
          className={cn(
            'absolute inset-0 z-2 flex items-center justify-center transition-opacity duration-500',
            isLoaded && !isLoading ? 'pointer-events-none opacity-0' : 'opacity-100'
          )}
        >
          <img
            src={`/images/emotions/first-frame/emotion-${emotionId}-512.webp`}
            srcSet={`
              /images/emotions/first-frame/emotion-${emotionId}-512.webp 512w,
              /images/emotions/first-frame/emotion-${emotionId}-1024.webp 1024w,
              /images/emotions/first-frame/emotion-${emotionId}-1500.webp 1500w
            `}
            sizes="(max-width: 768px) 512px, (max-width: 1200px) 1024px, 1500px"
            alt={`Emotion ${emotionId}`}
            className="pointer-events-none h-full w-full object-contain select-none"
            style={{ width: displayWidth, height: displayHeight }}
            draggable={false}
          />
        </div>
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

      {/* Loading Indicator (alternative to placeholder image) */}
      {loadingFallback === 'indicator' && !isLarge && (
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
