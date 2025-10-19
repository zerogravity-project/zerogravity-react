'use client';

import { Button, Heading, Text } from '@radix-ui/themes';

import { EmotionPlanetScene } from '@/app/_components/ui/emotion';
import { EMOTION_STEPS } from '@/app/_components/ui/emotion/_constants/emotion.constants';
import { Icon } from '@/app/_components/ui/icon';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import EmotionSlider from './EmotionSlider';

export default function EmotionStep() {
  const { emotionValueToStepIndex, nextStep, recordType } = useEmotionRecordContext();

  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        How was your today?
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        Select your today&apos;s {recordType} emotion.
      </Text>

      {/* Emotion Visual */}
      <div className="mb-20 flex h-full min-h-[160px] w-full flex-col items-center">
        <EmotionPlanetScene emotionId={emotionValueToStepIndex} width="100%" />
        <Text
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          className="mobile:!text-4xl !text-center !text-3xl !font-normal transition-all duration-400"
        >
          {EMOTION_STEPS[emotionValueToStepIndex].type}
        </Text>
      </div>

      {/* Emotion Slider */}
      <EmotionSlider />

      {/* Next Button */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] flex-col items-center">
        <Button
          onClick={nextStep}
          className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          size="4"
          radius="none"
        >
          Next
          <Icon>arrow_forward</Icon>
        </Button>
      </div>
    </>
  );
}
