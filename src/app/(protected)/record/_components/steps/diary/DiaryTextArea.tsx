import { TextArea } from '@radix-ui/themes';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

export default function DiaryTextArea() {
  const { diaryEntry, setDiaryEntry, emotionValueToStepIndex } = useEmotionRecordContext();

  return (
    <div className="mobile:pb-12 max-mobile:px-2 flex h-full w-full max-w-[480px] flex-1 flex-col gap-3 pt-10 pb-3">
      <TextArea
        value={diaryEntry}
        onChange={e => setDiaryEntry(e.target.value)}
        placeholder="What made you feel this way? What happened today?"
        size="3"
        radius="full"
        color={EMOTION_STEPS[emotionValueToStepIndex].color}
        className="h-full !min-h-[150px] !w-full !shadow-none [&_textarea]:!px-5 [&_textarea]:!py-3.5"
      />
    </div>
  );
}
