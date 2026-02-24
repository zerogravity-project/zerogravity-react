import { Button, Callout, Heading, Text } from '@radix-ui/themes';
import { format, isAfter } from 'date-fns';
import { m } from 'motion/react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_COLORS, EMOTION_TYPES } from '@zerogravity/shared/entities/emotion';
import { cn, getWeekDates } from '@zerogravity/shared/utils';

import { GetEmotionRecordsResponse } from '@/services/emotion/emotion.dto';

import { DAYS_OF_WEEK } from '../../../_constants/calendar.constants';
import { useCalendar } from '../../../_contexts/CalendarContext';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MobileCalendarHeaderProps {
  emotionRecords?: GetEmotionRecordsResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function MobileCalendarHeader({
  emotionRecords,
  isLoading = false,
  isError = false,
  onRetry,
}: MobileCalendarHeaderProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentDate, setSelectedDate, goToNextWeek, goToPreviousWeek, goToToday, isSelected, getMonthName } =
    useCalendar();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const monthName = getMonthName();
  const weekDates = getWeekDates(currentDate);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <header className="mb-6 flex w-full flex-col items-center px-5 pt-6">
      {/* Error Callout */}
      <m.div
        initial={false}
        animate={{ gridTemplateRows: isError ? '1fr' : '0fr' }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid w-full"
      >
        <div className="overflow-hidden">
          <m.div
            initial={false}
            animate={{ opacity: isError ? 1 : 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Callout.Root color="red" className="!mb-4 !flex !w-full !items-center !justify-between">
              <div className="flex items-center gap-2">
                <Callout.Icon>
                  <Icon size={16}>error</Icon>
                </Callout.Icon>
                <Callout.Text>Failed to load emotion data</Callout.Text>
              </div>
              {onRetry && (
                <Button size="1" variant="soft" color="red" onClick={onRetry}>
                  Retry
                </Button>
              )}
            </Callout.Root>
          </m.div>
        </div>
      </m.div>

      {/* Selected Week & Navigation */}
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
              disabled={isLoading}
              aria-label="Previous week"
              className="!w-8 !rounded-r-none !border-r-0 !p-0"
            >
              <Icon>chevron_left</Icon>
            </Button>
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToNextWeek}
              disabled={isLoading}
              aria-label="Next week"
              className="!-ml-px !w-8 !rounded-l-none !p-0"
            >
              <Icon>chevron_right</Icon>
            </Button>
          </div>
          <Button size="2" variant="surface" color="gray" onClick={goToToday} disabled={isLoading}>
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
        {weekDates.map((date: Date, index: number) => {
          const isAfterToday = isAfter(date, new Date());
          const isSelectedDate = isSelected(date);
          const dailyEmotionId = emotionRecords?.daily.find(
            record => format(record.createdAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          )?.emotionId;
          const isEmpty = dailyEmotionId === undefined;

          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          const dateLabel = format(date, 'M/d/yyyy');
          const todayLabel = isToday ? ' (today)' : '';
          const emotionLabel = !isEmpty ? `, ${EMOTION_TYPES[dailyEmotionId]}` : '';
          const ariaLabel = `${dateLabel}${todayLabel}${emotionLabel}`;

          return (
            <m.div
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: index * 0.02 }}
              className="relative flex items-center justify-center"
            >
              <Button
                size="3"
                onClick={() => setSelectedDate(date)}
                variant={!isEmpty ? (isSelectedDate ? 'solid' : 'soft') : 'soft'}
                color={isEmpty ? (isSelectedDate ? undefined : 'gray') : EMOTION_COLORS[dailyEmotionId]}
                className={cn(
                  '!h-9 !w-9 !rounded-[9999px] !p-0 !font-normal !transition-colors',
                  isEmpty && '!bg-transparent'
                )}
                disabled={isAfterToday || isLoading || isError}
                aria-label={ariaLabel}
              >
                {date.getDate()}
              </Button>
            </m.div>
          );
        })}
      </div>
    </header>
  );
}
