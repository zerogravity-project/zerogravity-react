'use client';

import { useCallback, useState } from 'react';

import { useIsMobile, useIsSm } from '@zerogravity/shared/hooks';

import { EmotionCountChart } from '../charts/EmotionCountChart';
import { EmotionLevelChart } from '../charts/EmotionLevelChart';
import { EmotionReasonsChart } from '../charts/EmotionReasonsChart';

/*
 * ============================================
 * Component
 * ============================================
 */

export function ChartLayout() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();
  const isSm = useIsSm();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isCountChartReady, setIsCountChartReady] = useState(false);

  /*
   * --------------------------------------------
   * 3. Callbacks
   * --------------------------------------------
   */
  const handleCountChartReady = useCallback(() => setIsCountChartReady(true), []);

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-shrink-0 flex-col gap-3">
        <EmotionCountChart onReady={handleCountChartReady} />
        <EmotionReasonsChart isReady={isCountChartReady} />
        <EmotionLevelChart />
      </div>
    );
  }

  // Small Layout
  if (isSm) {
    return (
      <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-3 gap-4">
        <EmotionCountChart onReady={handleCountChartReady} />
        <EmotionReasonsChart isReady={isCountChartReady} />
        <EmotionLevelChart />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-2 gap-4">
      {/* Emotion Count Chart */}
      <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-3 gap-4">
        <EmotionCountChart onReady={handleCountChartReady} />
        <EmotionReasonsChart isReady={isCountChartReady} />
      </div>

      <EmotionLevelChart />
    </div>
  );
}
