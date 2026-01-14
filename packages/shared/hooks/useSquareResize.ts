/**
 * [useSquareResize hook]
 * Responsive square sizing with throttled ResizeObserver
 */

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import throttle from 'lodash/throttle';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface UseSquareResizeOptions {
  isResize?: boolean;
  throttleMs?: number;
}

/*
 * ============================================
 * Hook
 * ============================================
 */

/**
 * Custom hook to get the square size (min of width and height) of an element
 * with throttled resize observer for performance
 */
export function useSquareResize({ isResize = true, throttleMs = 100 }: UseSquareResizeOptions = {}) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const ref = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState<number | undefined>(undefined);

  /*
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */
  /** Throttled update function */
  const throttledUpdate = useMemo(
    () =>
      throttle(() => {
        const el = ref.current;
        if (!el || !isResize) return;
        const rect = el.getBoundingClientRect();
        setSquareSize(Math.min(rect.width, rect.height));
      }, throttleMs),
    [isResize, throttleMs]
  );

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(throttledUpdate);
    ro.observe(el);
    throttledUpdate(); // Initial call
    return () => ro.disconnect();
  }, [throttledUpdate]);

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return { ref, squareSize };
}
