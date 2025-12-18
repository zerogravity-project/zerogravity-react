'use client';

import { Heading } from '@radix-ui/themes';

import OnboardingMessages from './_components/OnboardingMessages';
import SelectionScreen from './_components/SelectionScreen';
import { useOnboardingProgress } from './_hooks/useOnboardingProgress';

/**
 * ============================================
 * Component
 * ============================================
 */

export default function SpaceoutPage() {
  /**
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const { isLoading, showOnboarding, showSelection, currentMessage, currentMessageIndex } = useOnboardingProgress();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-background)]">
        <Heading size="6" color="gray">
          Loading...
        </Heading>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-background)]">
      {showOnboarding && <OnboardingMessages message={currentMessage} messageIndex={currentMessageIndex} />}
      {showSelection && <SelectionScreen />}
    </div>
  );
}
