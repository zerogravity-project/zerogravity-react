import throttle from 'lodash/throttle';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

interface UseSquareResizeOptions {
  isResize?: boolean;
  throttleMs?: number;
}

/**
 * Custom hook to get the square size (min of width and height) of an element
 * with throttled resize observer for performance
 */
export function useSquareResize({ isResize = true, throttleMs = 100 }: UseSquareResizeOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState<number | undefined>(undefined);

  // Throttled update function
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

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(throttledUpdate);
    ro.observe(el);
    throttledUpdate(); // Initial call
    return () => ro.disconnect();
  }, [throttledUpdate]);

  return { ref, squareSize };
}
