'use client';

import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Theme } from '@radix-ui/themes';

import { EMOTION_COLORS } from '../ui/emotion/constants/emotion.constants';
import { type EmotionColor } from '../ui/emotion/types/emotion.types';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ThemeContextValue {
  accentColor: EmotionColor;
  setAccentColor: (color: EmotionColor) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  getColor?: () => Promise<EmotionColor | null>;
  setColor?: (color: EmotionColor) => void;
}

/**
 * ============================================
 * Helper Functions
 * ============================================
 */

/** Get cookie value by name */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

/** Set cookie with name, value and max age */
function setCookie(name: string, value: string, maxAge: number = 86400) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * ============================================
 * Context
 * ============================================
 */

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * ============================================
 * Provider
 * ============================================
 */

export function ThemeProvider({ children, getColor, setColor }: ThemeProviderProps) {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  // Use a stable default for SSR/first client render to avoid hydration mismatch
  const [accentColor, setAccentColor] = useState<EmotionColor>('green');
  const [mounted, setMounted] = useState(false);

  /**
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */
  const value = useMemo(() => ({ accentColor, setAccentColor }), [accentColor]);

  /**
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Load theme from cookie on mount */
  useEffect(() => {
    async function loadTheme() {
      setMounted(true);
      try {
        // Use custom getter if provided (for Extension), otherwise use document.cookie
        const stored = getColor ? await getColor() : getCookie('accentColor');

        if (stored && (EMOTION_COLORS as readonly string[]).includes(stored)) {
          setAccentColor(stored as EmotionColor);
          return;
        }
        const random = EMOTION_COLORS[Math.floor(Math.random() * EMOTION_COLORS.length)];
        setAccentColor(random);

        // Use custom setter if provided, otherwise use document.cookie
        if (setColor) {
          setColor(random);
        } else {
          setCookie('accentColor', random);
        }
      } catch {
        const fallback = EMOTION_COLORS[Math.floor(Math.random() * EMOTION_COLORS.length)];
        setAccentColor(fallback);
      }
    }

    loadTheme();
  }, [getColor, setColor]);

  /** Persist changes to cookie */
  useEffect(() => {
    if (!mounted) return;
    try {
      // Use custom setter if provided, otherwise use document.cookie
      if (setColor) {
        setColor(accentColor);
      } else {
        setCookie('accentColor', accentColor);
      }
    } catch {
      // ignore
    }
  }, [accentColor, mounted, setColor]);

  /**
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={value}>
      <Theme grayColor="slate" accentColor={accentColor} appearance="dark">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

/**
 * ============================================
 * Hook
 * ============================================
 */

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
