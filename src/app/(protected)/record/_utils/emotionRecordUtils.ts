import { EMOTION_STEPS } from '@/app/_components/ui/emotion/_constants/emotion.constants';
import { EmotionStep } from '@/app/_components/ui/emotion/_types/emotion.types';

/**
 * Convert a value to a step index
 * @param value - The value to convert
 * @returns The step index
 */
export function valueToStepIndex(value: number) {
  const clamped = Math.max(0, Math.min(100, value));
  return Math.min(6, Math.floor((clamped / 101) * 7));
}

/**
 * Convert a value to an emotion step
 * @param value - The value to convert
 * @returns The emotion step
 */
export function valueToEmotionStep(value: number): EmotionStep {
  return EMOTION_STEPS[valueToStepIndex(value)];
}
