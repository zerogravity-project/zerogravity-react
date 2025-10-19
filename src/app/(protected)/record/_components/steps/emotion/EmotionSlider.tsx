import { Text } from '@radix-ui/themes';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/_constants/emotion.constants';
import { Slider } from '@/app/_components/ui/slider';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

export default function EmotionSlider() {
  const { setEmotionId, emotionSliderValue, setEmotionSliderValue, emotionValueToStepIndex } =
    useEmotionRecordContext();

  const handleValueCommit = () => {
    if (emotionSliderValue[0] !== EMOTION_STEPS[emotionValueToStepIndex].sliderValue) {
      setEmotionSliderValue([EMOTION_STEPS[emotionValueToStepIndex].sliderValue]);
    }
    setEmotionId(emotionValueToStepIndex);
  };

  return (
    <div className="mobile:px-0 mb-15 flex w-full max-w-[480px] flex-col items-center gap-3 px-5">
      <Slider
        value={emotionSliderValue}
        onValueChange={setEmotionSliderValue}
        min={0}
        max={100}
        step={1}
        colors={{
          ring: EMOTION_STEPS[emotionValueToStepIndex].style.slider.ring,
          ringOffset: EMOTION_STEPS[emotionValueToStepIndex].style.slider.ringOffset,
        }}
        onValueCommit={handleValueCommit}
      />
      <div className="flex w-full items-center justify-between px-2">
        <Text color="gray" size="1">
          Negative
        </Text>
        <Text color="gray" size="1">
          Positive
        </Text>
      </div>
    </div>
  );
}
