'use client';

import { Heading, Text } from '@radix-ui/themes';
import { useState } from 'react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { EmotionPlanetScene } from '@zerogravity/shared/components/ui/emotion/scene';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_STEPS } from '@zerogravity/shared/entities/emotion';

import GeminiButton from '@/app/_components/ui/button/GeminiButton';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

import EmotionSlider from './EmotionSlider';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionStep() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { emotionValueToStepIndex, nextStep, goToStep, emotionRecordType } = useEmotionRecordContext();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        How was your today?
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        Select your today&apos;s {emotionRecordType} emotion.
      </Text>

      {/* Emotion Visual */}
      <div className="mb-16 flex h-full min-h-[160px] w-full flex-col items-center">
        <EmotionPlanetScene
          emotionId={emotionValueToStepIndex}
          width="100%"
          onSceneLoaded={() => setIsSceneLoaded(true)}
          showPerf={true}
        />
        <Text
          color={EMOTION_STEPS[emotionValueToStepIndex].color}
          className="mobile:!text-4xl !text-center !text-3xl !font-normal transition-all duration-400"
        >
          {EMOTION_STEPS[emotionValueToStepIndex].type}
        </Text>
      </div>

      {/* Emotion Slider */}
      <EmotionSlider disabled={!isSceneLoaded} />

      {/* Next Button */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] flex-col gap-6">
        <GeminiButton isLoaded={isSceneLoaded} className="mobile:!hidden" onClick={() => goToStep('ai-prediction')}>
          Skip and use AI Prediction with Gemini
        </GeminiButton>
        <div className="w-full">
          <MotionButton
            onClick={nextStep}
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full !cursor-pointer"
            color={EMOTION_STEPS[emotionValueToStepIndex].color}
            size="4"
            radius="none"
          >
            Next
            <Icon>arrow_forward</Icon>
          </MotionButton>
        </div>

        <GeminiButton isLoaded={isSceneLoaded} className="max-mobile:!hidden" onClick={() => goToStep('ai-prediction')}>
          Use AI Prediction with Gemini
        </GeminiButton>
      </div>
    </>
  );
}
