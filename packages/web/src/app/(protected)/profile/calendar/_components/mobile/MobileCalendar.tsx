import { endOfWeek, format, startOfWeek } from 'date-fns';

import { useGetEmotionRecordsQuery } from '@/services/emotion/emotion.query';

import { useCalendar } from '../../_contexts/CalendarContext';

import CalendarHeader from './header/CalendarHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

/**
 * ============================================
 * Component
 * ============================================
 */

export default function MobileCalendar() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentDate, selectedDate } = useCalendar();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  /**
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */
  const { data: emotionRecords } = useGetEmotionRecordsQuery({
    startDateTime: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  /**
   * --------------------------------------------
   * 4. Computed Values
   * --------------------------------------------
   */

  /** Filter daily emotion records for selected date */
  const selectedDateDailyEmotionRecords = emotionRecords?.data?.daily.find(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  /** Filter moment emotion records for selected date */
  const selectedDateMomentEmotionRecords = emotionRecords?.data?.moment.filter(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  /**
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center bg-[var(--background-dark)]">
        <CalendarHeader emotionRecords={emotionRecords?.data} />
        <DailyEmotionSection emotionRecords={selectedDateDailyEmotionRecords} />
      </div>
      <MomentEmotionSection emotionRecords={selectedDateMomentEmotionRecords} />
    </div>
  );
}
