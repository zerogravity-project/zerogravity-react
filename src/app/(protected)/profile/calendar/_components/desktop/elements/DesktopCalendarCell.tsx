'use client';

import { Text } from '@radix-ui/themes';
import { useMemo, useState } from 'react';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import EmotionPlanetImage from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { cn } from '@/app/_utils/styleUtils';

interface DesktopCalendarCellProps {
  day: number;
  isToday: boolean;
  emotionId?: number;
  onClick?: () => void;
}

export default function DesktopCalendarCell({ day, isToday, emotionId, onClick }: DesktopCalendarCellProps) {
  // TODO: Replace with actual emotion data from API
  const displayEmotionId = useMemo(() => {
    return emotionId ?? Math.floor(Math.random() * 7);
  }, [emotionId]);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundColor: isToday ? `var(--${EMOTION_STEPS[displayEmotionId].color}-a2)` : 'transparent' }}
      className={cn(
        'relative flex h-full w-full cursor-pointer items-center justify-center p-4 outline outline-[0.5px] outline-[var(--gray-3)] hover:!bg-[var(--gray-a3)]'
      )}
    >
      {/* Day number */}
      <div className="absolute top-[6px] left-2 z-10 flex">
        {isToday ? (
          <Text size="2" weight="regular" className="text-[var(--text-default)]">
            {day}
          </Text>
        ) : (
          <Text size="2" weight="light" color="gray">
            {day}
          </Text>
        )}
      </div>

      {/* Emotion image */}
      <div className="h-full max-h-18 w-full max-w-18">
        <EmotionPlanetImage
          className="object-contain"
          emotionId={displayEmotionId}
          fill
          isGlow={isToday || isHovered ? true : false}
        />
      </div>

      {/* Moment Emotion Marker */}
      <div
        style={{ backgroundColor: `var(--${EMOTION_STEPS[displayEmotionId].color}-a9)` }}
        className="absolute right-2 bottom-2 z-10 h-2 w-2 rounded-[9999px]"
      />
    </div>
  );
}
