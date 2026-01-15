/**
 * [styleUtils tests]
 * Unit tests for Tailwind CSS class merging utility
 */

import { describe, expect, it } from 'vitest';

import { cn } from '../../../utils/styleUtils';

describe('cn', () => {
  describe('basic class merging', () => {
    it('merges multiple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles single class', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });

  describe('conditional classes', () => {
    it('filters out falsy values', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('filters out null and undefined', () => {
      expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
    });

    it('handles conditional object syntax', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });
  });

  describe('Tailwind conflict resolution', () => {
    it('resolves padding conflicts (last wins)', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
    });

    it('resolves margin conflicts', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    it('resolves text color conflicts', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('resolves background color conflicts', () => {
      expect(cn('bg-white', 'bg-black')).toBe('bg-black');
    });

    it('keeps non-conflicting classes', () => {
      expect(cn('p-4', 'm-2', 'text-red-500')).toBe('p-4 m-2 text-red-500');
    });

    it('resolves flex direction conflicts', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col');
    });
  });

  describe('array input', () => {
    it('handles array of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles mixed array and string', () => {
      expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });
  });
});
