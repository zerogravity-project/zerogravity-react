'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';

import { valueToStepIndex } from '../_utils/emotionRecordUtils';

interface EmotionRecordContextType {
  emotionId: number;
  emotionSliderValue: number[];
  emotionReason?: string[];
  diaryEntry?: string;

  emotionValueToStepIndex: number;

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

export const EmotionRecordProvider = ({ children }: { children: React.ReactNode }) => {
  const [emotionId, setEmotionId] = useState<number>(defaultValues.emotionId);
  const [emotionSliderValue, setEmotionSliderValue] = useState<number[]>(defaultValues.emotionSliderValue);
  const [emotionReason, setEmotionReason] = useState<string[]>(defaultValues.emotionReason);
  const [diaryEntry, setDiaryEntry] = useState<string>(defaultValues.diaryEntry);

  const emotionValueToStepIndex = valueToStepIndex(emotionSliderValue[0]);

  useEffect(() => {
    setEmotionSliderValue([EMOTION_STEPS[emotionId].sliderValue]);
  }, [emotionId]);

  return (
    <EmotionRecordContext.Provider
      value={{
        emotionId,
        emotionSliderValue,
        emotionReason,
        diaryEntry,
        emotionValueToStepIndex,
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
