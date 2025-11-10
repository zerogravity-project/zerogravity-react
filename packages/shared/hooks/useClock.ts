import { useEffect, useState } from 'react';

/**
 * Real-time clock hook
 * - Returns current Date object that updates every frame (RAF)
 * - Use with formatting utils (getTimeStringData, getDateStringData) where needed
 */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null);

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

  return now;
}
