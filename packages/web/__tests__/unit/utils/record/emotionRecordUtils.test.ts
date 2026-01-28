/**
 * [emotionRecordUtils tests]
 * Unit tests for emotion value conversion utilities
 */

import { valueToEmotionStep, valueToStepIndex } from '@/app/(protected)/record/_utils/emotionRecordUtils';

describe('emotionRecordUtils', () => {
  describe('valueToStepIndex', () => {
    describe('normal range (0-100)', () => {
      /** Returns 0 for values 0-16 */
      it('converts 0 to step index 0', () => {
        expect(valueToStepIndex(0)).toBe(0);
      });

      /** Returns 6 for value 100 */
      it('converts 100 to step index 6', () => {
        expect(valueToStepIndex(100)).toBe(6);
      });

      /** Returns 3 for values 51-67 */
      it('converts middle value 50 to step index 3', () => {
        expect(valueToStepIndex(50)).toBe(3);
      });

      /** Handles all step index conversions */
      it('converts values to expected step indices', () => {
        // Based on formula: Math.min(6, Math.floor((value / 101) * 7))
        // 0-14 -> 0, 15-28 -> 1, 29-42 -> 2, 43-57 -> 3, 58-71 -> 4, 72-85 -> 5, 86-100 -> 6
        expect(valueToStepIndex(14)).toBe(0);
        expect(valueToStepIndex(15)).toBe(1);
        expect(valueToStepIndex(28)).toBe(1);
        expect(valueToStepIndex(29)).toBe(2);
        expect(valueToStepIndex(42)).toBe(2);
        expect(valueToStepIndex(43)).toBe(2);
        expect(valueToStepIndex(57)).toBe(3);
        expect(valueToStepIndex(58)).toBe(4);
        expect(valueToStepIndex(71)).toBe(4);
        expect(valueToStepIndex(72)).toBe(4);
        expect(valueToStepIndex(85)).toBe(5);
        expect(valueToStepIndex(86)).toBe(5);
      });
    });

    describe('edge cases - out of range', () => {
      /** Handles negative values */
      it('clamps negative values to 0', () => {
        expect(valueToStepIndex(-1)).toBe(0);
        expect(valueToStepIndex(-100)).toBe(0);
        expect(valueToStepIndex(-999)).toBe(0);
      });

      /** Handles values over 100 */
      it('clamps values above 100 to step 6', () => {
        expect(valueToStepIndex(101)).toBe(6);
        expect(valueToStepIndex(150)).toBe(6);
        expect(valueToStepIndex(999)).toBe(6);
      });
    });

    describe('edge cases - fractional values', () => {
      /** Handles fractional values */
      it('handles fractional values', () => {
        expect(valueToStepIndex(0.5)).toBe(0);
        expect(valueToStepIndex(49.9)).toBe(3);
        expect(valueToStepIndex(99.9)).toBe(6);
      });
    });

    describe('boundary values', () => {
      /** Handles boundary values correctly */
      it('handles exact boundary transitions', () => {
        // Test around each boundary
        // Boundary between 0 and 1: ~14.43
        expect(valueToStepIndex(14)).toBe(0);
        expect(valueToStepIndex(15)).toBe(1);

        // Value at 50% should be middle
        expect(valueToStepIndex(50)).toBe(3);
      });
    });
  });

  describe('valueToEmotionStep', () => {
    /** Returns step with all required properties */
    it('returns EmotionStep object for valid values', () => {
      const step = valueToEmotionStep(50);

      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('key');
      expect(step).toHaveProperty('type');
      expect(step).toHaveProperty('color');
      expect(step).toHaveProperty('sliderValue');
      expect(step).toHaveProperty('style');
    });

    /** Returns correct step object for value 0 */
    it('returns correct step for minimum value (0)', () => {
      const step = valueToEmotionStep(0);

      expect(step.id).toBe(0);
      expect(step.key).toBe('very_negative');
    });

    /** Returns correct step object for value 100 */
    it('returns correct step for maximum value (100)', () => {
      const step = valueToEmotionStep(100);

      expect(step.id).toBe(6);
      expect(step.key).toBe('very_positive');
    });

    /** Returns correct step object for value 50 */
    it('returns correct step for middle value', () => {
      const step = valueToEmotionStep(50);

      expect(step.id).toBe(3);
      expect(step.key).toBe('normal');
    });

    /** Handles negative values gracefully */
    it('handles negative values gracefully', () => {
      const step = valueToEmotionStep(-10);

      expect(step.id).toBe(0);
    });

    /** Handles values above 100 gracefully */
    it('handles values above 100 gracefully', () => {
      const step = valueToEmotionStep(200);

      expect(step.id).toBe(6);
    });

    /** Returns step with all required style properties */
    it('returns step with all required style properties', () => {
      const step = valueToEmotionStep(50);

      expect(step.style).toHaveProperty('slider');
      expect(step.style).toHaveProperty('planet');
      expect(step.style.slider).toHaveProperty('ring');
      expect(step.style.slider).toHaveProperty('ringOffset');
      expect(step.style.planet).toHaveProperty('colorA');
      expect(step.style.planet).toHaveProperty('colorB');
    });
  });
});
