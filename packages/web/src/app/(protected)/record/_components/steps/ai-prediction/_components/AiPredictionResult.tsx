'use client';

import { Badge, Button, Heading, Text } from '@radix-ui/themes';
import { useCallback } from 'react';

import type { EmotionId } from '@zerogravity/shared/components/ui/emotion';
import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';

import { FINAL_STEP, useEmotionRecordContext } from '../../../../_contexts/EmotionRecordContext';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import type { EmotionPredictionResponse } from '@/services/ai/ai.dto';

interface AiPredictionResultProps {
  predictionData: EmotionPredictionResponse;
  resetPredictEmotionMutation: () => void;
}

export default function AiPredictionResult({ predictionData, resetPredictEmotionMutation }: AiPredictionResultProps) {
  /**
   * ------------------------------------------------------------
   * 1. External Hooks
   * ------------------------------------------------------------
   */
  const { setEmotionId, setDiaryEntry, setEmotionReasons, setAiAnalysisId, goToStep, emotionRecordType } =
    useEmotionRecordContext();

  /**
   * ------------------------------------------------------------
   * 2. Callbacks
   * ------------------------------------------------------------
   */

  /** Accept AI suggestion and apply to emotion record */
  const handleAccept = useCallback(() => {
    // Apply AI suggestions to EmotionRecordContext
    if (predictionData.suggestedEmotionId) {
      setEmotionId(predictionData.suggestedEmotionId as EmotionId);
    }
    if (predictionData.suggestedReasons && predictionData.suggestedReasons.length > 0) {
      setEmotionReasons(predictionData.suggestedReasons);
    }

    if (predictionData.refinedDiary) {
      setDiaryEntry(predictionData.refinedDiary);
    }
    setAiAnalysisId(predictionData.analysisId);

    // Go to Final Step
    if (predictionData.suggestedEmotionId) {
      goToStep(FINAL_STEP[emotionRecordType]);
    }
  }, [predictionData, setEmotionId, setEmotionReasons, setDiaryEntry, setAiAnalysisId, goToStep, emotionRecordType]);

  /** Reject AI suggestion and go back to manual selection */
  const handleReject = useCallback(() => {
    resetPredictEmotionMutation();
  }, [resetPredictEmotionMutation]);

  /**
   * ------------------------------------------------------------
   * 3. Render
   * ------------------------------------------------------------
   */
  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        AI Analysis Complete
      </Heading>
      <div className="flex items-center justify-center gap-2">
        <GeminiLogo width={14} />
        <Text color="gray" className="mobile:text-base text-center text-sm font-light">
          Here&apos;s what Gemini AI found
        </Text>
      </div>

      {/* AI Analysis Results */}
      <div className="flex w-full max-w-[480px] flex-col gap-6 pt-6">
        {/* Suggested Emotion */}
        {predictionData.suggestedEmotionId && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-[var(--gray-a5)] p-6">
            <Text color="gray" size="2" weight="medium">
              Suggested Emotion
            </Text>
            <EmotionPlanetImage emotionId={predictionData.suggestedEmotionId} width={80} height={80} />
            <Text color={EMOTION_STEPS[predictionData.suggestedEmotionId].color} className="!text-2xl !font-normal">
              {EMOTION_STEPS[predictionData.suggestedEmotionId].type}
            </Text>
          </div>
        )}

        {/* Suggested Reasons */}
        {predictionData.suggestedReasons && predictionData.suggestedReasons.length > 0 && (
          <div className="flex flex-col gap-3 rounded-3xl border border-[var(--gray-a5)] p-6">
            <Text color="gray" size="2" weight="medium" className="text-center">
              Suggested Reasons
            </Text>
            <div className="flex flex-wrap justify-center gap-2">
              {predictionData.suggestedReasons?.map(reason => (
                <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
                  {reason}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Reasoning */}
        <div className="flex flex-col gap-3 rounded-3xl border border-[var(--gray-a5)] p-6">
          <Text color="gray" size="2" weight="medium">
            AI Analysis
          </Text>
          <Text size="2" className="!leading-relaxed">
            {predictionData.reasoning}
          </Text>
          <div className="mt-2 flex items-center justify-between">
            <Text color="gray" size="1">
              Confidence
            </Text>
            <Text size="1" weight="medium">
              {Math.round(predictionData.confidence * 100)}%
            </Text>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] flex-col gap-3">
        <div className="flex w-full gap-3">
          <Button
            onClick={handleReject}
            variant="surface"
            className="mobile:!rounded-[9999px] !flex-1 !cursor-pointer"
            size="4"
            radius="none"
          >
            <Icon>close</Icon>
            Reject
          </Button>
          <Button
            onClick={handleAccept}
            className="mobile:!rounded-[9999px] !flex-1 !cursor-pointer"
            size="4"
            radius="none"
          >
            Accept
            <Icon>check</Icon>
          </Button>
        </div>
      </div>
    </>
  );
}
