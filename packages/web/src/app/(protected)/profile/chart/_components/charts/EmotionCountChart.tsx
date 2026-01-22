'use client';

import dynamic from 'next/dynamic';

import { useChartCountQuery } from '@/services/chart/chart.query';

import { useChart } from '../../_contexts/ChartContext';
import { formatTooltipDate } from '../../_utils/chartUtils';

import { EmotionChartContainer } from './common/EmotionChartContainer';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionCountChartProps {
  onReady?: () => void;
}

/*
 * ============================================
 * Dynamic Import
 * ============================================
 */

/** Lazy load Chart.js canvas (heavy dependency) */
const EmotionCountCanvas = dynamic(() => import('./canvas/EmotionCountCanvas'), {
  ssr: false,
});

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionCountChart({ onReady }: EmotionCountChartProps) {
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
  const { data: countData, isError, refetch } = useChartCountQuery({ period: timePeriod, startDate });

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer
      title="Emotion Count Chart"
      className="max-mobile:h-[320px] sm:col-span-2"
      isError={isError}
      onRetry={refetch}
    >
      <div className="relative h-full min-h-0 w-full min-w-0 overflow-hidden">
        <EmotionCountCanvas
          countData={countData?.data ?? []}
          timePeriod={timePeriod}
          startDate={startDate}
          onReady={onReady}
        />
        {/* Hidden data table for screen readers */}
        <table className="sr-only">
          <caption>Emotion record count data by period</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Emotion</th>
              <th scope="col">Daily</th>
              <th scope="col">Moment</th>
            </tr>
          </thead>
          <tbody>
            {countData?.data.map((item, index) => (
              <tr key={index}>
                <td>{formatTooltipDate(item.timestamp, timePeriod)}</td>
                <td>{item.emotionType}</td>
                <td>{item.daily}</td>
                <td>{item.moment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmotionChartContainer>
  );
}
