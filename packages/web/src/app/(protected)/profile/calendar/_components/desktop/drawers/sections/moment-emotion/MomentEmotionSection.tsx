import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import MomentEmotionList from './MomentEmotionList';

interface MomentEmotionSectionProps {
  momentEmotionRecords?: EmotionRecordDetail[];
}

export default function MomentEmotionSection({ momentEmotionRecords }: MomentEmotionSectionProps) {
  return (
    <section className="flex w-full flex-col items-center">
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
    </section>
  );
}
