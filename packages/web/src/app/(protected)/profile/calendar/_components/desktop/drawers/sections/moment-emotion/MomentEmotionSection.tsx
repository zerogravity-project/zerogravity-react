import { Text } from '@radix-ui/themes';
import { motion } from 'motion/react';

import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import MomentEmotionList from './MomentEmotionList';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MomentEmotionSectionProps {
  momentEmotionRecords?: EmotionRecordDetail[];
}

/*
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
            <motion.div
              key={record.createdAt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.05 }}
              className="w-full"
            >
              <MomentEmotionList emotionId={record.emotionId} time={record.createdAt} reasons={record.reasons} />
            </motion.div>
          ))}
        </ul>
      )}
    </section>
  );
}
