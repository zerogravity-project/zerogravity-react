import { Button } from '@radix-ui/themes';

import { EMOTION_REASONS, EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

export default function ReasonSelection() {
  const {
    emotionValueToStepIndex,
    emotionReasons: emotionReason,
    setEmotionReasons: setEmotionReason,
  } = useEmotionRecordContext();

  const toggleReason = (reason: string) => {
    if (emotionReason.includes(reason)) {
      setEmotionReason(emotionReason.filter(r => r !== reason));
    } else {
      setEmotionReason([...emotionReason, reason]);
    }
  };

  return (
    <div className="max-mobile:px-5 flex w-full flex-1 flex-col items-center pt-10 pb-12">
      <div className="flex w-full max-w-[480px] flex-wrap gap-3">
        {EMOTION_REASONS.map(reason => (
          <Button
            key={reason}
            onClick={() => toggleReason(reason)}
            color={EMOTION_STEPS[emotionValueToStepIndex].color}
            variant={emotionReason.includes(reason) ? 'solid' : 'soft'}
            size="2"
            radius="full"
            className="!w-fit !cursor-pointer"
          >
            {reason}
          </Button>
        ))}
      </div>
    </div>
  );
}
