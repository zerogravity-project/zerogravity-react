'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { EMOTION_STEPS, EmotionId, EmotionReason } from '@zerogravity/shared/components/ui/emotion';

import { valueToStepIndex } from '../_utils/emotionRecordUtils';

import { EmotionRecordType } from '@/services/emotion/emotion.dto';

export type RecordStep = 'emotion' | 'reason' | 'diary' | 'ai-prediction';

// Step order configuration
const STEP_ORDER: Record<RecordStep, number> = {
  'ai-prediction': 0,
  emotion: 1,
  reason: 2,
  diary: 3,
};

const STEP_SEQUENCE: RecordStep[] = ['ai-prediction', 'emotion', 'reason', 'diary'];

// Final step based on record type
const FINAL_STEP: Record<EmotionRecordType, RecordStep> = {
  moment: 'reason',
  daily: 'diary',
};

interface EmotionRecordContextType {
  // Record data
  emotionId: EmotionId;
  emotionRecordType: EmotionRecordType;
  emotionReasons: EmotionReason[];
  diaryEntry?: string;
  aiAnalysisId?: string;
  date: string | null; // YYYY-MM-DD format

  // Helpers
  emotionValueToStepIndex: number;
  emotionSliderValue: number[];
  isUsingAiAnalysis: boolean;

