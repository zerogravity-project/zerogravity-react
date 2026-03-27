import { redirect } from 'next/navigation';

import { endOfDay, format, isToday, parseISO, startOfDay } from 'date-fns';

import { getEmotionRecordsServer } from '@/services/emotion/emotion.service.server';

import EmotionRecord from '../_components/EmotionRecord';
import { EmotionRecordProvider } from '../_contexts/EmotionRecordContext';

interface DailyRecordPageProps {
  searchParams: Promise<{
    date?: string; // format: YYYY-MM-DD
  }>;
}

export default async function DailyRecordPage({ searchParams }: DailyRecordPageProps) {
  const { date } = await searchParams;
  const dateValue = date ?? null;

  // Fetch initial data on server if date is provided
  // Throws on error → caught by error.tsx (daily records are one-per-date, empty form would fail)
  let existingRecord = null;
  if (date) {
    const startDateTime = format(startOfDay(date), "yyyy-MM-dd'T'HH:mm:ss");
    const endDateTime = format(endOfDay(date), "yyyy-MM-dd'T'HH:mm:ss");

    const response = await getEmotionRecordsServer({
      startDateTime,
      endDateTime,
    });

    // Get existing daily record for this date (should be max 1)
    existingRecord = response.data.daily[0] || null;
  }

  // Edit mode (existing record) only allowed for today's date
  if (existingRecord && date && !isToday(parseISO(date))) {
    redirect('/profile/calendar');
  }

  return (
    <EmotionRecordProvider
      emotionRecordType="daily"
      date={dateValue}
      emotionRecordId={existingRecord?.emotionRecordId}
      initialDailyEmotionId={existingRecord?.emotionId}
      initialDailyEmotionReasons={existingRecord?.reasons}
      initialDailyDiaryEntry={existingRecord?.diaryEntry ?? ''}
    >
      <section className="mobile:px-5 absolute inset-0 flex h-[100dvh] w-[100dvw] flex-col items-center overflow-y-auto pt-[96px]">
        <EmotionRecord />
      </section>
    </EmotionRecordProvider>
  );
}
