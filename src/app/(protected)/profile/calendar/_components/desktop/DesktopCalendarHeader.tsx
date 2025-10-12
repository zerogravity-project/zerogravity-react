import Link from 'next/link';

import { Button, DropdownMenu, Heading } from '@radix-ui/themes';

import Icon from '@/app/_components/ui/icon/Icon';
import { getTodayString } from '@/app/_utils/dateTimeUtils';

import { useCalendar } from '../_contexts/CalendarContext';

export default function DesktopCalendarHeader() {
  const { goToNextMonth, goToPreviousMonth, goToToday, getMonthName, getYear } = useCalendar();

  const monthName = getMonthName();
  const year = getYear();
  const today = getTodayString();

  return (
    <div className="mb-5 flex shrink-0 flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Button
            size="2"
            variant="surface"
            color="gray"
            onClick={goToPreviousMonth}
            className="!w-8 !cursor-pointer !rounded-r-none !border-r-0"
          >
            <Icon>chevron_left</Icon>
          </Button>
          <Button
            size="2"
            variant="surface"
            color="gray"
            onClick={goToNextMonth}
            className="!w-8 !cursor-pointer !rounded-l-none"
          >
            <Icon>chevron_right</Icon>
          </Button>
        </div>
        <Button size="2" variant="surface" color="gray" onClick={goToToday} className="!cursor-pointer">
          Today
        </Button>
      </div>

      <Heading size="5" weight="medium">
        {monthName}, {year}
      </Heading>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size="2" onClick={goToToday} className="!cursor-pointer !gap-[6px] !pl-[8px]">
            <Icon>add</Icon>
            Today
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Link href={`/record/daily?date=${today}`}>
            <DropdownMenu.Item color="gray" className="!cursor-pointer">
              Add Daily Emotion
            </DropdownMenu.Item>
          </Link>
          <Link href={`/record/moment?date=${today}`}>
            <DropdownMenu.Item color="gray" className="!cursor-pointer">
              Add Moment Emotion
            </DropdownMenu.Item>
          </Link>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
