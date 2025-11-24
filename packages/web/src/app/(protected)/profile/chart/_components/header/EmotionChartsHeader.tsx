'use client';

import { Button, Callout, Heading, SegmentedControl } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { useIsSm } from '@zerogravity/shared/hooks';

import GeminiButton from '@/app/_components/ui/button/GeminiButton';
import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { AiConsentModal } from '@/app/_components/ui/modal/AiConsentModal';

import { useChart } from '../../_contexts/ChartContext';

interface EmotionChartsHeaderProps {
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

export function EmotionChartsHeader({ setIsDrawerOpen }: EmotionChartsHeaderProps) {
  const { data: session } = useSession();
  const isSm = useIsSm();

  const {
    timePeriod,
    goToNextPeriod,
    goToPreviousPeriod,
    setTimePeriod,
    getFormattedDateRange,
    canGoNext,
    canGoPrevious,
  } = useChart();

  const { openComponentModal } = useModal();

  const consents = session?.user?.consents;

  const handleOpenAiAnalysisDrawer = () => {
    // Show AI consent modal if user has not consented to AI analysis
    if (!consents?.aiAnalysisConsent) {
      openComponentModal({
        component: <AiConsentModal onAgree={() => setIsDrawerOpen(true)} />,
      });

      return;
    }

    setIsDrawerOpen(true);
  };

  if (isSm) {
    return (
      <header className="flex flex-col">
        {/* Time Period Selection */}
        <div className="mobile:px-0 mobile:pt-0 flex w-full items-center p-4">
          <SegmentedControl.Root
            value={timePeriod}
            onValueChange={setTimePeriod}
            variant="classic"
            size="2"
            radius="small"
            className="w-full !border !border-[var(--gray-6)]"
          >
            <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
            <SegmentedControl.Item value="year">Year</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>

        <div className="mobile:px-0 mobile:pl-2 flex items-center justify-between pr-4 pb-4 pl-5">
          <Heading size="6" weight="medium" className="text-nowrap">
            {getFormattedDateRange()}
          </Heading>
          <div className="flex items-center">
            {/* Previous Month Button */}
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToPreviousPeriod}
              disabled={!canGoPrevious}
              className="!w-8 !cursor-pointer !rounded-r-none !border-r-0"
            >
              <Icon>chevron_left</Icon>
            </Button>
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToNextPeriod}
              disabled={!canGoNext}
              className="!w-8 !cursor-pointer !rounded-l-none"
            >
              <Icon>chevron_right</Icon>
            </Button>
          </div>
        </div>

        <div className="mobile:px-0 px-4 pb-5">
          <Callout.Root color="gray">
            {/* AI Analysis Button */}
            <GeminiButton onClick={handleOpenAiAnalysisDrawer} className="gap-3">
              Discover insights from your emotions with AI analysis.
            </GeminiButton>
          </Callout.Root>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-3 p-0 pb-4">
      <div className="flex items-center justify-between gap-3">
        <Heading size="5" weight="medium" className="text-nowrap">
          {getFormattedDateRange()}
        </Heading>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {/* Time Period Selection */}
          <SegmentedControl.Root
            value={timePeriod}
            onValueChange={setTimePeriod}
            variant="classic"
            size="1"
            radius="small"
            className="!h-7 !border !border-[var(--gray-6)]"
          >
            <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
            <SegmentedControl.Item value="year">Year</SegmentedControl.Item>
          </SegmentedControl.Root>
          <div className="flex items-center">
            {/* Previous Month Button */}
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToPreviousPeriod}
              className="!h-7 !w-7 !cursor-pointer !rounded-r-none !border-r-0"
              disabled={!canGoPrevious}
            >
              <Icon size={20}>chevron_left</Icon>
            </Button>

            {/* Next Month Button */}
            <Button
              size="2"
              variant="surface"
              color="gray"
              onClick={goToNextPeriod}
              className="!h-7 !w-7 !cursor-pointer !rounded-l-none"
              disabled={!canGoNext}
            >
              <Icon size={20}>chevron_right</Icon>
            </Button>
          </div>
        </div>
      </div>

      <Callout.Root color="gray">
        <GeminiButton onClick={handleOpenAiAnalysisDrawer} className="gap-3">
          Discover insights from your emotions with AI analysis.
        </GeminiButton>
      </Callout.Root>
    </header>
  );
}
