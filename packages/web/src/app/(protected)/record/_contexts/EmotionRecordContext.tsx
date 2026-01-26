/**
 * [EmotionRecordContext]
 * State management for emotion recording flow (daily/moment)
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { EMOTION_STEPS, type EmotionId, type EmotionReason } from '@zerogravity/shared/entities/emotion';

import { EmotionRecordType } from '@/services/emotion/emotion.dto';

import { valueToStepIndex } from '../_utils/emotionRecordUtils';

/*
 * ============================================================
 * Type Definitions
 * ============================================================
 */

export type MainStep = 'emotion' | 'reason' | 'diary';
export type OptionalStep = 'ai-prediction';
export type RecordStep = MainStep | OptionalStep;

/** AI prediction data to apply */
export interface AiPredictionData {
  suggestedEmotionId: EmotionId;
  suggestedReasons: EmotionReason[];
  refinedDiary: string;
  analysisId: string;
}

/*
 * ============================================================
 * Constants: Step Configuration
 * ============================================================
 */

/** Step order mapping for navigation */
export const MAIN_STEP_ORDER: Record<MainStep, number> = {
  emotion: 0,
  reason: 1,
  diary: 2,
};

/** Main step sequence (required flow, ai-prediction is optional) */
export const MAIN_SEQUENCE: MainStep[] = ['emotion', 'reason', 'diary'];

/** Final step based on record type */
export const FINAL_STEP: Record<EmotionRecordType, MainStep> = {
  moment: 'reason',
  daily: 'diary',
};

/*
 * ============================================================
 * Context Type Definition
 * ============================================================
 */

interface EmotionRecordContextType {
  /** Record data */
  emotionId: EmotionId;
  emotionRecordType: EmotionRecordType;
  emotionReasons: EmotionReason[];
  diaryEntry?: string;
  aiAnalysisId?: string;
  date: string | null; // YYYY-MM-DD format
  emotionRecordId?: string;

  /** Helpers */
  emotionValueToStepIndex: number;
  emotionSliderValue: number[];

  /** Step navigation */
  currentStep: RecordStep;
  canGoNext: boolean;
  canGoToStep: (step: RecordStep) => boolean;
  isFinalStep: boolean;
  goToStep: (step: RecordStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  /** Setters */
  setEmotionId: (emotionId: EmotionId) => void;
  setEmotionSliderValue: (emotionSliderValue: number[]) => void;
  setEmotionReasons: (emotionReason: EmotionReason[]) => void;
  setDiaryEntry: (diaryEntry: string) => void;
  setAiAnalysisId: (aiAnalysisId: string) => void;

  /** AI prediction */
  applyAiPrediction: (data: AiPredictionData) => void;
}

export const EmotionRecordContext = createContext<EmotionRecordContextType | undefined>(undefined);

/** Default values for emotion record */
const defaultValues = {
  emotionId: 3 as EmotionId,
  emotionSliderValue: [EMOTION_STEPS[3].sliderValue],
  emotionReasons: [],
  diaryEntry: '',
  aiAnalysisId: undefined,
};

interface EmotionRecordProviderProps {
  children: React.ReactNode;
  emotionRecordType: EmotionRecordType;
  date: string | null;

