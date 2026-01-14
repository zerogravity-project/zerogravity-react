import { cn } from '@zerogravity/shared/utils';

import { EmotionChartHeader } from '../header/EmotionChartHeader';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

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
