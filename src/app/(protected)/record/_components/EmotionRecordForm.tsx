'use client';

import { Button, Heading, Text } from '@radix-ui/themes';

import { EmotionPlanetScene } from '@/app/_components/ui/emotion';
import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import { Icon } from '@/app/_components/ui/icon';

import { useEmotionRecordContext } from '../_contexts/EmotionRecordContext';

import EmotionSlider from './EmotionSlider';

export default function EmotionRecordForm() {
  const { emotionValueToStepIndex } = useEmotionRecordContext();

  return (
    <form className="flex h-full w-full flex-col items-center justify-between">
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <Text className="text-center text-lg font-light sm:text-xl">How was your today?</Text>
        <Text color="gray" className="text-center text-sm font-light sm:text-base">
          Select your today&apos;s moment emotion.
        </Text>
      </div>

      {/* Emotion Visual */}
      <div className="mb-20 flex w-full flex-1 flex-col items-center">
        <EmotionPlanetScene emotionId={emotionValueToStepIndex} className="flex-1" width="100%" />
        <Heading
          as="h2"
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          className="!text-center !text-3xl !font-normal sm:!text-4xl"
        >
          {EMOTION_STEPS[emotionValueToStepIndex].type}
        </Heading>
      </div>

      {/* Emotion Slider */}
      <EmotionSlider />

      {/* Button */}
      <div className="flex w-full max-w-[450px] flex-col items-center">
        <Button
          className="!w-full !cursor-pointer sm:!rounded-[9999px]"
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          size="4"
          radius="none"
        >
          Next
          <Icon>arrow_forward</Icon>
        </Button>
      </div>
    </form>
  );
}
