'use client';

import { Badge, Heading, ScrollArea, Text } from '@radix-ui/themes';
import { useCallback } from 'react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';
import { EMOTION_STEPS, type EmotionId, type EmotionReason } from '@zerogravity/shared/entities/emotion';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';
import type { EmotionPredictionResponse } from '@/services/ai/ai.dto';

import { useEmotionRecordContext } from '../../../../_contexts/EmotionRecordContext';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface AiPredictionResultProps {
  predictionData: EmotionPredictionResponse;
  resetPredictEmotionMutation: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function AiPredictionResult({ predictionData, resetPredictEmotionMutation }: AiPredictionResultProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { applyAiPrediction } = useEmotionRecordContext();

  /*
   * --------------------------------------------
   * 2. Callbacks
   * --------------------------------------------
   */

  /** Accept AI suggestion and apply to emotion record */
  const handleAccept = useCallback(() => {
    if (!predictionData.suggestedEmotionId || !predictionData.suggestedReasons) {
      return;
    }

    // Apply AI prediction and navigate to final step
    applyAiPrediction({
      suggestedEmotionId: predictionData.suggestedEmotionId as EmotionId,
      suggestedReasons: predictionData.suggestedReasons as EmotionReason[],
      refinedDiary: predictionData.refinedDiary,
      analysisId: predictionData.analysisId,
    });
  }, [predictionData, applyAiPrediction]);

  /** Reject AI suggestion and go back to manual selection */
  const handleReject = useCallback(() => {
    resetPredictEmotionMutation();
  }, [resetPredictEmotionMutation]);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */

  /** Current emotion step data based on suggested emotion ID */
  const emotionStep = predictionData.suggestedEmotionId ? EMOTION_STEPS[predictionData.suggestedEmotionId] : null;

  /** Emotion color for styling */
  const emotionColor = emotionStep?.color;

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
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
      <div className="mobile:pb-12 flex min-h-0 w-full max-w-[480px] flex-1 flex-col gap-10 overflow-hidden py-10">
        {/* Emotion Visual */}
        <div className="flex flex-col items-center justify-center">
          {emotionStep && (
            <>
              <EmotionPlanetImage emotionId={predictionData.suggestedEmotionId!} width={100} height={100} />
              <Text
                color={emotionColor}
                className="mobile:!text-xl !text-center !text-lg !font-normal transition-all duration-400"
              >
                {emotionStep.type}
              </Text>
            </>
          )}
          {predictionData.suggestedReasons && predictionData.suggestedReasons.length > 0 && (
            <div className="mt-5 flex max-w-[480px] flex-wrap gap-2 px-5">
              {predictionData.suggestedReasons.map(reason => (
                <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
                  {reason}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {/* AI Reasoning */}

        <div className="max-mobile:mx-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[6px] border border-[var(--gray-3)] bg-[var(--color-surface)]">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-[var(--gray-3)] bg-[var(--gray-a2)] px-5 pt-3.5 pb-3">
              <div className="flex items-center gap-2">
                <Icon size={16}>auto_awesome</Icon>
                <Text color="gray" size="3" weight="medium">
                  AI Analysis
                </Text>
              </div>

              <Text size="2" color={emotionColor} weight="medium">
                (Confidence: {Math.round(predictionData.confidence * 100)}%)
              </Text>
            </div>

            <ScrollArea type="auto" scrollbars="vertical" style={{ height: '100%' }}>
              <div className="px-5 py-4">
                <Text size="2" className="!leading-relaxed">
                  {predictionData.reasoning}
                </Text>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mobile:pb-20 standalone:max-mobile:px-5 standalone:max-mobile:pb-safe flex w-full max-w-[480px] gap-3">
        <MotionButton
          onClick={handleReject}
          variant="surface"
          className="mobile:!rounded-[9999px] max-mobile:!hidden !w-12 !p-0"
          color={emotionColor}
          size="4"
          radius="none"
          aria-label="Reject and go back"
        >
          <Icon>arrow_back</Icon>
        </MotionButton>
        <div className="w-full">
          <MotionButton
            onClick={handleAccept}
            className="mobile:!rounded-[9999px] max-mobile:!h-[var(--mobile-bottom-btn-height)] max-mobile:!rounded-none standalone:max-mobile:!rounded-[var(--radius-4)] !w-full"
            color={emotionColor}
            size="4"
          >
            Accept
            <Icon>check</Icon>
          </MotionButton>
        </div>
      </div>
    </>
  );
}
