'use client';

import { type ReactNode } from 'react';

import { ThemeProvider } from '@zerogravity/shared/components/providers';
import { type EmotionColor } from '@zerogravity/shared/components/ui/emotion';

/**
 * ============================================
 * Constants
 * ============================================
 */

const WEB_APP_URL = import.meta.env.VITE_WEB_APP_URL || 'http://localhost:3000';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ThemeProviderAdapterProps {
  children: ReactNode;
}

/**
 * ============================================
 * Component
 * ============================================
 *
 * Extension-specific ThemeProvider wrapper
 * Uses Chrome Cookies API to sync theme with web app
 * Reads/writes accentColor cookie from web app domain
 *
 * @param children - Child components to wrap
 */
export function ThemeProviderAdapter({ children }: ThemeProviderAdapterProps) {
  /**
   * --------------------------------------------
   * 1. Helper Functions
   * --------------------------------------------
   */
  /** Get color from web app cookies */
  const getColor = async (): Promise<EmotionColor | null> => {
    try {
      if (typeof chrome === 'undefined' || !chrome.cookies) {
        console.warn('[ThemeProviderAdapter] Chrome Cookies API not available');
        return null;
      }

      const cookie = await chrome.cookies.get({
        url: WEB_APP_URL,
        name: 'accentColor',
      });

      return (cookie?.value as EmotionColor) || null;
    } catch (error) {
      console.error('[ThemeProviderAdapter] Error getting theme cookie:', error);
      return null;
    }
  };

  // Set color to web app cookies
  const setColor = (color: EmotionColor): void => {
    try {
      if (typeof chrome === 'undefined' || !chrome.cookies) {
        console.warn('[ThemeProviderAdapter] Chrome Cookies API not available');
        return;
      }

      chrome.cookies.set({
        url: WEB_APP_URL,
        name: 'accentColor',
        value: color,
        path: '/',
        expirationDate: Math.floor(Date.now() / 1000) + 86400, // 24 hours
        sameSite: 'lax',
      });
    } catch (error) {
      console.error('[ThemeProviderAdapter] Error setting theme cookie:', error);
    }
  };

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <ThemeProvider getColor={getColor} setColor={setColor}>
      {children}
    </ThemeProvider>
  );
}
