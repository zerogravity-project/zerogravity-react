/**
 * [Emotion type definitions]
 * Types for emotion levels, colors, and step configurations
 */

import { EMOTION_COLORS, EMOTION_KEYS, EMOTION_REASONS, EMOTION_TYPES } from '../constants/emotion.constants';

/** Emotion level identifier (0-6, where 0 is most negative) */
export type EmotionId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Color variant derived from EMOTION_COLORS constant */
export type EmotionVariant = (typeof EMOTION_COLORS)[number];

/** Emotion key for internal reference */
export type EmotionKey = (typeof EMOTION_KEYS)[number];

/** Display label for emotion type */
export type EmotionType = (typeof EMOTION_TYPES)[number];

/** Color name for emotion styling */
export type EmotionColor = (typeof EMOTION_COLORS)[number];

/** Slider value mapped to emotion levels */
export type EmotionSliderValue = 0 | 16 | 33 | 50 | 67 | 84 | 100;

/** Reason category for emotion tracking */
export type EmotionReason = (typeof EMOTION_REASONS)[number];

/** Emotion step configuration with styling for slider and planet */
export interface EmotionStep {
  /** Unique emotion identifier */
  id: EmotionId;
  /** Internal reference key */
  key: EmotionKey;
  /** Display label */
  type: EmotionType;
  /** Color theme */
  color: EmotionColor;
  /** Corresponding slider position */
  sliderValue: EmotionSliderValue;
  /** Visual styling configuration */
  style: {
    /** Slider appearance */
    slider: {
      ring: string;
      ringOffset: string;
    };
    /** 3D planet shader parameters */
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
