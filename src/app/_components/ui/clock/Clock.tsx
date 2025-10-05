'use client';

import { useDateTime } from '@/app/_hooks/useDateTime';
import { cn } from '@/lib/utils';

interface ClockProps {
  className?: string;
}

const Clock = ({ className }: ClockProps) => {
  const { timeData } = useDateTime();

  return (
    <div className={cn('relative flex w-full flex-col items-center pt-[7dvh] lg:pt-[3dvh] 2xl:pt-0', className)}>
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
