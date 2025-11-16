'use client';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { cn } from '@zerogravity/shared/utils';

interface DesktopCalendarCellProps {
  day: number;
  isToday: boolean;
  isAfterToday: boolean;
  dailyEmotionId?: number;
  onClick?: () => void;
}

export default function DesktopCalendarCell({
  day,
  isToday,
  isAfterToday,
  dailyEmotionId,
  onClick,
}: DesktopCalendarCellProps) {
  const isEmpty = dailyEmotionId === undefined;

  return (
    <div
      onClick={!isAfterToday ? onClick : undefined}
      className={cn(
        'relative flex h-full w-full items-center justify-center p-1 outline outline-[0.5px] outline-[var(--gray-3)]',
        !isAfterToday && 'cursor-pointer hover:!bg-[var(--gray-a3)]'
      )}
    >
      {/* Day number */}
      <div className="absolute top-1/2 left-1/2 z-99 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="pointer-events-none">
          {/* Emotion circle background */}
          {!isEmpty && <circle cx="40" cy="40" r="38" fill={`var(--${EMOTION_STEPS[dailyEmotionId].color}-9)`} />}
          <text
            x="40"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="36"
            fontWeight="200"
            fill={
              isAfterToday
                ? 'var(--gray-a6)'
                : dailyEmotionId === 3
                  ? 'var(--black-a12)'
                  : !isEmpty
                    ? 'var(--white-a12)'
                    : isToday
                      ? 'var(--accent-a9)'
                      : 'var(--gray-11)'
            }
          >
            {day}
          </text>
        </svg>
      </div>
    </div>
  );
}
