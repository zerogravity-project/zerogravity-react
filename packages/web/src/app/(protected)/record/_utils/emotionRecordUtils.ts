/**
 * [Emotion record utilities]
 * Value to emotion step conversion functions
 */

import { EMOTION_STEPS, type EmotionStep } from '@zerogravity/shared/entities/emotion';

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
