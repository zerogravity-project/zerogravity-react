import { EmotionId, EmotionStep } from '../_types/emotion.type';

export const EMOTION_KEYS = [
  'very_negative',
  'negative',
  'mid_negative',
  'normal',
  'mid_positive',
  'positive',
  'very_positive',
] as const;

export const EMOTION_TYPES = [
  'VERY NEGATIVE',
  'NEGATIVE',
  'MID NEGATIVE',
  'NORMAL',
  'MID POSITIVE',
  'POSITIVE',
  'VERY POSITIVE',
] as const;

export const EMOTION_COLORS = ['purple', 'red', 'orange', 'amber', 'green', 'cyan', 'indigo'] as const;

export const EMOTION_SLIDER_VALUES = [0, 16, 33, 50, 67, 84, 100] as const;

const PLANET_STYLES = {
  very_negative: {
    positionFrequency: 0.6,
    timeFrequency: 0.8,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.4,
    warpStrength: 1.6,
    metalness: 0.6,
    roughness: 0.8,
    colorA: '#8E4EC6',
    colorB: '#35173e',
  },
  negative: {
    positionFrequency: 0.55,
    timeFrequency: 0.7,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.4,
    warpStrength: 1.5,
    metalness: 0.3,
    roughness: 0.9,
    colorA: '#E5484D',
    colorB: '#6c1b1b',
  },
  mid_negative: {
    positionFrequency: 0.5,
    timeFrequency: 0.5,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.3,
    warpStrength: 1.5,
    metalness: 0.15,
    roughness: 1,
    colorA: '#F76B15',
    colorB: '#cb0f0f',
  },
  normal: {
    positionFrequency: 0.5,
    timeFrequency: 0.3,
    warpPositionFrequency: 0.5,
    warpTimeFrequency: 0.15,
    warpStrength: 1.3,
    metalness: 0,
    roughness: 1,
    colorA: '#FFC53D',
    colorB: '#9d651c',
  },
  mid_positive: {
    positionFrequency: 0.4,
    timeFrequency: 0.25,
    warpPositionFrequency: 0.4,
    warpTimeFrequency: 0.1,
    warpStrength: 1.3,
    metalness: 0,
    roughness: 1,
    colorA: '#30A46C',
    colorB: '#196549',
  },
  positive: {
    positionFrequency: 0.35,
    timeFrequency: 0.2,
    warpPositionFrequency: 0.3,
    warpTimeFrequency: 0.07,
    warpStrength: 1.1,
    metalness: 0,
    roughness: 1,
    colorA: '#00A2C7',
    colorB: '#0f68a7',
  },
  very_positive: {
    positionFrequency: 0.3,
    timeFrequency: 0.2,
    warpPositionFrequency: 0.3,
    warpTimeFrequency: 0.05,
    warpStrength: 0.75,
    metalness: 0,
    roughness: 1,
    colorA: '#3E63DD',
    colorB: '#2d338d',
  },
} as const;

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
];

// Create EMOTION_STEPS array
export const EMOTION_STEPS: EmotionStep[] = EMOTION_KEYS.map((key, index) => ({
  id: index as EmotionId,
  key,
  type: EMOTION_TYPES[index],
  color: EMOTION_COLORS[index],
  sliderValue: EMOTION_SLIDER_VALUES[index],
  style: {
    slider: {
      ring: `var(--${EMOTION_COLORS[index]}-a8)`,
      ringOffset: `var(--${EMOTION_COLORS[index]}-4)`,
    },
    planet: PLANET_STYLES[key],
  },
}));
