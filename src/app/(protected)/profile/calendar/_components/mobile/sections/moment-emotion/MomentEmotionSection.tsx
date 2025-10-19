import Link from 'next/link';

import { Button, Heading } from '@radix-ui/themes';

import { formatDateString } from '@/app/_utils/dateTimeUtils';

import { useCalendar } from '../../../../_contexts/CalendarContext';

import MomentEmotionList from './MomentEmotionList';

export default function MomentEmotionSection() {
  const { selectedDate } = useCalendar();
  const selectedDateString = formatDateString(selectedDate);

  return (
    <section className="flex min-h-[320px] w-full flex-shrink-0 flex-col items-center border-t border-[var(--gray-3)] px-5 pt-6 pb-8">
      <div className="mb-4 flex w-full items-center justify-between">
        <Heading as="h2" size="4" weight="medium">
          Moment Emotion
        </Heading>
        <Link href={`/record/daily?date=${selectedDateString}`}>
          <Button variant="soft" radius="full" className="!cursor-pointer">
            Add
          </Button>
        </Link>
      </div>

      <ul className="flex w-full flex-col items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <MomentEmotionList
            key={index}
            emotionId={Math.floor(Math.random() * 7)}
            time={new Date().toISOString()}
            reasons={['Health', 'Fitness', 'Self-care', 'Hobby', 'Identity', 'Religion']}
          />
        ))}
      </ul>
    </section>
  );
}
