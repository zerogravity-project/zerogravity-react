'use client';

import dynamic from 'next/dynamic';

import { useMemo } from 'react';

import { useChartLevelQuery } from '@/services/chart/chart.query';

import { useChart } from '../../_contexts/ChartContext';
import { getChartConfig } from '../../_utils/chartUtils';

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
   * 3. Computed Values
   * --------------------------------------------
   */

  /** Chart labels (without next period label) */
  const labels = useMemo(() => {
    const configLabels = getChartConfig(timePeriod, startDate)?.labels || [];
    return [...configLabels].slice(0, -1);
  }, [timePeriod, startDate]);

  /** Whether we have valid average data */
  const hasAverage = levelData?.average != null;

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer
      title="Emotion Level Chart"
      className="max-mobile:!min-h-[calc(340px+var(--safe-area-bottom))] max-mobile:pb-[calc(2.5rem+var(--safe-area-bottom))]"
      isError={isError}
      onRetry={refetch}
    >
      <div className="relative h-full min-h-0 w-full min-w-0 overflow-hidden">
        <EmotionLevelCanvas
          levelData={levelData ?? { data: [], average: null }}
          timePeriod={timePeriod}
          startDate={startDate}
        />
        {/* Hidden data table for screen readers */}
        <table className="sr-only">
          <caption>Emotion level data by period</caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Emotion Level</th>
            </tr>
          </thead>
          <tbody>
            {levelData?.data.map((item, index) => (
              <tr key={index}>
                <td>{labels[index]}</td>
                <td>{item.value != null ? item.value.toFixed(1) : 'No data'}</td>
              </tr>
            ))}
            {hasAverage && (
              <tr>
                <td>Average</td>
                <td>{levelData?.average?.toFixed(1)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </EmotionChartContainer>
  );
}
