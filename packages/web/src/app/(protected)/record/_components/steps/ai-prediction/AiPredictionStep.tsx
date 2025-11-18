import { Button, Heading, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import AiPredictionTextArea from './AiPredictionTextArea';

import { usePredictEmotionMutation } from '@/services/ai/ai.query';

export default function AiPredictionStep() {
  const { goToStep, canGoNext, diaryEntry } = useEmotionRecordContext();
  const { mutate: predictEmotion, isPending: isPredictingEmotion } = usePredictEmotionMutation();

  const handleSubmit = () => {
    if (!canGoNext || !diaryEntry) {
      return;
    }

    predictEmotion({ diaryEntry });
  };

  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        AI Prediction
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        We&apos;ll use AI to predict your emotion and reason.
      </Text>

      {/* AI Prediction Text Area */}
      <AiPredictionTextArea />

      {/* Navigation Buttons */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] gap-3">
        <Button
          onClick={() => goToStep('emotion')}
          variant="surface"
          className="mobile:!rounded-[9999px] max-mobile:!hidden !w-12 !cursor-pointer"
          size="4"
          radius="none"
        >
          <Icon>arrow_back</Icon>
        </Button>
        <div className="w-full">
          <Button
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            size="4"
            radius="none"
            disabled={!canGoNext || isPredictingEmotion}
            loading={isPredictingEmotion}
            onClick={handleSubmit}
          >
            Submit
            <Icon>check</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
