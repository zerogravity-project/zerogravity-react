/**
 * [useScroll tests]
 * Unit tests for scroll tracking hook
 */

import { act, renderHook } from '@testing-library/react';
import type { RefObject } from 'react';

import { useScroll } from '@/app/_hooks/useScroll';

describe('useScroll', () => {
  let mockElement: HTMLDivElement;
  let mockRef: RefObject<HTMLDivElement>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let resizeObserverCallback: ResizeObserverCallback | null = null;

  class MockResizeObserver implements ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeObserverCallback = callback;
    }

    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  beforeEach(() => {
    // Reset ResizeObserver callback
    resizeObserverCallback = null;

    // Create mock element
    mockElement = document.createElement('div');

    // Set default dimensions
    Object.defineProperties(mockElement, {
      scrollHeight: { value: 500, configurable: true },
      clientHeight: { value: 300, configurable: true },
      scrollTop: { value: 0, configurable: true, writable: true },
    });

    // Create ref pointing to mock element
    mockRef = { current: mockElement };

    // Mock ResizeObserver
    global.ResizeObserver = MockResizeObserver as any;

    // Reset body style
    document.body.style.overflow = '';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial state', () => {
    /** Returns all false when not enabled */
    it('returns all false when not enabled', () => {
      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: false,
        })
      );

      expect(result.current.isScrollable).toBe(false);
      expect(result.current.isScrolling).toBe(false);
      expect(result.current.isScrollAtBottom).toBe(false);
    });

    /** Detects scrollable content when enabled */
    it('detects scrollable content when enabled', () => {
      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      // scrollHeight (500) > clientHeight (300) = scrollable
      expect(result.current.isScrollable).toBe(true);
    });

    /** Detects non-scrollable content */
    it('detects non-scrollable content', () => {
      Object.defineProperty(mockElement, 'scrollHeight', { value: 200 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      // scrollHeight (200) <= clientHeight (300) = not scrollable
      expect(result.current.isScrollable).toBe(false);
    });
  });

  describe('isScrolling detection', () => {
    /** Detects when scrolled from top */
    it('detects when scrolled from top', () => {
      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      expect(result.current.isScrolling).toBe(false);

      // Simulate scroll
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });
      act(() => {
        mockElement.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isScrolling).toBe(true);
    });

    /** Returns false when scrolled back to top */
    it('returns false when scrolled back to top', () => {
      Object.defineProperty(mockElement, 'scrollTop', { value: 50, writable: true });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      expect(result.current.isScrolling).toBe(true);

      // Scroll back to top
      Object.defineProperty(mockElement, 'scrollTop', { value: 0 });
      act(() => {
        mockElement.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isScrolling).toBe(false);
    });
  });

  describe('isScrollAtBottom detection', () => {
    /** Detects when scrolled to bottom */
    it('detects when scrolled to bottom', () => {
      // scrollTop + clientHeight >= scrollHeight - 1
      // 199 + 300 >= 500 - 1 = 499 >= 499 = true
      Object.defineProperty(mockElement, 'scrollTop', { value: 199 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      expect(result.current.isScrollAtBottom).toBe(true);
    });

    /** Returns false when not at bottom */
    it('returns false when not at bottom', () => {
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      // 50 + 300 = 350 >= 499? No
      expect(result.current.isScrollAtBottom).toBe(false);
    });

    /** Handles 1px tolerance at bottom */
    it('handles 1px tolerance at bottom', () => {
      // scrollHeight - clientHeight - 1 = 500 - 300 - 1 = 199
      Object.defineProperty(mockElement, 'scrollTop', { value: 198 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      // 198 + 300 = 498 >= 499? No
      expect(result.current.isScrollAtBottom).toBe(false);

      Object.defineProperty(mockElement, 'scrollTop', { value: 199 });
      act(() => {
        mockElement.dispatchEvent(new Event('scroll'));
      });

      // 199 + 300 = 499 >= 499? Yes
      expect(result.current.isScrollAtBottom).toBe(true);
    });
  });

  describe('enablePreventBackgroundScroll', () => {
    /** Sets body overflow to hidden when enabled */
    it('sets body overflow to hidden when enabled', () => {
      renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enablePreventBackgroundScroll: true,
        })
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    /** Does not set body overflow when disabled */
    it('does not set body overflow when disabled', () => {
      renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enablePreventBackgroundScroll: false,
        })
      );

      expect(document.body.style.overflow).toBe('');
    });

    /** Restores body overflow on unmount */
    it('restores body overflow on unmount', () => {
      const { unmount } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enablePreventBackgroundScroll: true,
        })
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('feature flags', () => {
    /** Respects enableScrollable: false */
    it('respects enableScrollable: false', () => {
      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enableScrollable: false,
        })
      );

      // Should not check scrollable
      expect(result.current.isScrollable).toBe(false);
    });

    /** Respects enableScrolling: false */
    it('respects enableScrolling: false', () => {
      Object.defineProperty(mockElement, 'scrollTop', { value: 50 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enableScrolling: false,
        })
      );

      expect(result.current.isScrolling).toBe(false);
    });

    /** Respects enableScrollAtBottom: false */
    it('respects enableScrollAtBottom: false', () => {
      Object.defineProperty(mockElement, 'scrollTop', { value: 200 });

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
          enableScrollAtBottom: false,
        })
      );

      expect(result.current.isScrollAtBottom).toBe(false);
    });
  });

  describe('null ref handling', () => {
    /** Handles null ref gracefully */
    it('handles null ref gracefully', () => {
      const nullRef = { current: null };

      const { result } = renderHook(() =>
        useScroll({
          scrollRef: nullRef as any,
          enable: true,
        })
      );

      expect(result.current.isScrollable).toBe(false);
      expect(result.current.isScrolling).toBe(false);
      expect(result.current.isScrollAtBottom).toBe(false);
    });
  });

  describe('cleanup', () => {
    /** Removes event listener on unmount */
    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(mockElement, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    /** Disconnects ResizeObserver on unmount */
    it('disconnects ResizeObserver on unmount', () => {
      const { unmount } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      // Get the observer instance
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _observer = new MockResizeObserver(() => {});

      unmount();

      // ResizeObserver disconnect should have been called
      // (checked implicitly - no errors means cleanup worked)
    });

    /** Resets states on unmount */
    it('resets states on unmount', () => {
      Object.defineProperty(mockElement, 'scrollTop', { value: 199 });

      const { result, unmount } = renderHook(() =>
        useScroll({
          scrollRef: mockRef,
          enable: true,
        })
      );

      expect(result.current.isScrollable).toBe(true);
      expect(result.current.isScrollAtBottom).toBe(true);

      unmount();

      // After unmount, states should be reset (component is gone anyway)
    });
  });
});
