'use client';

import { useRouter } from 'next/navigation';

import { AnimatePresence, motion } from 'motion/react';

import { TopAppBar } from '@/app/_components/ui/appbar/TopAppBar';

import { useEmotionRecordContext } from '../_contexts/EmotionRecordContext';

import DiaryStep from './steps/diary/DiaryStep';
import EmotionStep from './steps/emotion/EmotionStep';
import ReasonStep from './steps/reason/ReasonStep';

export default function EmotionRecord() {
  const router = useRouter();
  const { currentStep, prevStep } = useEmotionRecordContext();

  const handleGoBack = () => {
    if (currentStep === 'emotion') {
      router.back();

      return;
    }

    prevStep();
  };

  return (
    <>
      <TopAppBar
        text="Go Back"
        icon="arrow_back"
        onClick={handleGoBack}
        className="mobile:hidden fixed top-0 left-0 flex"
      />
      <div className="flex h-full w-full flex-col items-center justify-between">
        {/* <EmotionRecordHeader /> */}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'emotion' && (
            <motion.div
              key="emotion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full w-full flex-col items-center"
            >
              <EmotionStep />
            </motion.div>
          )}
          {currentStep === 'reason' && (
            <motion.div
              key="reason"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-1 flex-col items-center"
            >
              <ReasonStep />
            </motion.div>
          )}
          {currentStep === 'diary' && (
            <motion.div
              key="diary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-1 flex-col items-center"
            >
              <DiaryStep />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
