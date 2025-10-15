import Link from 'next/link';

import { Button, DropdownMenu, Heading } from '@radix-ui/themes';

import Icon from '@/app/_components/ui/icon/Icon';
import { getTodayString } from '@/app/_utils/dateTimeUtils';

import { useCalendar } from '../../../_contexts/CalendarContext';

export default function DesktopCalendarHeader() {
  const { goToNextMonth, goToPreviousMonth, goToToday, getMonthName, getYear } = useCalendar();

  const monthName = getMonthName();
  const year = getYear();
  const today = getTodayString();

  return (
    <div className="mb-5 flex shrink-0 flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {/* Previous Month Button */}
          <Button
            size="2"
            variant="surface"
            color="gray"
            onClick={goToPreviousMonth}
            className="!h-7 !w-7 !cursor-pointer !rounded-r-none !border-r-0"
          >
            <Icon size={20}>chevron_left</Icon>
          </Button>

          {/* Next Month Button */}
          <Button
            size="2"
            variant="surface"
            color="gray"
            onClick={goToNextMonth}
            className="!h-7 !w-7 !cursor-pointer !rounded-l-none"
          >
            <Icon size={20}>chevron_right</Icon>
          </Button>
        </div>

        {/* Today Button */}
        <Button
          size="2"
          variant="surface"
          color="gray"
          onClick={goToToday}
          className="!h-7 !cursor-pointer !px-[10px] !text-[13px]"
        >
          Today
        </Button>
      </div>

      <Heading size="5" weight="medium">
        {monthName}, {year}
      </Heading>

      {/* Add Daily Emotion Button */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="2" onClick={goToToday} className="!h-7 !cursor-pointer !gap-[3px] !pr-[10px] !pl-[6px]">
            <Icon size={18}>add</Icon>
            Today
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Link href={`/record/daily?date=${today}`}>
            <DropdownMenu.Item color="gray" className="!cursor-pointer !text-[13px]">
              Add Daily Emotion
            </DropdownMenu.Item>
          </Link>
          <Link href={`/record/moment?date=${today}`}>
            <DropdownMenu.Item color="gray" className="!cursor-pointer !text-[13px]">
              Add Moment Emotion
            </DropdownMenu.Item>
          </Link>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
