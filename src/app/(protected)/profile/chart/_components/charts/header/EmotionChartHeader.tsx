import { Text } from '@radix-ui/themes';

interface EmotionChartHeaderProps {
  title: string;
}

export function EmotionChartHeader({ title }: EmotionChartHeaderProps) {
  return (
    <div className="flex flex-col">
      <Text size="3" weight="regular" className="mb-2">
        {title}
      </Text>
    </div>
  );
}
