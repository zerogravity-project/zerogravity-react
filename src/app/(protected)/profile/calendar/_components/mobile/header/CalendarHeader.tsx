import { Button, Heading, Text } from '@radix-ui/themes';
import { useMemo } from 'react';

import Icon from '@/app/_components/ui/icon/Icon';
import { getWeekDates } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';

import { EMOTION_STEPS } from '../../../../../../_components/ui/emotion/_constants/emotion.constants';
import { DAYS_OF_WEEK } from '../../../_constants/calendar.constants';
import { useCalendar } from '../../../_contexts/CalendarContext';

export default function CalendarHeader() {
  const randomEmotionIds = useMemo(() => {
    return Array.from({ length: 3 }, () => ({
      momentId: Math.floor(Math.random() * 3),
      emotionId: Math.floor(Math.random() * 7),
    }));
  }, []);

  const { currentDate, setSelectedDate, goToNextWeek, goToPreviousWeek, goToToday, isToday, isSelected, getMonthName } =
    useCalendar();

  const monthName = getMonthName();
  const weekDates = getWeekDates(currentDate);

  return (
    <header className="mb-6 flex w-full flex-col items-center px-5 pt-6">
      <div className="mb-4 flex w-full items-center justify-between">
        <Heading size="6" weight="medium">
          {monthName}
        </Heading>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToPreviousWeek}
              className="!w-8 !cursor-pointer !rounded-r-none !border-r-0"
            >
              <Icon>chevron_left</Icon>
            </Button>
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToNextWeek}
              className="!w-8 !cursor-pointer !rounded-l-none"
            >
              <Icon>chevron_right</Icon>
            </Button>
          </div>
          <Button size="2" variant="surface" color="gray" onClick={goToToday} className="!cursor-pointer">
            Today
          </Button>
        </div>
      </div>

      <div className="mb-2 grid w-full grid-cols-7">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center">
            <Text size="1" weight="medium" color="gray">
              {day}
            </Text>
          </div>
        ))}
      </div>

      <div className="grid w-full grid-cols-7 place-items-center">
        {weekDates.map((date, index) => {
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          return (
            <div key={index} className="relative flex items-center justify-center">
              <Button
                size="3"
                onClick={() => setSelectedDate(date)}
                variant={isSelectedDate ? 'solid' : isTodayDate ? 'soft' : randomEmotionIds[0] ? 'ghost' : 'ghost'}
                color={randomEmotionIds[0] ? EMOTION_STEPS[randomEmotionIds[0].emotionId].color : undefined}
                className={cn(`!h-9 !w-9 !rounded-[9999px] !p-0 !font-normal`)}
              >
                {date.getDate()}
              </Button>
              {/* <div
                style={{ backgroundColor: `var(--${EMOTION_STEPS[randomEmotionIds[0].emotionId].color}-a9)` }}
                className="absolute -bottom-3 h-1 w-1 rounded-[9999px]"
              /> */}
            </div>
          );
        })}
      </div>
    </header>
  );
}
