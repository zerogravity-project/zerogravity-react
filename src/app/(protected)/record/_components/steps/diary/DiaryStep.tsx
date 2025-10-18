'use client';

import { Badge, Button, Heading, Text } from '@radix-ui/themes';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import EmotionPlanetImage from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { Icon } from '@/app/_components/ui/icon';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import DiaryTextArea from './DiaryTextArea';

export default function DiaryStep() {
  const { emotionReason, prevStep, emotionValueToStepIndex } = useEmotionRecordContext();

  const handleSubmit = () => {
    // TODO: Submit form data
    console.log('Form submitted!');
  };

  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        Tell us more about your day
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        Write your thoughts and feelings. (Optional)
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
        <div className="mt-5 flex max-w-[480px] flex-wrap gap-2 px-5">
          {emotionReason.map(reason => (
            <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
              {reason}
            </Badge>
          ))}
        </div>
      </div>

      {/* Diary Entry */}
      <DiaryTextArea />

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
            onClick={handleSubmit}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            color={EMOTION_STEPS[emotionValueToStepIndex].color}
            size="4"
            radius="none"
          >
            Submit
            <Icon>check</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
