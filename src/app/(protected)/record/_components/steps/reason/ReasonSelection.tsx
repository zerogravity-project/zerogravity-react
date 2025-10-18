import { Button } from '@radix-ui/themes';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

const REASON_LISTS = [
  'Health',
  'Fitness',
  'Self-care',
  'Hobby',
  'Identity',
  'Religion',
  'Community',
  'Family',
  'Friends',
  'Partner',
  'Romance',
  'Money',
  'Housework',
  'Work',
  'Education',
  'Travel',
  'Weather',
  'Domestic Issues',
  'Global Issues',
];

export default function ReasonSelection() {
  const { emotionValueToStepIndex, emotionReason, setEmotionReason } = useEmotionRecordContext();

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
        {REASON_LISTS.map(reason => (
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
