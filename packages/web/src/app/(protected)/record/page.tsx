'use client';

import { useRouter } from 'next/navigation';

import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { motion } from 'motion/react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { getTodayString } from '@zerogravity/shared/utils';

export default function RecordSelectionPage() {
  const router = useRouter();
  const today = getTodayString();

  const handleMomentRecord = () => {
    router.push(`/record/moment?date=${today}`);
  };

  const handleDailyRecord = () => {
    router.push(`/record/daily?date=${today}`);
  };

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[var(--color-background)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="2" align="center">
            <Heading size="8" weight="medium" align="center">
              Record Your Emotions
            </Heading>
            <Text size="3" color="gray" align="center">
              Choose how you want to track your emotions today
            </Text>
          </Flex>

          <Flex direction="column" gap="4" className="w-full">
            {/* Moment Record Card */}
            <Card asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="4"
                  variant="soft"
                  className="!h-auto !w-full !cursor-pointer !p-6"
                  onClick={handleMomentRecord}
                >
                  <Flex direction="column" gap="3" align="start" className="w-full">
                    <Flex gap="3" align="center">
                      <Icon className="!text-[32px]">bolt</Icon>
                      <Heading size="6" weight="medium">
                        Moment Record
                      </Heading>
                    </Flex>
                    <Text size="3" color="gray" align="left">
                      Quick emotional check-in. Capture your current emotion and the reason behind it in just 2 simple
                      steps.
                    </Text>
                    <Flex gap="2" className="mt-2">
                      <Text size="2" weight="medium" className="rounded-full bg-[var(--accent-3)] px-3 py-1">
                        2 steps
                      </Text>
                      <Text size="2" weight="medium" className="rounded-full bg-[var(--accent-3)] px-3 py-1">
                        ~1 minute
                      </Text>
                    </Flex>
                  </Flex>
                </Button>
              </motion.div>
            </Card>

            {/* Daily Record Card */}
            <Card asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="4"
                  variant="surface"
                  className="!h-auto !w-full !cursor-pointer !p-6"
                  onClick={handleDailyRecord}
                >
                  <Flex direction="column" gap="3" align="start" className="w-full">
                    <Flex gap="3" align="center">
                      <Icon className="!text-[32px]">edit_note</Icon>
                      <Heading size="6" weight="medium">
                        Daily Record
                      </Heading>
                    </Flex>
                    <Text size="3" color="gray" align="left">
                      Complete emotional journal entry. Record your emotion, identify the reason, and write detailed
                      notes about your day.
                    </Text>
                    <Flex gap="2" className="mt-2">
                      <Text size="2" weight="medium" className="rounded-full bg-[var(--accent-3)] px-3 py-1">
                        3 steps
                      </Text>
                      <Text size="2" weight="medium" className="rounded-full bg-[var(--accent-3)] px-3 py-1">
                        ~3-5 minutes
                      </Text>
                    </Flex>
                  </Flex>
                </Button>
              </motion.div>
            </Card>
          </Flex>
        </Flex>
      </motion.div>
    </div>
  );
}
