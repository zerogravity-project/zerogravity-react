import { endOfWeek, format, startOfWeek } from 'date-fns';

import { useGetEmotionRecordsQuery } from '@/services/emotion/emotion.query';

import { useCalendar } from '../../_contexts/CalendarContext';

import CalendarHeader from './header/CalendarHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function MobileCalendar() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentDate, selectedDate } = useCalendar();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */

  /** Current week range (for header display) */
  const currentWeekStart = startOfWeek(currentDate);
  const currentWeekEnd = endOfWeek(currentDate);

  /** Selected date's week range (for detail display) */
  const selectedWeekStart = startOfWeek(selectedDate);
  const selectedWeekEnd = endOfWeek(selectedDate);

  /*
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */

  /** Current week data - for header date display */
  const { data: currentWeekRecords, isLoading: isCurrentWeekLoading } = useGetEmotionRecordsQuery({
    startDateTime: format(currentWeekStart, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(currentWeekEnd, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /** Selected date's week data - for detail display (uses cache if same week) */
  const { data: selectedWeekRecords, isLoading: isSelectedWeekLoading } = useGetEmotionRecordsQuery({
    startDateTime: format(selectedWeekStart, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(selectedWeekEnd, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /*
   * --------------------------------------------
   * 4. Computed Values
   * --------------------------------------------
   */

  /** Filter daily emotion records for selected date */
  const selectedDateDailyEmotionRecords = selectedWeekRecords?.data?.daily.find(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  /** Filter moment emotion records for selected date */
  const selectedDateMomentEmotionRecords = selectedWeekRecords?.data?.moment.filter(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center bg-[var(--background-dark)]">
        <CalendarHeader emotionRecords={currentWeekRecords?.data} isLoading={isCurrentWeekLoading} />
        <DailyEmotionSection emotionRecords={selectedDateDailyEmotionRecords} isLoading={isSelectedWeekLoading} />
      </div>
      <MomentEmotionSection emotionRecords={selectedDateMomentEmotionRecords} />
    </div>
  );
}