  emotionRecordId?: string;
  initialDailyEmotionId?: EmotionId;
  initialDailyEmotionReasons?: EmotionReason[];
  initialDailyDiaryEntry?: string;
}

/*
 * ============================================================
 * Emotion Record Provider
 * ============================================================
 *
 * Manages multi-step emotion recording flow (emotion → reason → diary)
 * Handles navigation between steps, form state, and API mutations
 * Supports both 'moment' (quick) and 'daily' (full) record types
 *
 * @param children - Child components to wrap
 * @param emotionRecordType - Record type ('moment' or 'daily')
 * @param date - Date of the emotion record (YYYY-MM-DD)
 * @param emotionRecordId - ID of existing record (for updates)
 * @param initialDailyEmotionId - Initial emotion ID for daily records
 * @param initialDailyEmotionReasons - Initial reasons for daily records
 * @param initialDailyDiaryEntry - Initial diary entry for daily records
 */
export const EmotionRecordProvider = ({
  children,
  emotionRecordType,
  date: date,
  emotionRecordId,
  initialDailyEmotionId,
  initialDailyEmotionReasons,
  initialDailyDiaryEntry,
}: EmotionRecordProviderProps) => {
  /*
   * ------------------------------------------------------------
   * 1. External Hooks
   * ------------------------------------------------------------
   */
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * ------------------------------------------------------------
   * 2. States
   * ------------------------------------------------------------
   */

  /** Record data */
  const [emotionId, setEmotionId] = useState<EmotionId>(initialDailyEmotionId ?? defaultValues.emotionId);
  const [emotionReasons, setEmotionReasons] = useState<EmotionReason[]>(
    initialDailyEmotionReasons ?? defaultValues.emotionReasons
  );
  const [diaryEntry, setDiaryEntry] = useState<string>(initialDailyDiaryEntry ?? defaultValues.diaryEntry);
  const [aiAnalysisId, setAiAnalysisId] = useState<string | undefined>(defaultValues.aiAnalysisId);

  /** Helpers */
  const [emotionSliderValue, setEmotionSliderValue] = useState<number[]>(
    initialDailyEmotionId ? [EMOTION_STEPS[initialDailyEmotionId].sliderValue] : defaultValues.emotionSliderValue
  );
  const emotionValueToStepIndex = valueToStepIndex(emotionSliderValue[0]);

  /** Initialize step from URL */
  const initialStep = (searchParams.get('step') as RecordStep) || 'emotion';
  const [currentStep, setCurrentStep] = useState<RecordStep>(initialStep);

  /*
   * ------------------------------------------------------------
   * 3. Derived Values
   * ------------------------------------------------------------
   */

  /** Validation status for each step */
  const isEmotionValid = emotionId !== null;
  const isReasonValid = emotionReasons.length > 0;
  const isDiaryValid = diaryEntry.length <= 300;

  /*
   * ------------------------------------------------------------
   * 4. Computed Values
   * ------------------------------------------------------------
   */

  /** Validation for next button */
  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'emotion':
        return isEmotionValid;
      case 'reason':
        return isReasonValid;
      case 'diary':
        return isDiaryValid;
      default:
        return false;
    }
  }, [currentStep, isEmotionValid, isReasonValid, isDiaryValid]);

  /** Check if can navigate to target step (all previous steps valid) */
  const canGoToStep = useCallback(
    (targetStep: RecordStep): boolean => {
      // ai-prediction is optional and can be accessed anytime
      if (!MAIN_SEQUENCE.includes(targetStep as MainStep)) return true;

      const targetIndex = MAIN_STEP_ORDER[targetStep as MainStep];

      // Check if all previous steps are valid
      for (let i = 0; i < targetIndex; i++) {
        const step = MAIN_SEQUENCE[i];
        switch (step) {
          case 'emotion':
            if (!isEmotionValid) return false;
            break;
          case 'reason':
            if (!isReasonValid) return false;
            break;
          case 'diary':
            if (!isDiaryValid) return false;
            break;
        }
      }
      return true;
    },
    [isEmotionValid, isReasonValid, isDiaryValid]
  );

  /** Check if current step is the final step for the current record type */
  const isFinalStep = useMemo(() => {
    return currentStep === FINAL_STEP[emotionRecordType];
  }, [currentStep, emotionRecordType]);

  /*
   * ------------------------------------------------------------
   * 5. Helper Functions (Callbacks)
   * ------------------------------------------------------------
   */

  /** Build URL with date param */
  const buildUrl = useCallback(
    (step: RecordStep) => {
      const baseUrl = `/record/${emotionRecordType}`;
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      params.set('step', step);
      return `${baseUrl}?${params.toString()}`;
    },
    [emotionRecordType, date]
  );

  /*
   * ------------------------------------------------------------
   * 6. Step Navigation (Callbacks)
   * ------------------------------------------------------------
   */

  /** Go to a specific step */
  const goToStep = useCallback(
    (step: RecordStep) => {
      // Check if can navigate to target step
      if (!canGoToStep(step)) {
        console.warn(`Cannot navigate to ${step}: prerequisites not met`);
        return;
      }

      setCurrentStep(step);
      router.replace(buildUrl(step), { scroll: false });
    },
    [canGoToStep, router, buildUrl]
  );

  /** Go to the next step */
  const nextStep = useCallback(() => {
    // Check if current step is complete
    if (!canGoNext) {
      console.warn('Cannot proceed: current step not complete');
      return;
    }

    const currentIndex = MAIN_STEP_ORDER[currentStep as MainStep];
    const nextIndex = currentIndex + 1;
    const finalStep = FINAL_STEP[emotionRecordType];

    // If current step is the final step for this record type, don't navigate
    if (currentStep === finalStep) {
      return; // Submit should be handled by the component
    }

    // Navigate to next step, but don't go past the final step
    if (nextIndex < MAIN_SEQUENCE.length) {
      const nextStep = MAIN_SEQUENCE[nextIndex];
      // Only navigate if next step is not past the final step
      if (MAIN_STEP_ORDER[nextStep] <= MAIN_STEP_ORDER[finalStep]) {
        goToStep(nextStep);
      }
    }
  }, [canGoNext, currentStep, emotionRecordType, goToStep]);

  /** Go to the previous step */
  const prevStep = useCallback(() => {
    const currentIndex = MAIN_STEP_ORDER[currentStep as MainStep];
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      goToStep(MAIN_SEQUENCE[prevIndex]);
    }
  }, [currentStep, goToStep]);

  /** Apply AI prediction data and navigate to final step (skips validation) */
  const applyAiPrediction = useCallback(
    (data: AiPredictionData) => {
      // Apply all AI prediction data
      setEmotionId(data.suggestedEmotionId);
      setEmotionReasons(data.suggestedReasons);
      setAiAnalysisId(data.analysisId);

      // Only set diary entry for daily records (moment records don't have diary step)
      if (emotionRecordType === 'daily') {
        setDiaryEntry(data.refinedDiary);
      }

      // Navigate directly to final step (no validation needed - AI data is already valid)
      const finalStep = FINAL_STEP[emotionRecordType];
      setCurrentStep(finalStep);
      router.replace(buildUrl(finalStep), { scroll: false });
    },
    [emotionRecordType, router, buildUrl]
  );

  /*
   * ------------------------------------------------------------
   * 7. useEffect Hooks
   * ------------------------------------------------------------
   */

  /** Sync emotion slider value with emotionId */
  useEffect(() => {
    setEmotionSliderValue([EMOTION_STEPS[emotionId].sliderValue]);
  }, [emotionId]);

  /** Redirect to accessible step if URL step is invalid */
  useEffect(() => {
    const stepFromUrl = (searchParams.get('step') as RecordStep) || 'emotion';

    // Check if URL step is accessible
    if (!canGoToStep(stepFromUrl)) {
      // Find first accessible step
      const firstAccessible = MAIN_SEQUENCE.find(step => canGoToStep(step)) || 'emotion';

      if (stepFromUrl !== firstAccessible) {
        router.replace(buildUrl(firstAccessible), { scroll: false });
        setCurrentStep(firstAccessible);
      }
    }
  }, [searchParams, canGoToStep, router, buildUrl]);

  /*
   * ------------------------------------------------------------
   * 8. Return
   * ------------------------------------------------------------
   */
  return (
    <EmotionRecordContext.Provider
      value={{
        emotionId,
        emotionRecordType,
        emotionReasons,
        diaryEntry,
        aiAnalysisId,
        date,
        emotionRecordId,
        emotionValueToStepIndex,
        emotionSliderValue,
        currentStep,
        canGoNext,
        canGoToStep,
        isFinalStep,
        goToStep,
        nextStep,
        prevStep,
        setEmotionId,
        setEmotionSliderValue,
        setEmotionReasons,
        setDiaryEntry,
        setAiAnalysisId,
        applyAiPrediction,
      }}
    >
      {children}
    </EmotionRecordContext.Provider>
  );
};

/*
 * ============================================================
 * Custom Hook
 * ============================================================
 */

/**
 * Hook to access EmotionRecordContext
 * @throws Error if used outside of EmotionRecordProvider
 */
export const useEmotionRecordContext: () => EmotionRecordContextType = () => {
  const context = useContext(EmotionRecordContext);
  if (!context) {
    throw new Error('useEmotionRecordContext must be used within an EmotionRecordProvider');
  }
  return context as EmotionRecordContextType;
};
