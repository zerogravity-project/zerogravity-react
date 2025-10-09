import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import { Slider } from '@/app/_components/ui/slider';

import { useEmotionRecordContext } from '../_contexts/EmotionRecordContext';

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
    <div className="mb-20 flex w-full max-w-[450px] flex-col items-center px-5 sm:px-0">
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
    </div>
  );
}
