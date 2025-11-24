'use client';

import { useRouter } from 'next/navigation';

import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useSpaceoutVisit } from './_hooks/useSpaceoutVisit';

/**
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

/**
 * ============================================
 * Component
 * ============================================
 */

export default function SpaceoutPage() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();

  /**
   * --------------------------------------------
   * 2. Custom Hooks
   * --------------------------------------------
   */
  const { shouldShowOnboarding, isLoading } = useSpaceoutVisit();

  /**
   * --------------------------------------------
   * 3. States
   * --------------------------------------------
   */
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showSelection, setShowSelection] = useState(false);

  /**
   * --------------------------------------------
   * 4. Event Handlers
   * --------------------------------------------
   */

  /** Navigate to video page */
  const handleWatchVideo = () => {
    router.push('/spaceout/video');
  };

  /** Navigate to record page */
  const handleRecordNow = () => {
    router.push('/record');
  };

  /**
   * --------------------------------------------
   * 5. Effects
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
        setTimeout(() => setShowSelection(true), 1000);
        return prev;
      });
    }, 3000); // 3 seconds per message

    return () => clearInterval(messageInterval);
  }, [isLoading, shouldShowOnboarding]);

  /**
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */

  // Loading state
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
      {/* Onboarding Messages */}
      {!showSelection && shouldShowOnboarding && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="px-6 text-center"
          >
            <Heading size="8" weight="medium">
              {ONBOARDING_MESSAGES[currentMessageIndex]}
            </Heading>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Selection Screen */}
      {showSelection && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-6"
        >
          <Flex direction="column" gap="6" align="center">
            <Flex direction="column" gap="2" align="center">
              <Heading size="8" weight="medium" align="center">
                Choose Your Path
              </Heading>
              <Text size="3" color="gray" align="center">
                Take a moment to calm your mind, or record your emotions right away
              </Text>
            </Flex>

            <Flex direction="column" gap="4" className="w-full">
              <Button size="4" variant="surface" className="!h-auto !cursor-pointer !py-6" onClick={handleWatchVideo}>
                <Flex direction="column" gap="1" align="center">
                  <Flex gap="2" align="center">
                    <Icon>play_circle</Icon>
                    <Text size="5" weight="medium">
                      Watch Calming Video
                    </Text>
                  </Flex>
                  <Text size="2" color="gray">
                    Clear your mind before recording
                  </Text>
                </Flex>
              </Button>

              <Button size="4" variant="soft" className="!h-auto !cursor-pointer !py-6" onClick={handleRecordNow}>
                <Flex direction="column" gap="1" align="center">
                  <Flex gap="2" align="center">
                    <Icon>edit_note</Icon>
                    <Text size="5" weight="medium">
                      Record Now
                    </Text>
                  </Flex>
                  <Text size="2" color="gray">
                    Start tracking your emotions immediately
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </motion.div>
      )}
    </div>
  );
}
