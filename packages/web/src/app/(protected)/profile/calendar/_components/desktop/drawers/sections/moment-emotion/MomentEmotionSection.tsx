import { Text } from '@radix-ui/themes';

import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import MomentEmotionList from './MomentEmotionList';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MomentEmotionSectionProps {
  momentEmotionRecords?: EmotionRecordDetail[];
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function MomentEmotionSection({ momentEmotionRecords }: MomentEmotionSectionProps) {
  return (
    <section className="flex w-full flex-col items-center">
      {momentEmotionRecords?.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center py-12">
          <Text as="p" className="!text-[13px] !leading-[17px] !text-[var(--gray-a7)]" align="center">
            A quiet day so far
          </Text>
        </div>
      ) : (
        <ul className="flex w-full flex-col items-center gap-6 pt-5 pr-4.5 pb-6 pl-3">
          {momentEmotionRecords?.map((record, index) => (
            <MomentEmotionList
              key={index}
              emotionId={record.emotionId}
              time={record.createdAt}
              reasons={record.reasons}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
