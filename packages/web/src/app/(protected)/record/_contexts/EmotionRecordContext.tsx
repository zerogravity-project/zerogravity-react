'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';

import { valueToStepIndex } from '../_utils/emotionRecordUtils';

export type RecordStep = 'emotion' | 'reason' | 'diary';
export type RecordType = 'moment' | 'daily';

// Step order configuration
const STEP_ORDER: Record<RecordStep, number> = {
  emotion: 0,
  reason: 1,
  diary: 2,
};

const STEP_SEQUENCE: RecordStep[] = ['emotion', 'reason', 'diary'];

// Final step based on record type
const FINAL_STEP: Record<RecordType, RecordStep> = {
  moment: 'reason',
  daily: 'diary',
};

interface EmotionRecordContextType {
  // Record data
  emotionId: number;
  emotionSliderValue: number[];
  emotionReason: string[];
  diaryEntry: string;
  emotionValueToStepIndex: number;
  recordType: RecordType;
  date: string | null; // YYYY-MM-DD format

  // Step navigation
  currentStep: RecordStep;
  goToStep: (step: RecordStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  isFinalStep: boolean;

  // Setters
  setEmotionId: (emotionId: number) => void;
  setEmotionSliderValue: (emotionSliderValue: number[]) => void;
  setEmotionReason: (emotionReason: string[]) => void;
  setDiaryEntry: (diaryEntry: string) => void;
}

export const EmotionRecordContext = createContext<EmotionRecordContextType | undefined>(undefined);

const defaultValues = {
  emotionId: 3,
  emotionSliderValue: [EMOTION_STEPS[3].sliderValue],
  emotionReason: [],
  diaryEntry: '',
};

interface EmotionRecordProviderProps {
  children: React.ReactNode;
  recordType: RecordType;
  date: string | null;
}

export const EmotionRecordProvider = ({ children, recordType, date }: EmotionRecordProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Record data
  const [emotionId, setEmotionId] = useState<number>(defaultValues.emotionId);
  const [emotionSliderValue, setEmotionSliderValue] = useState<number[]>(defaultValues.emotionSliderValue);
  const [emotionReason, setEmotionReason] = useState<string[]>(defaultValues.emotionReason);
  const [diaryEntry, setDiaryEntry] = useState<string>(defaultValues.diaryEntry);

  // Track if steps were completed
  const [completedSteps, setCompletedSteps] = useState<Set<RecordStep>>(new Set());

  // Initialize step from URL
  const initialStep = (searchParams.get('step') as RecordStep) || 'emotion';
  const [currentStep, setCurrentStep] = useState<RecordStep>(initialStep);

  const emotionValueToStepIndex = valueToStepIndex(emotionSliderValue[0]);

  // Check if current step is the final step for the current record type
  const isFinalStep = useMemo(() => {
    return currentStep === FINAL_STEP[recordType];
  }, [currentStep, recordType]);

  // Sync emotion slider value with emotionId
  useEffect(() => {
    setEmotionSliderValue([EMOTION_STEPS[emotionId].sliderValue]);
  }, [emotionId]);

  // Build URL with date param
  const buildUrl = useCallback(
    (step: RecordStep) => {
      const baseUrl = `/record/${recordType}`;
      const params = new URLSearchParams();
      if (date) params.set('date', date);
      params.set('step', step);
      return `${baseUrl}?${params.toString()}`;
    },
    [recordType, date]
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
    const finalStep = FINAL_STEP[recordType];

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
  }, [currentStep, recordType, goToStep]);

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
      case 'emotion':
        return emotionId !== null;
      case 'reason':
        return emotionReason.length > 0;
      case 'diary':
        return true; // Always allow submission
      default:
        return false;
    }
  }, [currentStep, emotionId, emotionReason.length]);

  return (
    <EmotionRecordContext.Provider
      value={{
        emotionId,
        emotionSliderValue,
        emotionReason,
        diaryEntry,
        emotionValueToStepIndex,
        recordType,
        date,
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        isFinalStep,
        setEmotionId,
        setEmotionSliderValue,
        setEmotionReason,
        setDiaryEntry,
      }}
    >
      {children}
    </EmotionRecordContext.Provider>
  );
};

export const useEmotionRecordContext = () => {
  const context = useContext(EmotionRecordContext);
  if (!context) {
    throw new Error('useEmotionRecordContext must be used within a EmotionRecordProvider');
  }
  return context;
};
