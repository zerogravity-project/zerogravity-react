/**
 * [emotion.constants tests]
 * Unit tests for emotion domain constants
 */

import { describe, expect, it } from 'vitest';

import {
  EMOTION_COLORS,
  EMOTION_COLORS_MAP,
  EMOTION_COLORS_MAP_ALPHA,
  EMOTION_COLORS_MAP_DARK,
  EMOTION_KEYS,
  EMOTION_PLANET_PARAMS,
  EMOTION_REASONS,
  EMOTION_SLIDER_VALUES,
  EMOTION_STEPS,
  EMOTION_TYPES,
} from '../../../entities/emotion/emotion.constants';

describe('emotion.constants', () => {
  describe('array lengths', () => {
    it('EMOTION_KEYS has 7 items', () => {
      expect(EMOTION_KEYS).toHaveLength(7);
    });

    it('EMOTION_TYPES has 7 items', () => {
      expect(EMOTION_TYPES).toHaveLength(7);
    });

    it('EMOTION_COLORS has 7 items', () => {
      expect(EMOTION_COLORS).toHaveLength(7);
    });

    it('EMOTION_SLIDER_VALUES has 7 items', () => {
      expect(EMOTION_SLIDER_VALUES).toHaveLength(7);
    });

    it('EMOTION_PLANET_PARAMS has 7 items', () => {
      expect(EMOTION_PLANET_PARAMS).toHaveLength(7);
    });

    it('EMOTION_STEPS has 7 items', () => {
      expect(EMOTION_STEPS).toHaveLength(7);
    });
  });

  describe('EMOTION_KEYS', () => {
    it('contains expected emotion keys', () => {
      expect(EMOTION_KEYS).toContain('very_negative');
      expect(EMOTION_KEYS).toContain('normal');
      expect(EMOTION_KEYS).toContain('very_positive');
    });

    it('has correct order (negative to positive)', () => {
      expect(EMOTION_KEYS[0]).toBe('very_negative');
      expect(EMOTION_KEYS[3]).toBe('normal');
      expect(EMOTION_KEYS[6]).toBe('very_positive');
    });
  });

  describe('EMOTION_SLIDER_VALUES', () => {
    it('starts at 0', () => {
      expect(EMOTION_SLIDER_VALUES[0]).toBe(0);
    });

    it('ends at 100', () => {
      expect(EMOTION_SLIDER_VALUES[6]).toBe(100);
    });

    it('has 50 for normal (middle)', () => {
      expect(EMOTION_SLIDER_VALUES[3]).toBe(50);
    });

    it('values are in ascending order', () => {
      for (let i = 1; i < EMOTION_SLIDER_VALUES.length; i++) {
        expect(EMOTION_SLIDER_VALUES[i]).toBeGreaterThan(EMOTION_SLIDER_VALUES[i - 1]);
      }
    });
  });

  describe('EMOTION_COLORS_MAP', () => {
    it('has all 7 colors', () => {
      expect(Object.keys(EMOTION_COLORS_MAP)).toHaveLength(7);
    });

    it('all values are valid hex colors', () => {
      Object.values(EMOTION_COLORS_MAP).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('has matching keys in EMOTION_COLORS', () => {
      EMOTION_COLORS.forEach(color => {
        expect(EMOTION_COLORS_MAP).toHaveProperty(color);
      });
    });
  });

  describe('EMOTION_COLORS_MAP_DARK', () => {
    it('has same keys as EMOTION_COLORS_MAP', () => {
      const mainKeys = Object.keys(EMOTION_COLORS_MAP);
      const darkKeys = Object.keys(EMOTION_COLORS_MAP_DARK);
      expect(darkKeys).toEqual(mainKeys);
    });

    it('all values are valid hex colors', () => {
      Object.values(EMOTION_COLORS_MAP_DARK).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('EMOTION_COLORS_MAP_ALPHA', () => {
    it('has same keys as EMOTION_COLORS_MAP', () => {
      const mainKeys = Object.keys(EMOTION_COLORS_MAP);
      const alphaKeys = Object.keys(EMOTION_COLORS_MAP_ALPHA);
      expect(alphaKeys).toEqual(mainKeys);
    });

    it('all values are valid hex colors with alpha', () => {
      Object.values(EMOTION_COLORS_MAP_ALPHA).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{8}$/);
      });
    });
  });

  describe('EMOTION_PLANET_PARAMS', () => {
    it('each param has required shader properties', () => {
      EMOTION_PLANET_PARAMS.forEach(param => {
        expect(param).toHaveProperty('positionFrequency');
        expect(param).toHaveProperty('timeFrequency');
        expect(param).toHaveProperty('warpPositionFrequency');
        expect(param).toHaveProperty('warpTimeFrequency');
        expect(param).toHaveProperty('warpStrength');
        expect(param).toHaveProperty('metalness');
        expect(param).toHaveProperty('roughness');
      });
    });

    it('all numeric values are valid', () => {
      EMOTION_PLANET_PARAMS.forEach(param => {
        expect(typeof param.positionFrequency).toBe('number');
        expect(typeof param.metalness).toBe('number');
        expect(param.metalness).toBeGreaterThanOrEqual(0);
        expect(param.metalness).toBeLessThanOrEqual(1);
        expect(param.roughness).toBeGreaterThanOrEqual(0);
        expect(param.roughness).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('EMOTION_STEPS', () => {
    it('each step has required properties', () => {
      EMOTION_STEPS.forEach(step => {
        expect(step).toHaveProperty('id');
        expect(step).toHaveProperty('key');
        expect(step).toHaveProperty('type');
        expect(step).toHaveProperty('color');
        expect(step).toHaveProperty('sliderValue');
        expect(step).toHaveProperty('style');
      });
    });

    it('step ids match array indices', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.id).toBe(index);
      });
    });

    it('step keys match EMOTION_KEYS', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.key).toBe(EMOTION_KEYS[index]);
      });
    });

    it('step types match EMOTION_TYPES', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.type).toBe(EMOTION_TYPES[index]);
      });
    });

    it('step colors match EMOTION_COLORS', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.color).toBe(EMOTION_COLORS[index]);
      });
    });

    it('step sliderValues match EMOTION_SLIDER_VALUES', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.sliderValue).toBe(EMOTION_SLIDER_VALUES[index]);
      });
    });

    it('style has slider and planet properties', () => {
      EMOTION_STEPS.forEach(step => {
        expect(step.style).toHaveProperty('slider');
        expect(step.style).toHaveProperty('planet');
        expect(step.style.slider).toHaveProperty('ring');
        expect(step.style.slider).toHaveProperty('ringOffset');
        expect(step.style.planet).toHaveProperty('colorA');
        expect(step.style.planet).toHaveProperty('colorB');
      });
    });
  });

  describe('EMOTION_REASONS', () => {
    it('has multiple reason categories', () => {
      expect(EMOTION_REASONS.length).toBeGreaterThan(10);
    });

    it('contains common reasons', () => {
      expect(EMOTION_REASONS).toContain('Health');
      expect(EMOTION_REASONS).toContain('Work');
      expect(EMOTION_REASONS).toContain('Family');
      expect(EMOTION_REASONS).toContain('Friends');
    });

    it('all reasons are non-empty strings', () => {
      EMOTION_REASONS.forEach(reason => {
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(0);
      });
    });
  });
});
