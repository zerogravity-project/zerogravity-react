/**
 * [Emotion domain types]
 * Pure domain types for emotion entity - no UI dependencies
 */

import {
  EMOTION_COLORS,
  EMOTION_KEYS,
  EMOTION_REASONS,
  EMOTION_SLIDER_VALUES,
  EMOTION_TYPES,
} from './emotion.constants';

/*
 * ============================================
 * Pure Types
 * ============================================
 */

/** Emotion level identifier (0-6, where 0 is most negative) */
export type EmotionId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/*
 * ============================================
 * Derived Types
 * ============================================
 */

/** Internal reference key derived from EMOTION_KEYS */
export type EmotionKey = (typeof EMOTION_KEYS)[number];

/** Slider value derived from EMOTION_SLIDER_VALUES */
export type EmotionSliderValue = (typeof EMOTION_SLIDER_VALUES)[number];

/** Display label derived from EMOTION_TYPES */
export type EmotionType = (typeof EMOTION_TYPES)[number];

/** Color name derived from EMOTION_COLORS */
export type EmotionColor = (typeof EMOTION_COLORS)[number];

/** Reason category derived from EMOTION_REASONS */
export type EmotionReason = (typeof EMOTION_REASONS)[number];

/*
 * ============================================
 * Style Types
 * ============================================
 */

/** Slider appearance styling */
export interface EmotionSliderStyle {
  ring: string;
  ringOffset: string;
}

/** 3D planet shader parameters (excluding colors) */
export interface EmotionPlanetParams {
  positionFrequency: number;
  timeFrequency: number;
  warpPositionFrequency: number;
  warpTimeFrequency: number;
  warpStrength: number;
  metalness: number;
  roughness: number;
}

/** Full planet style including colors */
export interface EmotionPlanetStyle extends EmotionPlanetParams {
  colorA: string;
  colorB: string;
}

/*
 * ============================================
 * Composite Types
 * ============================================
 */

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
    slider: EmotionSliderStyle;
    planet: EmotionPlanetStyle;
  };
}
