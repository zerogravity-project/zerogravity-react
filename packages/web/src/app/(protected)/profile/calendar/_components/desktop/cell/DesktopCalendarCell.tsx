'use client';

import { EMOTION_COLORS } from '@zerogravity/shared/entities/emotion';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DesktopCalendarCellProps {
  day: number;
  isToday: boolean;
  isAfterToday: boolean;
  isLoading?: boolean;
  dailyEmotionId?: number;
  onClick?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DesktopCalendarCell({
  day,
  isToday,
  isAfterToday,
  isLoading = false,
  dailyEmotionId,
  onClick,
}: DesktopCalendarCellProps) {
  /*
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  const isEmpty = dailyEmotionId === undefined;
  const isDisabled = isAfterToday || isLoading;

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <div
      data-testid={`calendar-day-${day}`}
      data-today={isToday ? 'true' : undefined}
      onClick={!isDisabled ? onClick : undefined}
      className={cn(
        'relative flex h-full w-full items-center justify-center p-1 outline outline-[0.5px] outline-[var(--gray-3)]',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:!bg-[var(--gray-a3)]'
      )}
    >
      {/* Day number */}
      <div className="absolute top-1/2 left-1/2 z-99 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="pointer-events-none">
          {/* Emotion circle background */}
          {!isEmpty && <circle cx="40" cy="40" r="38" fill={`var(--${EMOTION_COLORS[dailyEmotionId]}-9)`} />}
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
