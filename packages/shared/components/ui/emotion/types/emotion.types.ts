/**
 * [Emotion UI type definitions]
 * UI-specific types for emotion components
 */

import type {
  EmotionColor,
  EmotionId,
  EmotionKey,
  EmotionSliderValue,
  EmotionType,
} from '../../../../entities/emotion';

/*
 * ============================================
 * UI-Specific Types
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
