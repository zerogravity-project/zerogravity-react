/**
 * [useSpaceoutVisit tests]
 * Unit tests for spaceout visit tracking hook
 */

import { renderHook } from '@testing-library/react';

import { useSpaceoutVisit } from '@/app/(protected)/spaceout/_hooks/useSpaceoutVisit';

describe('useSpaceoutVisit', () => {
  const VISIT_COUNT_KEY = 'spaceout_visit_count';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('initial state', () => {
    /** Sets isLoading to false after mount */
    it('sets isLoading to false after mount', () => {
      // Note: In React Testing Library, effects run synchronously
      // So isLoading is already false after renderHook completes
      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('visit count tracking', () => {
    /** Increments visit count on first visit */
    it('increments visit count on first visit', () => {
      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(1);
      expect(localStorage.getItem(VISIT_COUNT_KEY)).toBe('1');
    });

    /** Increments visit count on subsequent visits */
    it('increments visit count on subsequent visits', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '2');

      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(3);
      expect(localStorage.getItem(VISIT_COUNT_KEY)).toBe('3');
    });

    /** Persists count across hook instances */
    it('persists count across hook instances', () => {
      // First instance
      const { unmount: unmount1 } = renderHook(() => useSpaceoutVisit());
      unmount1();

      // Second instance
      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(2);
    });
  });

  describe('shouldShowOnboarding', () => {
    /** Returns true when visit count < 3 */
    it('returns true when visit count < 3', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '0');

      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(1);
      expect(result.current.shouldShowOnboarding).toBe(true);
    });

    /** Returns true when visit count is 2 (will become 3) */
    it('returns true when visit count is 2 (will become 3)', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '1');

      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(2);
      expect(result.current.shouldShowOnboarding).toBe(true);
    });

    /** Returns false when visit count >= 3 */
    it('returns false when visit count >= 3', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '2');

      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(3);
      expect(result.current.shouldShowOnboarding).toBe(false);
    });

    /** Returns false when visit count > 3 */
    it('returns false when visit count > 3', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '10');

      const { result } = renderHook(() => useSpaceoutVisit());

      expect(result.current.visitCount).toBe(11);
      expect(result.current.shouldShowOnboarding).toBe(false);
    });
  });

  describe('edge cases', () => {
    /** Handles invalid localStorage value */
    it('handles invalid localStorage value', () => {
      localStorage.setItem(VISIT_COUNT_KEY, 'invalid');

      const { result } = renderHook(() => useSpaceoutVisit());

      // parseInt('invalid') returns NaN, NaN + 1 = NaN
      expect(result.current.visitCount).toBeNaN();
    });

    /** Handles empty string in localStorage */
    it('handles empty string in localStorage', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '');

      const { result } = renderHook(() => useSpaceoutVisit());

      // Empty string is falsy, so fallback to 0, then 0 + 1 = 1
      expect(result.current.visitCount).toBe(1);
    });

    /** Handles negative values in localStorage */
    it('handles negative values in localStorage', () => {
      localStorage.setItem(VISIT_COUNT_KEY, '-5');

      const { result } = renderHook(() => useSpaceoutVisit());

      // -5 + 1 = -4
      expect(result.current.visitCount).toBe(-4);
    });
  });
});
