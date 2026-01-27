'use client';

import { useRouter } from 'next/navigation';

import { AnimatePresence, m } from 'motion/react';
import { useRef } from 'react';

import { TopAppBar } from '@/app/_components/ui/appbar/TopAppBar';
import { useScroll } from '@/app/_hooks/useScroll';

import { RecordStep, useEmotionRecordContext } from '../_contexts/EmotionRecordContext';

import AiPredictionStep from './steps/ai-prediction/AiPredictionStep';
import DiaryStep from './steps/diary/DiaryStep';
import EmotionStep from './steps/emotion/EmotionStep';
import ReasonStep from './steps/reason/ReasonStep';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Step-specific container class names */
const STEP_CLASS_NAMES: Record<RecordStep, string> = {
  emotion: 'flex h-full w-full flex-col items-center',
  reason: 'flex w-full flex-1 flex-col items-center',
  diary: 'flex w-full flex-1 flex-col items-center',
  'ai-prediction': 'flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden',
};

/*
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionRecord() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { currentStep, displayStep, prevStep, onStepExitComplete } = useEmotionRecordContext();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */

  /** Whether exit animation is in progress */
  const isExiting = currentStep !== displayStep;

  /*
   * --------------------------------------------
   * 4. Custom Hooks
   * --------------------------------------------
   */
  const { isScrolling } = useScroll({
    scrollRef: scrollRef,
    enable: true,
  });

  /*
   * --------------------------------------------
   * 5. Event Handlers
   * --------------------------------------------
   */

  /** Handle go back - navigate to previous step or go back to previous page */
  const handleGoBack = () => {
    if (currentStep === 'emotion') {
      router.back();
      return;
    }
    prevStep();
  };

  /*
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <>
      <TopAppBar
        text="Go Back"
        icon="arrow_back"
        onClick={handleGoBack}
        className="mobile:hidden fixed top-0 left-0 flex"
        background
        shadow={isScrolling}
      />
      <div ref={scrollRef} className="flex h-full w-full flex-col items-center justify-between">
        {/*
         * Step Content
         * - key={currentStep} triggers exit animation when step changes
         * - displayStep determines which content to render (stays previous during exit)
         * - onExitComplete syncs displayStep after fade out completes
         */}
        <AnimatePresence mode="wait" onExitComplete={onStepExitComplete}>
          <m.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={STEP_CLASS_NAMES[displayStep]}
          >
            {displayStep === 'emotion' && <EmotionStep />}
            {displayStep === 'reason' && <ReasonStep />}
            {displayStep === 'diary' && <DiaryStep />}
            {displayStep === 'ai-prediction' && <AiPredictionStep />}
          </m.div>
        </AnimatePresence>
      </div>
    </>
  );
}
