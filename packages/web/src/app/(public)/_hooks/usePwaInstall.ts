/**
 * [PWA install hook]
 * Manage PWA install prompt state for Chrome/Android and iOS Safari
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * ============================================
 * Constants
 * ============================================
 */

const DISMISSED_KEY = 'pwa_banner_dismissed';

/**
 * ============================================
 * Types
 * ============================================
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * ============================================
 * Hook
 * ============================================
 */

export function usePwaInstall() {
  /**
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isReady, setIsReady] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const showBanner = isReady && !isInstalled && !isDismissed && (hasPrompt || isIOS);

  /**
   * --------------------------------------------
   * 3. Callbacks
   * --------------------------------------------
   */

  /** Trigger native install prompt (Chrome/Android only) */
  const promptInstall = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;

    await prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      deferredPromptRef.current = null;
      setHasPrompt(false);
      setIsInstalled(true);
    }
  }, []);

  /** Dismiss banner and persist to localStorage */
  const dismissBanner = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setIsDismissed(true);
  }, []);

  /**
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */

  /** Initialize: check localStorage, detect platform, listen for install prompt */
  useEffect(() => {
    // Check if already dismissed
    if (localStorage.getItem(DISMISSED_KEY) === 'true') {
      setIsDismissed(true);
      setIsReady(true);
      return;
    }

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setIsReady(true);
      return;
    }

    // Detect iOS Safari (not in standalone, not Chrome-based)
    const ua = navigator.userAgent;
    const isIOSSafari = /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/(CriOS|FxiOS|OPiOS|EdgiOS)/.test(ua);

    if (isIOSSafari) {
      setIsIOS(true);
    }

    // Listen for Chrome/Android install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setHasPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    setIsReady(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  /**
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return {
    showBanner,
    isIOS,
    promptInstall,
    dismissBanner,
  };
}
