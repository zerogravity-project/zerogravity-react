'use client';

import { useRouter } from 'next/navigation';

import { Badge, Button, Heading, Text } from '@radix-ui/themes';
import { isToday } from 'date-fns';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { Icon } from '@zerogravity/shared/components/ui/icon';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import { useCreateEmotionRecordMutation, useUpdateEmotionRecordMutation } from '@/services/emotion/emotion.query';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import DiaryTextArea from './DiaryTextArea';

export default function DiaryStep() {
  const router = useRouter();
  const { date, emotionId, emotionReasons, diaryEntry, prevStep, emotionRecordId } = useEmotionRecordContext();

  const isTodayDate = date ? isToday(new Date(date)) : false;

  const { mutate: createEmotionRecord, isPending: isCreatingEmotionRecord } = useCreateEmotionRecordMutation({
    onSuccess: () => {
      router.push('/profile/calendar');
    },
    onError: error => {
      console.error('Failed to create emotion record:', error);
    },
  });

  const { mutate: updateEmotionRecord, isPending: isUpdatingEmotionRecord } = useUpdateEmotionRecordMutation({
    onSuccess: () => {
      router.push('/profile/calendar');
    },
    onError: error => {
      console.error('Failed to update emotion record:', error);
    },
  });

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
            onClick={handleSubmit}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            color={EMOTION_STEPS[emotionId].color}
            size="4"
            radius="none"
            loading={isCreatingEmotionRecord || isUpdatingEmotionRecord}
            disabled={isCreatingEmotionRecord || isUpdatingEmotionRecord}
          >
            Submit
            <Icon>check</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
