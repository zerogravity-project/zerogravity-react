'use client';

import { Text } from '@radix-ui/themes';

import { useIsSm } from '@zerogravity/shared/hooks';

interface EmotionChartHeaderProps {
  title: string;
}

export function EmotionChartHeader({ title }: EmotionChartHeaderProps) {
  const isSm = useIsSm();

  return (
    <div className="flex flex-col">
      <Text size={isSm ? '4' : '3'} weight="regular" className="mb-2">
        {title}
      </Text>
    </div>
  );
}
