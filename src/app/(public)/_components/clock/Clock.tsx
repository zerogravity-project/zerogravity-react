'use client';

import { useClock } from '@/app/(public)/_hooks/useClock';
import { getTimeStringData } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';

interface ClockProps {
  className?: string;
}

const Clock = ({ className }: ClockProps) => {
  const now = useClock();
  const timeData = now ? getTimeStringData(now) : null;

  return (
    <div className={cn('relative flex w-full flex-col items-center pt-[7dvh] lg:pt-[1dvh] 2xl:pt-0', className)}>
      {/* 시간 표시 */}
      <div className="z-1 flex w-full items-center justify-center overflow-hidden">
        <span className="text-[27.9dvw] leading-[0.9] font-extralight text-[var(--accent-a9)]">
          {timeData ? timeData.hours : '00'}:{timeData ? timeData.minutes : '00'}:{timeData ? timeData.seconds : '00'}
        </span>
      </div>
    </div>
  );
};

export default Clock;
