'use client';

import { useClock } from '../../../hooks/useClock';
import { getTimeStringData } from '../../../utils/dateTimeUtils';
import { cn } from '../../../utils/styleUtils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ClockProps {
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export const Clock = ({ className }: ClockProps) => {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const now = useClock();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const timeData = now ? getTimeStringData(now) : null;

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center pt-[7dvh] select-none lg:pt-[1dvh] 2xl:!pt-0',
        className
      )}
    >
      {/* Time Display */}
      <div className="z-1 flex w-full items-center justify-center overflow-hidden">
        <span className="text-[27.9dvw] leading-[0.9] font-extralight text-[var(--accent-a9)] 2xl:leading-[0.8]">
          {timeData ? timeData.hours : '00'}:{timeData ? timeData.minutes : '00'}:{timeData ? timeData.seconds : '00'}
        </span>
      </div>
    </div>
  );
};
