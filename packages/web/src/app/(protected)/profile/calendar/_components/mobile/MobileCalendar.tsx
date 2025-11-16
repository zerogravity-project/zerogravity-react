import { endOfWeek, format, startOfWeek } from 'date-fns';

import { useCalendar } from '../../_contexts/CalendarContext';

import CalendarHeader from './header/CalendarHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

import { useGetEmotionRecordsQuery } from '@/services/emotion/emotion.query';

export default function MobileCalendar() {
  const { currentDate, selectedDate } = useCalendar();

  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);

  const { data: emotionRecords } = useGetEmotionRecordsQuery({
    startDateTime: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
    endDateTime: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
  });

  const selectedDateDailyEmotionRecords = emotionRecords?.data?.daily.find(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const selectedDateMomentEmotionRecords = emotionRecords?.data?.moment.filter(
    record => format(record.createdAt, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

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
