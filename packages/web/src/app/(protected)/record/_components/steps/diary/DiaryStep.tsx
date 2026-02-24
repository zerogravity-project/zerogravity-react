'use client';

import { useRouter } from 'next/navigation';

import { Badge, Heading, Text } from '@radix-ui/themes';
import { isToday } from 'date-fns';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_STEPS } from '@zerogravity/shared/entities/emotion';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { useCreateEmotionRecordMutation, useUpdateEmotionRecordMutation } from '@/services/emotion/emotion.query';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import DiaryTextArea from './DiaryTextArea';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DiaryStep() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { openAlertModal } = useModal();
  const { date, emotionId, emotionReasons, diaryEntry, prevStep, emotionRecordId } = useEmotionRecordContext();

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
      console.error('[DiaryStep] Failed to create emotion record:', error);
      openAlertModal({
        title: 'Save Failed',
        description: error.response?.data?.message || 'Failed to save your emotion record. Please try again.',
      });
    },
  });

  const {
    mutate: updateEmotionRecord,
    isPending: isUpdatingEmotionRecord,
    isSuccess: isUpdateSuccess,
  } = useUpdateEmotionRecordMutation({
    onSuccess: () => {
      router.push('/profile/calendar');
    },
    onError: error => {
      console.error('[DiaryStep] Failed to update emotion record:', error);
      openAlertModal({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update your emotion record. Please try again.',
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

  /** Submit emotion record (create or update) */
  const handleSubmit = () => {
    if (emotionRecordId) {
      updateEmotionRecord({
        emotionRecordId,
        data: {
          emotionId,
          emotionReasons,
          diaryEntry,
        },
      });
      return;
    }

    createEmotionRecord({
      emotionId,
      emotionRecordType: 'daily',
      emotionReasons,
      diaryEntry,
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
        Tell us more about your day
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        Write your thoughts and feelings. (Optional)
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
        <div className="mt-5 flex max-w-[480px] flex-wrap gap-2 px-5">
          {emotionReasons.map(reason => (
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
            onClick={handleSubmit}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full"
            color={EMOTION_STEPS[emotionId].color}
            size="4"
            radius="none"
            loading={isCreatingEmotionRecord || isUpdatingEmotionRecord}
            disabled={isCreatingEmotionRecord || isUpdatingEmotionRecord || isCreateSuccess || isUpdateSuccess}
          >
            Submit
            <Icon>check</Icon>
          </MotionButton>
        </div>
      </div>
    </>
  );
}
