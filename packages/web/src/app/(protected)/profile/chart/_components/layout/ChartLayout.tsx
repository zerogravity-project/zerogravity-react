'use client';

import { useIsMobile, useIsSm } from '@zerogravity/shared/hooks';

import { EmotionCountChart } from '../charts/EmotionCountChart';
import { EmotionLevelChart } from '../charts/EmotionLevelChart';
import { EmotionReasonsChart } from '../charts/EmotionReasonsChart';

/**
 * ============================================
 * Component
 * ============================================
 */

export function ChartLayout() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();
  const isSm = useIsSm();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-shrink-0 flex-col gap-3">
        <EmotionCountChart />
        <EmotionReasonsChart />
        <EmotionLevelChart />
      </div>
    );
  }

  if (isSm) {
    return (
      <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-3 gap-4">
        <EmotionCountChart />
        <EmotionReasonsChart />
        <EmotionLevelChart />
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-2 gap-4">
      {/* Emotion Count Chart */}
      <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-3 gap-4">
        <EmotionCountChart />
        <EmotionReasonsChart />
      </div>

      <EmotionLevelChart />
    </div>
  );
}
