'use client';

import { Text } from '@radix-ui/themes';

import { useIsSm } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionChartHeaderProps {
  title: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionChartHeader({ title }: EmotionChartHeaderProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isSm = useIsSm();

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <div className="flex flex-col">
      <Text size={isSm ? '4' : '3'} weight="regular" className="mb-2">
        {title}
      </Text>
    </div>
  );
}
