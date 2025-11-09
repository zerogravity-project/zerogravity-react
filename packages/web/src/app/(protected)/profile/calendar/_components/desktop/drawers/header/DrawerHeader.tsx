import { Text } from '@radix-ui/themes/components/callout';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useCalendar } from '../../../../_contexts/CalendarContext';
import { getMonthName } from '../../../../_utils/dateUtils';

interface DrawerHeaderProps {
  onClose: () => void;
}
export default function DrawerHeader({ onClose }: DrawerHeaderProps) {
  const { selectedDate } = useCalendar();

  const selectedDateString = selectedDate.getDate();
  const selectedMonthString = getMonthName(selectedDate);
  const selectedYear = selectedDate.getFullYear();

  return (
    <header className="relative flex w-full items-center p-4">
      <Text size="3">
        {selectedMonthString} {selectedDateString}, {selectedYear}
      </Text>

      <button
        onClick={onClose}
        aria-label="Close drawer"
        className="absolute right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[var(--gray-a3)]"
      >
        <Icon size={20}>close</Icon>
      </button>
    </header>
  );
}
