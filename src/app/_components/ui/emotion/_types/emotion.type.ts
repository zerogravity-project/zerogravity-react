import { EMOTION_COLORS, EMOTION_KEYS, EMOTION_TYPES } from '../_constants/emotion.constants';

export type EmotionId = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type EmotionVariant = (typeof EMOTION_COLORS)[number];
export type EmotionKey = (typeof EMOTION_KEYS)[number];
export type EmotionType = (typeof EMOTION_TYPES)[number];
export type EmotionColor = (typeof EMOTION_COLORS)[number];
export type EmotionSliderValue = 0 | 16 | 33 | 50 | 67 | 84 | 100;

export interface EmotionStep {
  id: EmotionId;
  key: EmotionKey;
  type: EmotionType;
  color: EmotionColor;
  sliderValue: EmotionSliderValue;
  style: {
    slider: {
      ring: string;
      ringOffset: string;
    };
    planet: {
      positionFrequency: number;
      timeFrequency: number;
      warpPositionFrequency: number;
      warpTimeFrequency: number;
      warpStrength: number;
      metalness: number;
      roughness: number;
      colorA: string;
      colorB: string;
    };
  };
}
