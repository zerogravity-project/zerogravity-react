import Link from 'next/link';

import { Button, Heading } from '@radix-ui/themes';

import { formatDateString } from '@zerogravity/shared/utils';

import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import { useCalendar } from '../../../../_contexts/CalendarContext';

import MomentEmotionList from './MomentEmotionList';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MomentEmotionSectionProps {
  emotionRecords?: EmotionRecordDetail[];
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function MomentEmotionSection({ emotionRecords }: MomentEmotionSectionProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { selectedDate } = useCalendar();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const selectedDateString = formatDateString(selectedDate);

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
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
        {emotionRecords?.map((record, index) => (
          <MomentEmotionList
            key={index}
            emotionId={record.emotionId}
            time={record.createdAt}
            reasons={record.reasons}
          />
        ))}
      </ul>
    </section>
  );
}
