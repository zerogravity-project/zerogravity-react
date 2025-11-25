import { useEffect, useState } from 'react';

/**
 * ============================================
 * Hook
 * ============================================
 */

/**
 * Real-time clock hook
 * - Returns current Date object that updates every frame (RAF)
 * - Use with formatting utils (getTimeStringData, getDateStringData) where needed
 */
export function useClock() {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [now, setNow] = useState<Date | null>(null);

  /**
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */
  useEffect(() => {
    let animationFrameId: number;

    const updateTime = () => {
      setNow(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return now;
}
