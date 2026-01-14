/**
 * [Emotion UI constants]
 * UI-specific constants for emotion components
 */

import type { EmotionStep } from '../types/emotion.types';

/**
 * ============================================
 * UI-Specific Constants
 * ============================================
 */

/** Complete emotion step configurations with styling */
export const EMOTION_STEPS: EmotionStep[] = [
  {
    id: 0,
    key: 'very_negative',
    type: 'VERY NEGATIVE',
    color: 'purple',
    sliderValue: 0,
    style: {
      slider: {
        ring: 'var(--purple-a8)',
        ringOffset: 'var(--purple-4)',
      },
      planet: {
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
    },
  },
  {
    id: 1,
    key: 'negative',
    type: 'NEGATIVE',
    color: 'red',
    sliderValue: 16,
    style: {
      slider: {
        ring: 'var(--red-a8)',
        ringOffset: 'var(--red-4)',
      },
      planet: {
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
    },
  },
  {
    id: 2,
    key: 'mid_negative',
    type: 'MID NEGATIVE',
    color: 'orange',
    sliderValue: 33,
    style: {
      slider: {
        ring: 'var(--orange-a8)',
        ringOffset: 'var(--orange-4)',
      },
      planet: {
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
    },
  },
  {
    id: 3,
    key: 'normal',
    type: 'NORMAL',
    color: 'amber',
    sliderValue: 50,
    style: {
      slider: {
        ring: 'var(--amber-a8)',
        ringOffset: 'var(--amber-4)',
      },
      planet: {
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
    },
  },
  {
    id: 4,
    key: 'mid_positive',
    type: 'MID POSITIVE',
    color: 'green',
    sliderValue: 67,
    style: {
      slider: {
        ring: 'var(--green-a8)',
        ringOffset: 'var(--green-4)',
      },
      planet: {
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
    },
  },
  {
    id: 5,
    key: 'positive',
    type: 'POSITIVE',
    color: 'cyan',
    sliderValue: 84,
    style: {
      slider: {
        ring: 'var(--cyan-a8)',
        ringOffset: 'var(--cyan-4)',
      },
      planet: {
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
    },
  },
  {
    id: 6,
    key: 'very_positive',
    type: 'VERY POSITIVE',
    color: 'indigo',
    sliderValue: 100,
    style: {
      slider: {
        ring: 'var(--indigo-a8)',
        ringOffset: 'var(--indigo-4)',
      },
      planet: {
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
    },
  },
];
