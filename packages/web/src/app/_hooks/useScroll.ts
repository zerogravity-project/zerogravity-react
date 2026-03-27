/**
 * [useScroll hook]
 * Track scroll position and state for container elements
 */

import { useEffect, useState } from 'react';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface UseScrollProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  enable: boolean;
  enableScrollable?: boolean;
  enableScrolling?: boolean;
  enableScrollAtBottom?: boolean;
  enablePreventBackgroundScroll?: boolean;
}

/*
 * ============================================
 * Hook
 * ============================================
 */

export function useScroll({
  scrollRef,
  enable,
  enableScrollable = true,
  enableScrolling = true,
  enableScrollAtBottom = true,
  enablePreventBackgroundScroll,
}: UseScrollProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  /*
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */

  /** Prevent background scroll when enablePreventBackgroundScroll is true */
  useEffect(() => {
    if (enablePreventBackgroundScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [enablePreventBackgroundScroll]);

  /** Detect scroll to get scrollable, scrolling, and scroll at bottom state */
  useEffect(() => {
    if (!enable) return;

    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const checkScrollable = () => {
      if (!enableScrollable) return;

      const isContentScrollable = scrollElement.scrollHeight > scrollElement.clientHeight;
      setIsScrollable(isContentScrollable);
    };

    const handleScroll = () => {
      if (!enableScrolling && !enableScrollAtBottom) return;

      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      if (enableScrolling) {
        setIsScrolling(scrollTop > 0);
      }

      if (enableScrollAtBottom) {
        setIsScrollAtBottom(scrollTop + clientHeight >= scrollHeight - 1); // 1px tolerance
      }
    };

    // Check initial state
    checkScrollable();
    handleScroll();

    scrollElement.addEventListener('scroll', handleScroll);

    // Observe content size changes (includes window resize)
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      setIsScrolling(false);
      setIsScrollable(false);
      setIsScrollAtBottom(false);
    };
  }, [scrollRef, enable, enableScrollable, enableScrolling, enableScrollAtBottom]);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return { isScrollable, isScrolling, isScrollAtBottom };
}
