import { Text } from '@radix-ui/themes/components/callout';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useCalendar } from '../../../../_contexts/CalendarContext';
import { getMonthName } from '../../../../_utils/dateUtils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DrawerHeaderProps {
  onClose: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DrawerHeader({ onClose }: DrawerHeaderProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { selectedDate } = useCalendar();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const selectedDateString = selectedDate.getDate();
  const selectedMonthString = getMonthName(selectedDate);
  const selectedYear = selectedDate.getFullYear();

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
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
