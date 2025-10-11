'use client';

import { Button, Heading, Text } from '@radix-ui/themes';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import EmotionPlanetImage from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { Icon } from '@/app/_components/ui/icon';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import ReasonSelection from './ReasonSelection';

export default function ReasonStep() {
  const { emotionValueToStepIndex, nextStep, prevStep, canGoNext, isFinalStep } = useEmotionRecordContext();

  const handleSubmit = () => {
    // TODO: Submit form data
    console.log('Form submitted!');
  };

  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        Why did you feel this way?
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        Select one or more reasons.
      </Text>

      {/* Emotion Visual */}
      <div className="mt-10 flex flex-col items-center justify-center">
        <EmotionPlanetImage emotionId={emotionValueToStepIndex} width={100} height={100} />
        <Text
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          className="mobile:!text-xl !text-center !text-lg !font-normal transition-all duration-400"
        >
          {EMOTION_STEPS[emotionValueToStepIndex].type}
        </Text>
      </div>

      {/* Reason Selection */}
      <ReasonSelection />

      {/* Navigation Buttons */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] gap-3">
        <Button
          onClick={prevStep}
          variant="surface"
          className="mobile:!rounded-[9999px] max-mobile:!hidden !w-12 !cursor-pointer"
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          size="4"
          radius="none"
        >
          <Icon>arrow_back</Icon>
        </Button>
        <div className="w-full">
          <Button
            onClick={isFinalStep ? handleSubmit : nextStep}
            disabled={!canGoNext}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            color={EMOTION_STEPS[emotionValueToStepIndex].color}
            size="4"
            radius="none"
          >
            {isFinalStep ? 'Submit' : 'Next'}
            <Icon>{isFinalStep ? 'check' : 'arrow_forward'}</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
