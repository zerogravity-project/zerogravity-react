/**
 * [Emotion domain constants]
 * Core constants for emotion entity
 */

import { CDN_BASE_URL } from '../../config/cdn.constants';

import type { EmotionId, EmotionPlanetParams, EmotionStep } from './emotion.types';

/*
 * ============================================
 * CDN Image URLs
 * ============================================
 */

/** CDN paths for emotion planet images */
export const EMOTION_IMAGE_URLS = {
  /** First-frame placeholder images for 3D loading */
  firstFrame: (emotionId: number, size: 512 | 1024 | 1500) =>
    `${CDN_BASE_URL}/images/emotions/first-frame/emotion-${emotionId}-${size}.webp`,

  /** Thumbnail images for static display */
  thumbnail: (emotionId: number, size: 256 = 256) =>
    `${CDN_BASE_URL}/images/emotions/thumbnail/emotion-${emotionId}-${size}.webp`,

  /** HDR environment map for 3D scene */
  environmentMap: (resolution: '512' | '1k' = '512') =>
    `${CDN_BASE_URL}/environment-maps/urban_alley_01_${resolution}.hdr`,
} as const;

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

/** 3D planet shader parameters for each emotion (excluding colors) */
export const EMOTION_PLANET_PARAMS: EmotionPlanetParams[] = [
  {
    positionFrequency: 0.6,
    timeFrequency: 0.8,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.4,
    warpStrength: 1.6,
    metalness: 0.6,
    roughness: 0.8,
  },
  {
    positionFrequency: 0.55,
    timeFrequency: 0.7,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.4,
    warpStrength: 1.5,
    metalness: 0.3,
    roughness: 0.9,
  },
  {
    positionFrequency: 0.5,
    timeFrequency: 0.5,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.3,
    warpStrength: 1.5,
    metalness: 0.15,
    roughness: 1,
  },
  {
    positionFrequency: 0.5,
    timeFrequency: 0.3,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.15,
    warpStrength: 1.3,
    metalness: 0,
    roughness: 1,
  },
  {
    positionFrequency: 0.4,
    timeFrequency: 0.25,
    warpPositionFrequency: 0.4,
    warpTimeFrequency: 0.1,
    warpStrength: 1.3,
    metalness: 0,
    roughness: 1,
  },
  {
    positionFrequency: 0.35,
    timeFrequency: 0.2,
    warpPositionFrequency: 0.3,
    warpTimeFrequency: 0.07,
    warpStrength: 1.1,
    metalness: 0,
    roughness: 1,
  },
  {
    positionFrequency: 0.3,
    timeFrequency: 0.2,
    warpPositionFrequency: 0.3,
    warpTimeFrequency: 0.05,
    warpStrength: 0.75,
    metalness: 0,
    roughness: 1,
  },
];

/** Complete emotion step configurations with styling (derived from other constants) */
export const EMOTION_STEPS: EmotionStep[] = EMOTION_KEYS.map((key, index) => {
  const id = index as EmotionId;
  const color = EMOTION_COLORS[id];

  return {
    id,
    key,
    type: EMOTION_TYPES[id],
    color,
    sliderValue: EMOTION_SLIDER_VALUES[id],
    style: {
      slider: {
        ring: `var(--${color}-a8)`,
        ringOffset: `var(--${color}-4)`,
      },
      planet: {
        ...EMOTION_PLANET_PARAMS[id],
        colorA: EMOTION_COLORS_MAP[color],
        colorB: EMOTION_COLORS_MAP_DARK[color],
      },
    },
  };
});
