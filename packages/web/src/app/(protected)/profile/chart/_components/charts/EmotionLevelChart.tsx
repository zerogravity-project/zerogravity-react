'use client';

import dynamic from 'next/dynamic';

import { useChartLevelQuery } from '@/services/chart/chart.query';

import { useChart } from '../../_contexts/ChartContext';

import { EmotionChartContainer } from './common/EmotionChartContainer';

/*
 * ============================================
 * Dynamic Import
 * ============================================
 */

/** Lazy load Chart.js canvas (heavy dependency) */
const EmotionLevelCanvas = dynamic(() => import('./canvas/EmotionLevelCanvas'), {
  ssr: false,
});

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionLevelChart() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { timePeriod, startDate } = useChart();

  /*
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const { data: levelData, isError, refetch } = useChartLevelQuery({ period: timePeriod, startDate });

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer
      title="Emotion Level Chart"
      className="max-mobile:h-[320px] max-mobile:pb-10"
      isError={isError}
      onRetry={refetch}
    >
      <div className="relative h-full min-h-0 w-full min-w-0">
        <EmotionLevelCanvas
          levelData={levelData ?? { data: [], average: null }}
          timePeriod={timePeriod}
          startDate={startDate}
        />
      </div>
    </EmotionChartContainer>
  );
}
