'use client';

import { m } from 'motion/react';

import { EMOTION_COLORS, EMOTION_TYPES } from '@zerogravity/shared/entities/emotion';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DesktopCalendarCellProps {
  day: number;
  month: number;
  year: number;
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
  month,
  year,
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

  /** Accessible label for screen readers */
  const ariaLabel = (() => {
    const dateStr = `${month}/${day}/${year}`;
    const todayStr = isToday ? ' (today)' : '';
    const emotionStr = !isEmpty ? `, ${EMOTION_TYPES[dailyEmotionId]}` : '';
    return `${dateStr}${todayStr}${emotionStr}`;
  })();

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <button
      type="button"
      data-testid={`calendar-day-${day}`}
      data-today={isToday ? 'true' : undefined}
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        'relative flex h-full w-full items-center justify-center bg-transparent p-1 outline outline-[0.5px] outline-[var(--gray-3)]',
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:!bg-[var(--gray-a3)]'
      )}
    >
      {/* Day number */}
      <div className="absolute top-1/2 left-1/2 z-99 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="pointer-events-none">
          {/* Emotion circle background */}
          {!isEmpty && (
            <m.circle
              key={`${year}-${month}-${day}`}
              cx="40"
              cy="40"
              r="38"
              fill={`var(--${EMOTION_COLORS[dailyEmotionId]}-9)`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            />
          )}
          {/* Base text — always visible with default color */}
          <text
            x="40"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="36"
            fontWeight="200"
            fill={isAfterToday ? 'var(--gray-a6)' : isToday ? 'var(--accent-a9)' : 'var(--gray-11)'}
          >
            {day}
          </text>

          {/* Emotion text overlay — fades in with circle to prevent color flash */}
          {!isEmpty && (
            <m.text
              key={`text-${year}-${month}-${day}`}
              x="40"
              y="40"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="36"
              fontWeight="200"
              fill={dailyEmotionId === 3 ? 'var(--black-a12)' : 'var(--white-a12)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {day}
            </m.text>
          )}
        </svg>
      </div>
    </button>
  );
}