  // Step navigation
  currentStep: RecordStep;
  goToStep: (step: RecordStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  isFinalStep: boolean;
  emotionRecordId?: string;

  // Setters
  setEmotionId: (emotionId: EmotionId) => void;
  setEmotionSliderValue: (emotionSliderValue: number[]) => void;
  setEmotionReasons: (emotionReason: EmotionReason[]) => void;
  setDiaryEntry: (diaryEntry: string) => void;
  setAiAnalysisId: (aiAnalysisId: string) => void;
  setIsUsingAiAnalysis: (isUsingAiAnalysis: boolean) => void;
}

export const EmotionRecordContext = createContext<EmotionRecordContextType | undefined>(undefined);

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

export const EmotionRecordProvider = ({
  children,
  emotionRecordType,
  date: date,
  emotionRecordId,
  initialDailyEmotionId,
  initialDailyEmotionReasons,
  initialDailyDiaryEntry,
}: EmotionRecordProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Record data
  const [emotionId, setEmotionId] = useState<EmotionId>(initialDailyEmotionId ?? defaultValues.emotionId);
  const [emotionReasons, setEmotionReasons] = useState<EmotionReason[]>(
    initialDailyEmotionReasons ?? defaultValues.emotionReasons
  );
  const [diaryEntry, setDiaryEntry] = useState<string>(initialDailyDiaryEntry ?? defaultValues.diaryEntry);
  const [aiAnalysisId, setAiAnalysisId] = useState<string | undefined>(defaultValues.aiAnalysisId);

  // Helpers
  const [emotionSliderValue, setEmotionSliderValue] = useState<number[]>(
    initialDailyEmotionId ? [EMOTION_STEPS[initialDailyEmotionId].sliderValue] : defaultValues.emotionSliderValue
  );
  const [isUsingAiAnalysis, setIsUsingAiAnalysis] = useState<boolean>(false);

  // Track if steps were completed
  const [completedSteps, setCompletedSteps] = useState<Set<RecordStep>>(
    initialDailyEmotionId ? new Set(['ai-prediction', 'emotion', 'reason', 'diary']) : new Set(['ai-prediction'])
  );

  // Initialize step from URL
  const initialStep = (searchParams.get('step') as RecordStep) || 'emotion';
  const [currentStep, setCurrentStep] = useState<RecordStep>(initialStep);

  const emotionValueToStepIndex = valueToStepIndex(emotionSliderValue[0]);

  // Check if current step is the final step for the current record type
  const isFinalStep = useMemo(() => {
    return currentStep === FINAL_STEP[emotionRecordType];
  }, [currentStep, emotionRecordType]);

  // Sync emotion slider value with emotionId
  useEffect(() => {
    setEmotionSliderValue([EMOTION_STEPS[emotionId].sliderValue]);
  }, [emotionId]);

  // Build URL with date param
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

  // Helper: Check if all previous steps are completed
  const arePrerequisitesComplete = useCallback(
    (targetStep: RecordStep): boolean => {
      const targetIndex = STEP_ORDER[targetStep];
      for (let i = 0; i < targetIndex; i++) {
        if (!completedSteps.has(STEP_SEQUENCE[i])) {
          return false;
        }
      }
      return true;
    },
    [completedSteps]
  );

  // Helper: Find first incomplete step
  const getFirstIncompleteStep = useCallback((): RecordStep => {
    for (const step of STEP_SEQUENCE) {
      if (!completedSteps.has(step)) {
        return step;
      }
    }
    return 'emotion'; // Default fallback
  }, [completedSteps]);

  // Guard: Redirect to first incomplete step if accessing invalid step
  useEffect(() => {
    const stepFromUrl = (searchParams.get('step') as RecordStep) || 'emotion';

    // If accessing a step without completing prerequisites, redirect
    if (!arePrerequisitesComplete(stepFromUrl)) {
      const firstIncomplete = getFirstIncompleteStep();
      if (stepFromUrl !== firstIncomplete) {
        router.replace(buildUrl(firstIncomplete), { scroll: false });
        setCurrentStep(firstIncomplete);
      }
    }
  }, [searchParams, arePrerequisitesComplete, getFirstIncompleteStep, router, buildUrl]);

  // Step navigation
  const goToStep = useCallback(
    (step: RecordStep) => {
      setCurrentStep(step);
      router.replace(buildUrl(step), { scroll: false });
    },
    [router, buildUrl]
  );

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER[currentStep];
    const nextIndex = currentIndex + 1;
    const finalStep = FINAL_STEP[emotionRecordType];

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));

    // If current step is the final step for this record type, don't navigate
    if (currentStep === finalStep) {
      return; // Submit should be handled by the component
    }

    // Navigate to next step, but don't go past the final step
    if (nextIndex < STEP_SEQUENCE.length) {
      const nextStep = STEP_SEQUENCE[nextIndex];
      // Only navigate if next step is not past the final step
      if (STEP_ORDER[nextStep] <= STEP_ORDER[finalStep]) {
        goToStep(nextStep);
      }
    }
  }, [currentStep, emotionRecordType, goToStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER[currentStep];
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      goToStep(STEP_SEQUENCE[prevIndex]);
    }
  }, [currentStep, goToStep]);

  // Validation for next button
  const canGoNext = useMemo(() => {
    switch (currentStep) {
      case 'ai-prediction':
        return diaryEntry.length >= 100 && diaryEntry.length <= 300;
      case 'emotion':
        return emotionId !== null;
      case 'reason':
        return emotionReasons.length > 0;
      case 'diary':
        return diaryEntry.length <= 300;
      default:
        return false;
    }
  }, [currentStep, emotionId, emotionReasons.length, diaryEntry.length]);

  return (
    <EmotionRecordContext.Provider
      value={{
        emotionId,
        emotionRecordType,
        emotionReasons,
        diaryEntry,
        aiAnalysisId,
        date,
        emotionValueToStepIndex,
        emotionSliderValue,
        isUsingAiAnalysis,
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        isFinalStep,
        emotionRecordId,
        setEmotionId,
        setEmotionReasons,
        setDiaryEntry,
        setAiAnalysisId,
        setEmotionSliderValue,
        setIsUsingAiAnalysis,
      }}
    >
      {children}
    </EmotionRecordContext.Provider>
  );
};

export const useEmotionRecordContext: () => EmotionRecordContextType = () => {
  const context = useContext(EmotionRecordContext);
  if (!context) {
    throw new Error('useEmotionRecordContext must be used within an EmotionRecordProvider');
  }
  return context as EmotionRecordContextType;
};
