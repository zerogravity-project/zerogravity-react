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

/**
 * ============================================
 * Pure Types
 * ============================================
 */

/** Emotion level identifier (0-6, where 0 is most negative) */
export type EmotionId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
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
