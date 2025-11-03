'use client';

import { type ComponentProps, type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Theme } from '@radix-ui/themes';

import { EMOTION_COLORS } from '../ui/emotion/constants/emotion.constants';

type AccentColor = NonNullable<ComponentProps<typeof Theme>['accentColor']>;

interface ThemeContextValue {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use a stable default for SSR/first client render to avoid hydration mismatch
  const [accentColor, setAccentColor] = useState<AccentColor>('green');
  const [mounted, setMounted] = useState(false);

  // Randomize on client after hydration (no persistence)
  useEffect(() => {
    setMounted(true);
    try {
      const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('accentColor') : null;
      if (stored) {
        setAccentColor(stored as AccentColor);
        return;
      }
      const random = EMOTION_COLORS[Math.floor(Math.random() * EMOTION_COLORS.length)] as AccentColor;
      setAccentColor(random);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('accentColor', random);
      }
    } catch {
      const fallback = EMOTION_COLORS[Math.floor(Math.random() * EMOTION_COLORS.length)] as AccentColor;
      setAccentColor(fallback);
    }
  }, []);

  // Persist changes during the session
  useEffect(() => {
    if (!mounted) return;
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('accentColor', accentColor);
      }
    } catch {
      // ignore
    }
  }, [accentColor, mounted]);

  const value = useMemo(() => ({ accentColor, setAccentColor }), [accentColor]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={value}>
      <Theme grayColor="slate" accentColor={accentColor} appearance="dark">
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
