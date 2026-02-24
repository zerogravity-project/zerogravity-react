'use client';

import { useRouter } from 'next/navigation';

import { Heading, Text } from '@radix-ui/themes';
import { isToday } from 'date-fns';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_STEPS } from '@zerogravity/shared/entities/emotion';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { useCreateEmotionRecordMutation } from '@/services/emotion/emotion.query';

import GeminiButton from '../../../../../_components/ui/button/GeminiButton';
import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import ReasonSelection from './ReasonSelection';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function ReasonStep() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { openAlertModal } = useModal();
  const { date, emotionId, emotionReasons, nextStep, prevStep, canGoNext, isFinalStep, goToStep } =
    useEmotionRecordContext();

  /*
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const {
    mutate: createEmotionRecord,
    isPending: isCreatingEmotionRecord,
    isSuccess: isCreateSuccess,
  } = useCreateEmotionRecordMutation({
    onSuccess: () => {
      router.push('/profile/calendar');
    },
    onError: error => {
      console.error('[ReasonStep] Failed to create emotion record:', error);
      openAlertModal({
        title: 'Save Failed',
        description: error.response?.data?.message || 'Failed to save your emotion record. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const isTodayDate = date ? isToday(new Date(date)) : false;

  /*
   * --------------------------------------------
   * 4. Event Handlers
   * --------------------------------------------
   */

  /** Submit emotion record */
  const handleSubmit = () => {
    createEmotionRecord({
      emotionId,
      emotionRecordType: 'moment',
      emotionReasons,
      ...(!isTodayDate && date ? { recordDate: date } : {}),
    });
  };

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
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
      <div className="mobile:pb-20 flex w-full max-w-[480px] flex-col gap-6">
        <GeminiButton className="mobile:!hidden" onClick={() => goToStep('ai-prediction')}>
          Use AI Prediction with Gemini
        </GeminiButton>

        <div className="flex w-full items-center gap-3">
          <MotionButton
            onClick={prevStep}
            variant="surface"
            className="mobile:!rounded-[9999px] max-mobile:!hidden !w-12 !p-0"
            color={EMOTION_STEPS[emotionId].color}
            size="4"
            radius="none"
            aria-label="Go to previous step"
          >
            <Icon>arrow_back</Icon>
          </MotionButton>
          <div className="w-full">
            <MotionButton
              onClick={isFinalStep ? handleSubmit : nextStep}
              className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full"
              color={EMOTION_STEPS[emotionId].color}
              size="4"
              radius="none"
              disabled={!canGoNext || isCreatingEmotionRecord || isCreateSuccess}
              loading={isCreatingEmotionRecord}
            >
              {isFinalStep ? 'Submit' : 'Next'}
              <Icon>{isFinalStep ? 'check' : 'arrow_forward'}</Icon>
            </MotionButton>
          </div>
        </div>

        <GeminiButton className="max-mobile:!hidden" onClick={() => goToStep('ai-prediction')}>
          Use AI Prediction with Gemini
        </GeminiButton>
      </div>
    </>
  );
}
