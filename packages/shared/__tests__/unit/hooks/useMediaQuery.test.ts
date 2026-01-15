/**
 * [useMediaQuery tests]
 * Unit tests for media query detection hook
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MEDIA_QUERIES, useIsMobile, useMediaQuery } from '../../../hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let mediaQueryListeners: Map<string, (event: MediaQueryListEvent) => void>;
  let mockMatches: Map<string, boolean>;

  beforeEach(() => {
    mediaQueryListeners = new Map();
    mockMatches = new Map();

    // Define matchMedia mock (jsdom doesn't have it)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => {
        const matches = mockMatches.get(query) ?? false;

        return {
          matches,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event: string, callback: (event: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              mediaQueryListeners.set(query, callback);
            }
          }),
          removeEventListener: vi.fn((event: string) => {
            if (event === 'change') {
              mediaQueryListeners.delete(query);
            }
          }),
          dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList;
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** Helper to trigger media query change */
  const triggerMediaQueryChange = (query: string, matches: boolean) => {
    mockMatches.set(query, matches);
    const listener = mediaQueryListeners.get(query);
    if (listener) {
      listener({ matches, media: query } as MediaQueryListEvent);
    }
  };

  describe('basic functionality', () => {
    /** Returns false initially (SSR safety) */
    it('returns false initially (SSR safety)', () => {
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
      expect(result.current).toBe(false);
    });

    /** Returns true when media query matches */
    it('returns true when media query matches', () => {
      mockMatches.set('(min-width: 768px)', true);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      // After useEffect runs
      expect(result.current).toBe(true);
    });

    /** Returns false when media query does not match */
    it('returns false when media query does not match', () => {
      mockMatches.set('(min-width: 768px)', false);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);
    });
  });

  describe('event handling', () => {
    /** Updates when media query changes */
    it('updates when media query changes', () => {
      mockMatches.set('(min-width: 768px)', false);

      const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => {
        triggerMediaQueryChange('(min-width: 768px)', true);
      });

      expect(result.current).toBe(true);
    });

    /** Adds event listener on mount */
    it('adds event listener on mount', () => {
      renderHook(() => useMediaQuery('(min-width: 768px)'));

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });

    /** Removes event listener on unmount */
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

      unmount();

      // Listener should be removed
      expect(mediaQueryListeners.has('(min-width: 768px)')).toBe(false);
    });
  });

  describe('query change', () => {
    /** Updates listener when query changes */
    it('updates listener when query changes', () => {
      const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: '(min-width: 768px)' },
      });

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');

      rerender({ query: '(min-width: 1024px)' });

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });
});

describe('MEDIA_QUERIES', () => {
  /** Has expected breakpoints */
  it('has expected breakpoints', () => {
    expect(MEDIA_QUERIES).toHaveProperty('mobile');
    expect(MEDIA_QUERIES).toHaveProperty('sm');
    expect(MEDIA_QUERIES).toHaveProperty('md');
    expect(MEDIA_QUERIES).toHaveProperty('lg');
    expect(MEDIA_QUERIES).toHaveProperty('xl');
    expect(MEDIA_QUERIES).toHaveProperty('2xl');
  });

  /** Mobile query targets width < 480px */
  it('mobile query targets width < 480px', () => {
    expect(MEDIA_QUERIES.mobile).toContain('480');
  });
});

describe('useIsMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn((query: string) => ({
        matches: query === MEDIA_QUERIES.mobile,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** Uses mobile media query */
  it('uses mobile media query', () => {
    renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith(MEDIA_QUERIES.mobile);
  });
});
