'use client';

import { useMemo } from 'react';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import { cn } from '@/app/_utils/styleUtils';

interface DesktopCalendarCellProps {
  day: number;
  isToday: boolean;
  emotionId?: number;
  onClick?: () => void;
}

export default function DesktopCalendarCell({ day, isToday, emotionId, onClick }: DesktopCalendarCellProps) {
  // TODO: Replace with actual emotion data from API
  const dailyEmotionId = useMemo(() => {
    return emotionId ?? Math.floor(Math.random() * 7);
  }, [emotionId]);

  // const momentEmotionId = useMemo(() => {
  //   return emotionId ?? (Math.random() > 0.1 ? Math.floor(Math.random() * 7) : null);
  // }, [emotionId]);

  // const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      // onMouseEnter={() => setIsHovered(true)}
      // // onMouseLeave={() => setIsHovered(false)}
      // style={{
      //   backgroundColor: momentEmotionId ? `var(--${EMOTION_STEPS[momentEmotionId].color}-9)` : 'transparent',
      // }}
      className={cn(
        'relative flex h-full w-full cursor-pointer items-center justify-center p-1 outline outline-[0.5px] outline-[var(--gray-3)] hover:!bg-[var(--gray-a3)]'
      )}
    >
      {/* Day number */}
      <div className="absolute top-1/2 left-1/2 z-99 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="pointer-events-none">
          {/* Emotion circle background */}
          {dailyEmotionId && <circle cx="40" cy="40" r="38" fill={`var(--${EMOTION_STEPS[dailyEmotionId].color}-9)`} />}
          <text
            x="40"
            y="40"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="36"
            fontWeight="200"
            fill={
              isToday
                ? 'var(--text-default)'
                : dailyEmotionId === 3
                  ? 'var(--black-a12)'
                  : dailyEmotionId
                    ? 'var(--white-a12)'
                    : 'var(--gray-11)'
            }
          >
            {day}
          </text>
        </svg>
      </div>

      {/* {!dailyEmotionId && (
        <div className="absolute top-1/2 left-1/2 z-99 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 120 120" className="pointer-events-none">
            <path
              d="M48.756 4.14116C55.2352 -1.38039 64.7648 -1.38039 71.244 4.14116L75.7634 7.99256C78.5399 10.3587 81.992 11.7886 85.6284 12.0788L91.5474 12.5511C100.033 13.2283 106.772 19.9667 107.449 28.4525L107.921 34.3716C108.211 38.008 109.641 41.4601 112.007 44.2366L115.859 48.756C121.38 55.2352 121.38 64.7648 115.859 71.244L112.007 75.7634C109.641 78.5399 108.211 81.992 107.921 85.6284L107.449 91.5474C106.772 100.033 100.033 106.772 91.5474 107.449L85.6284 107.921C81.992 108.211 78.5399 109.641 75.7634 112.007L71.244 115.859C64.7648 121.38 55.2352 121.38 48.756 115.859L44.2366 112.007C41.4601 109.641 38.008 108.211 34.3716 107.921L28.4525 107.449C19.9667 106.772 13.2283 100.033 12.5511 91.5475L12.0788 85.6284C11.7886 81.992 10.3587 78.5399 7.99256 75.7634L4.14116 71.244C-1.38039 64.7648 -1.38039 55.2352 4.14116 48.756L7.99256 44.2366C10.3587 41.4601 11.7886 38.008 12.0788 34.3716L12.5511 28.4525C13.2283 19.9667 19.9667 13.2283 28.4525 12.5511L34.3716 12.0788C38.008 11.7886 41.4601 10.3587 44.2366 7.99256L48.756 4.14116Z"
              fill="#ffffff10"
            />
          </svg>
        </div>
      )} */}

      {/* Moment Emotion Marker */}
      {/* <div
        style={{
          backgroundColor: momentEmotionId ? `var(--${EMOTION_STEPS[momentEmotionId].color}-a9)` : 'transparent',
        }}
        className="absolute right-2 bottom-2 z-10 h-3 w-3 rounded-[9999px]"
      /> */}
    </div>
  );
}
