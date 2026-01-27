'use client';

import { useRouter } from 'next/navigation';

import { Heading, Text } from '@radix-ui/themes';
import { m } from 'motion/react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { useIsSm } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function SelectionScreen() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const isSm = useIsSm();

  /*
   * --------------------------------------------
   * 2. Event Handlers
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

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md px-6"
    >
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-2">
          <Heading size={isSm ? '7' : '8'} weight="medium" align="center">
            Choose Your Path
          </Heading>
          <Text size={isSm ? '2' : '3'} color="gray" align="center">
            Take a moment to calm your mind,
            <br />
            or record your emotions right away
          </Text>
        </div>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <MotionButton size="4" variant="surface" className="!h-auto !py-4 sm:!py-6" onClick={handleWatchVideo}>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Icon>play_circle</Icon>
                <Text size={isSm ? '4' : '5'} weight="medium">
                  Watch Calming Video
                </Text>
              </div>
              <Text size={isSm ? '1' : '2'} color="gray">
                Clear your mind before recording
              </Text>
            </div>
          </MotionButton>

          <MotionButton size="4" variant="soft" className="!h-auto !py-4 sm:!py-6" onClick={handleRecordNow}>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                <Icon>edit_note</Icon>
                <Text size={isSm ? '4' : '5'} weight="medium">
                  Record Now
                </Text>
              </div>
              <Text size={isSm ? '1' : '2'} color="gray">
                Start tracking your emotions immediately
              </Text>
            </div>
          </MotionButton>
        </div>
      </div>
    </m.div>
  );
}
