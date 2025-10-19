import { cn } from '@/app/_utils/styleUtils';

import { EmotionChartHeader } from '../header/EmotionChartHeader';

interface EmotionChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function EmotionChartContainer({ title, children, className }: EmotionChartContainerProps) {
  return (
    <div
      className={cn(
        'mobile:rounded-[4px] mobile:border mobile:p-4 mobile:shadow-sm mobile:gap-5 flex h-full min-h-0 w-full min-w-0 flex-col gap-6 border-[var(--gray-3)] bg-[var(--gray-1)] p-5',
        className
      )}
    >
      <EmotionChartHeader title={title} />
      {children}
    </div>
  );
}
