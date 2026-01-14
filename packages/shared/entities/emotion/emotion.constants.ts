/**
 * [Emotion domain constants]
 * Core constants for emotion entity
 */

/** Internal keys for emotion levels */
export const EMOTION_KEYS = [
  'very_negative',
  'negative',
  'mid_negative',
  'normal',
  'mid_positive',
  'positive',
  'very_positive',
] as const;

/** Display labels for emotion levels */
export const EMOTION_TYPES = [
  'VERY NEGATIVE',
  'NEGATIVE',
  'MID NEGATIVE',
  'NORMAL',
  'MID POSITIVE',
  'POSITIVE',
  'VERY POSITIVE',
] as const;

/** Color names for emotion themes */
export const EMOTION_COLORS = ['purple', 'red', 'orange', 'amber', 'green', 'cyan', 'indigo'] as const;

/** Slider values mapped to emotion levels */
export const EMOTION_SLIDER_VALUES = [0, 16, 33, 50, 67, 84, 100] as const;

/** Primary hex color values for each emotion */
export const EMOTION_COLORS_MAP = {
  purple: '#8E4EC6',
  red: '#E5484D',
  orange: '#F76B15',
  amber: '#FFC53D',
  green: '#30A46C',
  cyan: '#00A2C7',
  indigo: '#3E63DD',
} as const;

/** Dark variant hex colors for 3D planet */
export const EMOTION_COLORS_MAP_DARK = {
  purple: '#35173e',
  red: '#6c1b1b',
  orange: '#cb0f0f',
  amber: '#9d651c',
  green: '#196549',
  cyan: '#0f68a7',
  indigo: '#2d338d',
} as const;

/** Semi-transparent hex colors with alpha channel */
export const EMOTION_COLORS_MAP_ALPHA = {
  purple: '#C150FF2D',
  red: '#FF173F2D',
  orange: '#FB6A0025',
  amber: '#FA820022',
  green: '#22FF991E',
  cyan: '#00BEFD28',
  indigo: '#2F62FF3C',
} as const;

/** Available reason categories for emotion tracking */
export const EMOTION_REASONS = [
  'Health',
  'Fitness',
  'Self-care',
  'Hobby',
  'Identity',
  'Religion',
  'Community',
  'Family',
  'Friends',
  'Partner',
  'Romance',
  'Money',
  'Housework',
  'Work',
  'Education',
  'Travel',
  'Weather',
  'Domestic Issues',
  'Global Issues',
] as const;
