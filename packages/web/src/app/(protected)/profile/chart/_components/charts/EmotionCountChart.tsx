'use client';

import { Chart } from 'chart.js/auto';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  EMOTION_COLORS,
  EMOTION_COLORS_MAP,
  EMOTION_STEPS,
  EMOTION_TYPES,
} from '@zerogravity/shared/components/ui/emotion';

import { useChartCountQuery } from '@/services/chart/chart.query';

import { useChart } from '../../_contexts/ChartContext';
import { getChartConfig } from '../../_utils/chartUtils';

import { EmotionChartContainer } from './common/EmotionChartContainer';

// Mock data for charts - Week view
// const mockCountData = [
//   {
//     label: 'Emotion Count',
//     data: [
//       { x: 0.5, y: 3 }, // Mon 12:00
//       { x: 0.78, y: 5 }, // Mon 18:45
//       { x: 1.38, y: 2 }, // Tue 09:00
//       { x: 2.25, y: 4 }, // Wed 06:00
//       { x: 3.5, y: 6 }, // Thu 12:00
//       { x: 4.1, y: 3 }, // Fri 02:24
//       { x: 5.67, y: 5 }, // Sat 16:00
//       { x: 6.25, y: 4 }, // Sun 06:00
//     ],
//     backgroundColor: '#8E4EC6',
//   },
// ];

export function EmotionCountChart() {
  const { timePeriod, startDate } = useChart();

  const { data: countData } = useChartCountQuery({ period: timePeriod, startDate });

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const valueToLabel = useCallback((value: number) => {
    const labels = EMOTION_STEPS.map(step => step.type);
    return labels[value] || '';
  }, []);

  // emotionId별로 데이터 가공
  const chartDatasets = useMemo(() => {
    if (!countData?.data) return [];

    const groupedByEmotionId = countData.data.reduce(
      (acc, item) => {
        const emotionId = item.emotionId;
        if (!acc[emotionId]) {
          acc[emotionId] = [];
        }
        acc[emotionId].push({
          x: item.position,
          y: item.emotionId,
        });
        return acc;
      },
      {} as Record<number, Array<{ x: number; y: number }>>
    );

    return Object.entries(groupedByEmotionId).map(([emotionIdStr, points]) => {
      const emotionId = Number(emotionIdStr);
      const emotionType = EMOTION_TYPES[emotionId];
      const colorKey = EMOTION_COLORS[emotionId];
      const backgroundColor = EMOTION_COLORS_MAP[colorKey as keyof typeof EMOTION_COLORS_MAP];

      return {
        label: emotionType,
        data: points,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });
  }, [countData]);

  const chartData = useMemo(
    () => ({
      datasets: chartDatasets,
    }),
    [chartDatasets]
  );

  const chartOptions = useMemo(
    () => ({
      clip: false as const,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: '#212225',
          },
          type: 'linear' as const,
          min: 0,
          max: getChartConfig(timePeriod, startDate)?.max || 0,
          ticks: {
            stepSize: 1,
            callback: (value: string | number) => {
              const index = Number(value);
              return index >= 0 && index <= (getChartConfig(timePeriod, startDate)?.max || 0)
                ? getChartConfig(timePeriod, startDate)?.labels[index] || ''
                : '';
            },
            font: {
              size: 11,
            },
          },
        },
        y: {
          min: 0,
          max: 6,
          grid: {
            color: '#212225',
          },
          ticks: {
            callback: (tickValue: string | number) => valueToLabel(Number(tickValue)),
            stepSize: 1,
            autoSkip: false,
            maxTicksLimit: 7,
            font: {
              size: 11,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
          position: 'bottom' as const,
        },
        tooltip: {
          callbacks: {
            title: () => '',
            label: (tooltipItem: any) => {
              const dayIndex = Math.floor(tooltipItem.parsed.x);
              const emotionLabel = valueToLabel(tooltipItem.parsed.y);
              return `${getChartConfig(timePeriod, startDate)?.labels[dayIndex] || ''} - ${emotionLabel}`;
            },
          },
        },
      },
    }),
    [valueToLabel, timePeriod, startDate]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'scatter',
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData, chartOptions]);

  return (
    <EmotionChartContainer title="Emotion Count Chart" className="max-mobile:h-[320px] sm:col-span-2">
      <div className="h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
