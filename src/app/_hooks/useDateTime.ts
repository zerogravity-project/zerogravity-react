import { useEffect, useState } from 'react';

export const useDateTime = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekday = date.toLocaleDateString('ja-JP', { weekday: 'long' });

    return {
      year: year.toString(),
      month: month,
      day: day,
      weekday: weekday,
    };
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateTime = () => {
      const now = new Date();
      setTime(now);
      setDate(now);
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

  const timeData = time ? formatTime(time) : null;
  const dateData = date ? formatDate(date) : null;

  return { timeData, dateData };
};
