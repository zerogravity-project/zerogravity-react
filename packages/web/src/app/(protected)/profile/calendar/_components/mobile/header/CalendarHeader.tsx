import { Button, Heading, Text } from '@radix-ui/themes';
import { format, isAfter } from 'date-fns';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { cn, getWeekDates } from '@zerogravity/shared/utils';

import { DAYS_OF_WEEK } from '../../../_constants/calendar.constants';
import { useCalendar } from '../../../_contexts/CalendarContext';

import { GetEmotionRecordsResponse } from '@/services/emotion/emotion.dto';

interface CalendarHeaderProps {
  emotionRecords?: GetEmotionRecordsResponse;
}

export default function CalendarHeader({ emotionRecords }: CalendarHeaderProps) {
  const { currentDate, setSelectedDate, goToNextWeek, goToPreviousWeek, goToToday, isSelected, getMonthName } =
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
          // const isTodayDate = isToday(date);
          const isAfterToday = isAfter(date, new Date());
          const isSelectedDate = isSelected(date);
          const dailyEmotionId = emotionRecords?.daily.find(
            record => format(record.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          )?.emotionId;
          const isEmpty = dailyEmotionId === undefined;

          return (
            <div key={index} className="relative flex items-center justify-center">
              <Button
                size="3"
                onClick={() => setSelectedDate(date)}
                variant={!isEmpty ? (isSelectedDate ? 'solid' : 'soft') : 'soft'}
                color={isEmpty ? (isSelectedDate ? undefined : 'gray') : EMOTION_STEPS[dailyEmotionId].color}
                className={cn(`!h-9 !w-9 !rounded-[9999px] !p-0 !font-normal`, isEmpty && '!bg-transparent')}
                disabled={isAfterToday}
              >
                {date.getDate()}
              </Button>
            </div>
          );
        })}
      </div>
    </header>
  );
}
