/**
 * [styleUtils tests]
 * Unit tests for Tailwind CSS class merging utility
 */

import { describe, expect, it } from 'vitest';

import { cn } from '../../../utils/styleUtils';

describe('cn', () => {
  describe('basic class merging', () => {
    /** Merges multiple class strings */
    it('merges multiple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    /** Handles single class */
    it('handles single class', () => {
      expect(cn('foo')).toBe('foo');
    });

    /** Handles empty input */
    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('conditional classes', () => {
    /** Filters out falsy values */
    it('filters out falsy values', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    /** Filters out null and undefined */
    it('filters out null and undefined', () => {
      expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
    });

    /** Handles conditional object syntax */
    it('handles conditional object syntax', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });
  });

  describe('Tailwind conflict resolution', () => {
    /** Resolves padding conflicts (last wins) */
    it('resolves padding conflicts (last wins)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    /** Resolves margin conflicts */
    it('resolves margin conflicts', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    /** Resolves text color conflicts */
    it('resolves text color conflicts', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    /** Resolves background color conflicts */
    it('resolves background color conflicts', () => {
      expect(cn('bg-white', 'bg-black')).toBe('bg-black');
    });

    /** Keeps non-conflicting classes */
    it('keeps non-conflicting classes', () => {
      expect(cn('p-4', 'm-2', 'text-red-500')).toBe('p-4 m-2 text-red-500');
    });

    /** Resolves flex direction conflicts */
    it('resolves flex direction conflicts', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col');
    });
  });

  describe('array input', () => {
    /** Handles array of classes */
    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    /** Handles mixed array and string */
    it('handles mixed array and string', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });
  });
});
