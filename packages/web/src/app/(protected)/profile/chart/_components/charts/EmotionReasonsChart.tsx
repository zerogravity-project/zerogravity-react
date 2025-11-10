'use client';

import { ScrollArea, Text } from '@radix-ui/themes';

import { EMOTION_REASONS } from '@zerogravity/shared/components/ui/emotion';
import { useIsSm } from '@zerogravity/shared/hooks';

import { EmotionChartContainer } from './common/EmotionChartContainer';

export function EmotionReasonsChart() {
  const isSm = useIsSm();

  return (
    <EmotionChartContainer title="Emotion Reasons" className="max-mobile:max-h-[200px]">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: '100%' }}>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 pr-7">
          {EMOTION_REASONS.map(reason => (
            <div key={reason} className="flex items-center justify-between">
              <Text size={isSm ? '2' : '1'} weight="light">
                {reason}
              </Text>
              <Text size={isSm ? '2' : '1'} weight="regular" className="text-[var(--accent-9)]">
                0
              </Text>
            </div>
          ))}
        </div>
      </ScrollArea>
    </EmotionChartContainer>
  );
}
