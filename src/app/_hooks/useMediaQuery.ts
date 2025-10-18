'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect media query matches
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Common media query breakpoints (Tailwind CSS based)
 */
export const MEDIA_QUERIES = {
  mobile: '(width < 480px)',
  sm: '(width < 640px)',
  md: '(width < 768px)',
  lg: '(width < 1024px)',
  xl: '(width < 1280px)',
  '2xl': '(width < 1536px)',
} as const;

/**
 * Predefined media query hooks for common breakpoints
 */
export const useIsMobile = () => useMediaQuery(MEDIA_QUERIES.mobile);
export const useIsSm = () => useMediaQuery(MEDIA_QUERIES.sm);
export const useIsMd = () => useMediaQuery(MEDIA_QUERIES.md);
export const useIsLg = () => useMediaQuery(MEDIA_QUERIES.lg);
export const useIsXl = () => useMediaQuery(MEDIA_QUERIES.xl);
export const useIs2Xl = () => useMediaQuery(MEDIA_QUERIES['2xl']);
