/**
 * [useClock tests]
 * Unit tests for real-time clock hook
 */

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useClock } from '../../../hooks/useClock';

describe('useClock', () => {
  let rafCallbacks: FrameRequestCallback[] = [];
  let rafId = 0;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      rafCallbacks.push(callback);
      return ++rafId;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(_id => {
      // Mock cancel - in real implementation would remove from queue
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /** Helper to trigger RAF callbacks */
  const flushRaf = () => {
    const callbacks = [...rafCallbacks];
    rafCallbacks = [];
    callbacks.forEach(cb => cb(performance.now()));
  };

  /** Returns null initially (SSR safety) */
  it('returns null initially (SSR safety)', () => {
    const { result } = renderHook(() => useClock());
    expect(result.current).toBeNull();
  });

  /** Returns Date object after first RAF tick */
  it('returns Date object after first RAF tick', () => {
    const { result } = renderHook(() => useClock());

    act(() => {
      flushRaf();
    });

    expect(result.current).toBeInstanceOf(Date);
  });

  /** Updates time on subsequent RAF ticks */
  it('updates time on subsequent RAF ticks', () => {
    const { result } = renderHook(() => useClock());

    act(() => {
      flushRaf();
    });

    const firstDate = result.current;

    act(() => {
      flushRaf();
    });

    // Should still have a Date instance after second tick
    expect(result.current).toBeInstanceOf(Date);
    // New Date object created each tick
    expect(result.current).not.toBe(firstDate);
  });

  /** Calls requestAnimationFrame on mount */
  it('calls requestAnimationFrame on mount', () => {
    renderHook(() => useClock());
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  /** Calls cancelAnimationFrame on unmount */
  it('calls cancelAnimationFrame on unmount', () => {
    const { unmount } = renderHook(() => useClock());

    act(() => {
      flushRaf();
    });

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  /** Continues requesting animation frames while mounted */
  it('continues requesting animation frames while mounted', () => {
    renderHook(() => useClock());

    const initialCallCount = (window.requestAnimationFrame as ReturnType<typeof vi.fn>).mock.calls.length;

    act(() => {
      flushRaf();
    });

    // Should have requested another frame
    expect((window.requestAnimationFrame as ReturnType<typeof vi.fn>).mock.calls.length).toBe(initialCallCount + 1);
  });
});
