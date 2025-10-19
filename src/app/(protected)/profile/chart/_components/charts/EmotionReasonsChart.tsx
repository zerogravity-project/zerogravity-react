import { ScrollArea, Text } from '@radix-ui/themes';

import { EMOTION_REASONS } from '@/app/_components/ui/emotion/_constants/emotion.constants';

import { EmotionChartContainer } from './common/EmotionChartContainer';

export function EmotionReasonsChart() {
  return (
    <EmotionChartContainer title="Emotion Reasons" className="max-mobile:max-h-[200px]">
      <ScrollArea type="always" scrollbars="vertical" style={{ height: '100%' }}>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 pr-7">
          {EMOTION_REASONS.map(reason => (
            <div key={reason} className="flex items-center justify-between">
              <Text size="1" weight="light">
                {reason}
              </Text>
              <Text size="1" weight="regular" className="text-[var(--accent-9)]">
                0
              </Text>
            </div>
          ))}
        </div>
      </ScrollArea>
    </EmotionChartContainer>
  );
}
