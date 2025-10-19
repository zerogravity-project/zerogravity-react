'use client';

import { Button, Heading, SegmentedControl } from '@radix-ui/themes';

import Icon from '@/app/_components/ui/icon/Icon';
import { useIsSm } from '@/app/_hooks/useMediaQuery';

import { useChart } from '../../_contexts/ChartContext';

export function EmotionChartsHeader() {
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

  if (isSm) {
    return (
      <header className="flex flex-col">
        {/* Time Period Selection */}
        <div className="mobile:px-0 mobile:pt-0 flex w-full items-center p-3">
          <SegmentedControl.Root
            value={timePeriod}
            onValueChange={setTimePeriod}
            variant="classic"
            size="1"
            radius="small"
            className="!h-7 w-full !border !border-[var(--gray-6)]"
          >
            <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
            <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
            <SegmentedControl.Item value="year">Year</SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>

        <div className="mobile:px-0 mobile:pl-2 flex items-center justify-between pt-1 pr-3 pb-4 pl-5">
          <Heading size="5" weight="medium" className="text-nowrap">
            {getFormattedDateRange()}
          </Heading>
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
      </header>
    );
  }

  return (
    <header className="p-0 pb-4">
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
    </header>
  );
}
