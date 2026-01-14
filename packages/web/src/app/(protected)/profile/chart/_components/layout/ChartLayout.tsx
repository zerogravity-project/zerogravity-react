'use client';

import dynamic from 'next/dynamic';

import { useIsMobile, useIsSm } from '@zerogravity/shared/hooks';

import { EmotionReasonsChart } from '../charts/EmotionReasonsChart';

/** Lazy load Chart.js components */
const EmotionCountChart = dynamic(() => import('../charts/EmotionCountChart').then(mod => mod.EmotionCountChart), {
  ssr: false,
});
const EmotionLevelChart = dynamic(() => import('../charts/EmotionLevelChart').then(mod => mod.EmotionLevelChart), {
  ssr: false,
});

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
