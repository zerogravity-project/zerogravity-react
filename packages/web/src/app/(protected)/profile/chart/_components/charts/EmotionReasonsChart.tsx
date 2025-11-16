'use client';

import { ScrollArea, Text } from '@radix-ui/themes';

import { useIsSm } from '@zerogravity/shared/hooks';

import { useChart } from '../../_contexts/ChartContext';

import { EmotionChartContainer } from './common/EmotionChartContainer';

import { useChartReasonQuery } from '@/services/chart/chart.query';

export function EmotionReasonsChart() {
  const isSm = useIsSm();
  const { timePeriod, startDate } = useChart();

  const { data: reasonData } = useChartReasonQuery({ period: timePeriod, startDate });

  return (
    <EmotionChartContainer title="Emotion Reasons" className="max-mobile:max-h-[200px]">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: '100%' }}>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 pr-7">
          {reasonData?.data.map(reason => (
            <div key={reason.label} className="flex items-center justify-between">
              <Text size={isSm ? '2' : '1'} weight="light">
                {reason.label}
              </Text>
              <Text size={isSm ? '2' : '1'} weight="regular" className="text-[var(--accent-9)]">
                {reason.count}
              </Text>
            </div>
          ))}
        </div>
      </ScrollArea>
    </EmotionChartContainer>
  );
}
