'use client';

import { useRouter } from 'next/navigation';

import { Heading, Text } from '@radix-ui/themes';
import { m } from 'motion/react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { useIsSm } from '@zerogravity/shared/hooks';
import { getTodayString } from '@zerogravity/shared/utils';

export default function RecordSelectionPage() {
  const router = useRouter();
  const isSm = useIsSm();
  const today = getTodayString();

  const handleMomentRecord = () => {
    router.push(`/record/moment?date=${today}`);
  };

  const handleDailyRecord = () => {
    router.push(`/record/daily?date=${today}`);
  };

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-background)] px-6">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <Heading size={isSm ? '7' : '8'} weight="medium" align="center">
              Record Your Emotions
            </Heading>
            <Text size={isSm ? '2' : '3'} color="gray" align="center">
              Choose how you want to track your emotions
            </Text>
          </div>

          <div className="flex w-full flex-col gap-3 sm:gap-4">
            {/* Moment Record Card */}

            <MotionButton size="4" variant="soft" className="!h-auto !w-full !p-4 sm:!p-6" onClick={handleMomentRecord}>
              <div className="flex w-full flex-col items-start gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon className="!text-[24px] sm:!text-[32px]">bolt</Icon>
                  <Heading size={isSm ? '5' : '6'} weight="medium">
                    Moment Record
                  </Heading>
                </div>
                <Text size={isSm ? '2' : '3'} color="gray" align="left">
                  Quick emotional check-in. Capture your current emotion and the reason behind it in just 2 simple
                  steps.
                </Text>
                <div className="mt-1 flex gap-2 sm:mt-2">
                  <Text
                    size={isSm ? '1' : '2'}
                    weight="medium"
                    className="rounded-full bg-[var(--accent-3)] px-2 py-1 sm:px-3"
                  >
                    2 steps
                  </Text>
                  <Text
                    size={isSm ? '1' : '2'}
                    weight="medium"
                    className="rounded-full bg-[var(--accent-3)] px-2 py-1 sm:px-3"
                  >
                    ~1 minute
                  </Text>
                </div>
              </div>
            </MotionButton>

            {/* Daily Record Card */}

            <MotionButton
              size="4"
              variant="surface"
              className="!h-auto !w-full !p-4 sm:!p-6"
              onClick={handleDailyRecord}
            >
              <div className="flex w-full flex-col items-start gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon className="!text-[24px] sm:!text-[32px]">edit_note</Icon>
                  <Heading size={isSm ? '5' : '6'} weight="medium">
                    Daily Record
                  </Heading>
                </div>
                <Text size={isSm ? '2' : '3'} color="gray" align="left">
                  Complete emotional journal entry. Record your emotion, identify the reason, and write detailed notes
                  about your day.
                </Text>
                <div className="mt-1 flex gap-2 sm:mt-2">
                  <Text
                    size={isSm ? '1' : '2'}
                    weight="medium"
                    className="rounded-full bg-[var(--accent-3)] px-2 py-1 sm:px-3"
                  >
                    3 steps
                  </Text>
                  <Text
                    size={isSm ? '1' : '2'}
                    weight="medium"
                    className="rounded-full bg-[var(--accent-3)] px-2 py-1 sm:px-3"
                  >
                    ~3-5 minutes
                  </Text>
                </div>
              </div>
            </MotionButton>
          </div>
        </div>
      </m.div>
    </div>
  );
}
