'use client';

import { useState } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { usePredictEmotionMutation } from '@/services/ai/ai.query';

import AiPredictionInput from './_components/AiPredictionInput';
import AiPredictionLoading from './_components/AiPredictionLoading';
import AiPredictionResult from './_components/AiPredictionResult';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function AiPredictionStep() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [aiPredictionEntry, setAiPredictionEntry] = useState<string>('');

  /*
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */

  /** AI emotion prediction mutation */
  const {
    mutate: predictEmotion,
    data: predictEmotionData,
    isPending: isPredictEmotionPending,
    isSuccess: isPredictEmotionSuccess,
    reset: resetPredictEmotionMutation,
  } = usePredictEmotionMutation({
    onError: error => {
      console.error('[AiPredictionStep] Failed to predict emotion:', error);
      openAlertModal({
        title: 'Prediction Failed',
        description: error.response?.data?.message || 'Failed to analyze your text. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 4. Derived Values
   * --------------------------------------------
   */

  /** Extract prediction data from mutation response */
  const predictionData = predictEmotionData?.data;

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */

  // Analyzing phase
  if (isPredictEmotionPending) {
    return <AiPredictionLoading />;
  }

  // Result phase
  if (isPredictEmotionSuccess && predictionData) {
    return (
      <AiPredictionResult predictionData={predictionData} resetPredictEmotionMutation={resetPredictEmotionMutation} />
    );
  }

  // Default: input phase
  return (
    <AiPredictionInput
      predictEmotion={predictEmotion}
      aiPredictionEntry={aiPredictionEntry}
      setAiPredictionEntry={setAiPredictionEntry}
    />
  );
}
