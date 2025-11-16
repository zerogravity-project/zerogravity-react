'use client';

import { useRouter } from 'next/navigation';

import { Button, Heading, Text } from '@radix-ui/themes';
import { isToday } from 'date-fns';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import ReasonSelection from './ReasonSelection';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { useCreateEmotionRecordMutation } from '@/services/emotion/emotion.query';

export default function ReasonStep() {
  const router = useRouter();
  const { date, emotionId, emotionReasons, nextStep, prevStep, canGoNext, isFinalStep } = useEmotionRecordContext();

  const isTodayDate = date ? isToday(new Date(date)) : false;

  const { mutate: createEmotionRecord, isPending: isCreatingEmotionRecord } = useCreateEmotionRecordMutation({
    onSuccess: () => {
      router.push('/profile/calendar');
    },
    onError: error => {
      console.error('Failed to create emotion record:', error);
    },
  });

  const handleSubmit = () => {
    createEmotionRecord({
      emotionId,
      emotionRecordType: 'moment',
      emotionReasons,
      ...(!isTodayDate && date ? { recordDate: date } : {}),
    });
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
        <EmotionPlanetImage emotionId={emotionId} width={100} height={100} />
        <Text
          color={EMOTION_STEPS[emotionId].color}
          className="mobile:!text-xl !text-center !text-lg !font-normal transition-all duration-400"
        >
          {EMOTION_STEPS[emotionId].type}
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
          color={EMOTION_STEPS[emotionId].color}
          size="4"
          radius="none"
        >
          <Icon>arrow_back</Icon>
        </Button>
        <div className="w-full">
          <Button
            onClick={isFinalStep ? handleSubmit : nextStep}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            color={EMOTION_STEPS[emotionId].color}
            size="4"
            radius="none"
            disabled={!canGoNext || isCreatingEmotionRecord}
            loading={isCreatingEmotionRecord}
          >
            {isFinalStep ? 'Submit' : 'Next'}
            <Icon>{isFinalStep ? 'check' : 'arrow_forward'}</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
