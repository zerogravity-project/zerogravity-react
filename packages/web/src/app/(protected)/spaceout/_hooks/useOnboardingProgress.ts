/**
 * [useOnboardingProgress hook]
 * Manage spaceout onboarding message sequence and timing
 */

'use client';

import { useEffect, useState } from 'react';

import { useSpaceoutVisit } from './useSpaceoutVisit';

/*
 * ============================================
 * Constants
 * ============================================
 */

const ONBOARDING_MESSAGES = [
  'Welcome to Spaceout',
  'We help you track your emotions more clearly',
  'Before recording, take a moment to clear your mind',
  'Choose your path',
];

const MESSAGE_DURATION = 3000;
const SELECTION_DELAY = 1000;

/*
 * ============================================
 * Hook
 * ============================================
 */

export function useOnboardingProgress() {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const { shouldShowOnboarding, isLoading } = useSpaceoutVisit();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showSelection, setShowSelection] = useState(false);

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const currentMessage = ONBOARDING_MESSAGES[currentMessageIndex];
  const showOnboarding = !showSelection && shouldShowOnboarding;

  /*
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */

  /** Handle onboarding message progression */
  useEffect(() => {
    if (isLoading) return;

    // Skip onboarding if user has visited 3+ times
    if (!shouldShowOnboarding) {
      setShowSelection(true);
      return;
    }

    // Show onboarding messages with timing
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < ONBOARDING_MESSAGES.length - 1) {
          return prev + 1;
        }
        // After last message, show selection
        clearInterval(messageInterval);
        setTimeout(() => setShowSelection(true), SELECTION_DELAY);
        return prev;
      });
    }, MESSAGE_DURATION);

    return () => clearInterval(messageInterval);
  }, [isLoading, shouldShowOnboarding]);

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return {
    isLoading,
    showOnboarding,
    showSelection,
    currentMessage,
    currentMessageIndex,
  };
}
