'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ClockProps {
  className?: string;
  showSeconds?: boolean;
  format24h?: boolean;
}

// const fallbackDate = '날짜 정보를 불러오는 중';

const Clock = ({ className, showSeconds = true, format24h = true }: ClockProps) => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateTime = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime);
    };

    // RAF로 시작
    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    const hours = format24h ? date.getHours() : ((date.getHours() + 11) % 12) + 1;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString('ko-KR', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     weekday: 'long',
  //   });
  // };

  const timeData = time ? formatTime(time) : null;

  return (
    <div className={cn('flex w-full flex-col items-center gap-2', className)}>
      <div className="flex w-full items-center justify-center">
        {/* 시 */}
        <span className="w-[clamp(4rem,12vw,10rem)] text-center text-[clamp(4rem,12vw,10rem)] leading-none break-keep whitespace-nowrap text-[var(--accent-a9)]">
          {timeData ? timeData.hours : '00'}
        </span>

        <span className="font-pretendard mx-[clamp(0.5rem,2vw,1rem)] text-[clamp(3rem,10vw,8rem)] leading-none text-[var(--accent-a9)]">
          :
        </span>

        {/* 분 */}
        <span className="w-[clamp(4rem,12vw,10rem)] text-center text-[clamp(4rem,12vw,10rem)] leading-none break-keep whitespace-nowrap text-[var(--accent-a9)]">
          {timeData ? timeData.minutes : '00'}
        </span>

        {/* 초 (showSeconds가 true일 때만 표시) */}
        {showSeconds && (
          <>
            <span className="font-pretendard mx-[clamp(0.5rem,2vw,1rem)] text-[clamp(3rem,10vw,8rem)] leading-none text-[var(--accent-a9)]">
              :
            </span>
            <span className="w-[clamp(4rem,12vw,10rem)] text-center text-[clamp(4rem,12vw,10rem)] leading-none break-keep whitespace-nowrap text-[var(--accent-a9)]">
              {timeData ? timeData.seconds : '00'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Clock;
