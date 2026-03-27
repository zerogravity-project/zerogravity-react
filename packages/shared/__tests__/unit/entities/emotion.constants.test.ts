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
    /** EMOTION_KEYS has 7 items */
    it('EMOTION_KEYS has 7 items', () => {
      expect(EMOTION_KEYS).toHaveLength(7);
    });

    /** EMOTION_TYPES has 7 items */
    it('EMOTION_TYPES has 7 items', () => {
      expect(EMOTION_TYPES).toHaveLength(7);
    });

    /** EMOTION_COLORS has 7 items */
    it('EMOTION_COLORS has 7 items', () => {
      expect(EMOTION_COLORS).toHaveLength(7);
    });

    /** EMOTION_SLIDER_VALUES has 7 items */
    it('EMOTION_SLIDER_VALUES has 7 items', () => {
      expect(EMOTION_SLIDER_VALUES).toHaveLength(7);
    });

    /** EMOTION_PLANET_PARAMS has 7 items */
    it('EMOTION_PLANET_PARAMS has 7 items', () => {
      expect(EMOTION_PLANET_PARAMS).toHaveLength(7);
    });

    /** EMOTION_STEPS has 7 items */
    it('EMOTION_STEPS has 7 items', () => {
      expect(EMOTION_STEPS).toHaveLength(7);
    });
  });

  describe('EMOTION_KEYS', () => {
    /** Contains expected emotion keys */
    it('contains expected emotion keys', () => {
      expect(EMOTION_KEYS).toContain('very_negative');
      expect(EMOTION_KEYS).toContain('normal');
      expect(EMOTION_KEYS).toContain('very_positive');
    });

    /** Has correct order (negative to positive) */
    it('has correct order (negative to positive)', () => {
      expect(EMOTION_KEYS[0]).toBe('very_negative');
      expect(EMOTION_KEYS[3]).toBe('normal');
      expect(EMOTION_KEYS[6]).toBe('very_positive');
    });
  });

  describe('EMOTION_SLIDER_VALUES', () => {
    /** Starts at 0 */
    it('starts at 0', () => {
      expect(EMOTION_SLIDER_VALUES[0]).toBe(0);
    });

    /** Ends at 100 */
    it('ends at 100', () => {
      expect(EMOTION_SLIDER_VALUES[6]).toBe(100);
    });

    /** Has 50 for normal (middle) */
    it('has 50 for normal (middle)', () => {
      expect(EMOTION_SLIDER_VALUES[3]).toBe(50);
    });

    /** Values are in ascending order */
    it('values are in ascending order', () => {
      for (let i = 1; i < EMOTION_SLIDER_VALUES.length; i++) {
        expect(EMOTION_SLIDER_VALUES[i]).toBeGreaterThan(EMOTION_SLIDER_VALUES[i - 1]);
      }
    });
  });

  describe('EMOTION_COLORS_MAP', () => {
    /** Has all 7 colors */
    it('has all 7 colors', () => {
      expect(Object.keys(EMOTION_COLORS_MAP)).toHaveLength(7);
    });

    /** All values are valid hex colors */
    it('all values are valid hex colors', () => {
      Object.values(EMOTION_COLORS_MAP).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    /** Has matching keys in EMOTION_COLORS */
    it('has matching keys in EMOTION_COLORS', () => {
      EMOTION_COLORS.forEach(color => {
        expect(EMOTION_COLORS_MAP).toHaveProperty(color);
      });
    });
  });

  describe('EMOTION_COLORS_MAP_DARK', () => {
    /** Has same keys as EMOTION_COLORS_MAP */
    it('has same keys as EMOTION_COLORS_MAP', () => {
      const mainKeys = Object.keys(EMOTION_COLORS_MAP);
      const darkKeys = Object.keys(EMOTION_COLORS_MAP_DARK);
      expect(darkKeys).toEqual(mainKeys);
    });

    /** All values are valid hex colors */
    it('all values are valid hex colors', () => {
      Object.values(EMOTION_COLORS_MAP_DARK).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('EMOTION_COLORS_MAP_ALPHA', () => {
    /** Has same keys as EMOTION_COLORS_MAP */
    it('has same keys as EMOTION_COLORS_MAP', () => {
      const mainKeys = Object.keys(EMOTION_COLORS_MAP);
      const alphaKeys = Object.keys(EMOTION_COLORS_MAP_ALPHA);
      expect(alphaKeys).toEqual(mainKeys);
    });

    /** All values are valid hex colors with alpha */
    it('all values are valid hex colors with alpha', () => {
      Object.values(EMOTION_COLORS_MAP_ALPHA).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{8}$/);
      });
    });
  });

  describe('EMOTION_PLANET_PARAMS', () => {
    /** Each param has required shader properties */
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

    /** All numeric values are valid */
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
    /** Each step has required properties */
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

    /** Step ids match array indices */
    it('step ids match array indices', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.id).toBe(index);
      });
    });

    /** Step keys match EMOTION_KEYS */
    it('step keys match EMOTION_KEYS', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.key).toBe(EMOTION_KEYS[index]);
      });
    });

    /** Step types match EMOTION_TYPES */
    it('step types match EMOTION_TYPES', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.type).toBe(EMOTION_TYPES[index]);
      });
    });

    /** Step colors match EMOTION_COLORS */
    it('step colors match EMOTION_COLORS', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.color).toBe(EMOTION_COLORS[index]);
      });
    });

    /** Step sliderValues match EMOTION_SLIDER_VALUES */
    it('step sliderValues match EMOTION_SLIDER_VALUES', () => {
      EMOTION_STEPS.forEach((step, index) => {
        expect(step.sliderValue).toBe(EMOTION_SLIDER_VALUES[index]);
      });
    });

    /** Style has slider and planet properties */
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
    /** Has multiple reason categories */
    it('has multiple reason categories', () => {
      expect(EMOTION_REASONS.length).toBeGreaterThan(10);
    });

    /** Contains common reasons */
    it('contains common reasons', () => {
      expect(EMOTION_REASONS).toContain('Health');
      expect(EMOTION_REASONS).toContain('Work');
      expect(EMOTION_REASONS).toContain('Family');
      expect(EMOTION_REASONS).toContain('Friends');
    });

    /** All reasons are non-empty strings */
    it('all reasons are non-empty strings', () => {
      EMOTION_REASONS.forEach(reason => {
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(0);
      });
    });
  });
});
