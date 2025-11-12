'use client';

import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useEffect, useMemo, useRef } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import { EMOTION_COLORS_MAP, EMOTION_COLORS_MAP_ALPHA, EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';

import { useChart } from '../../_contexts/ChartContext';

import { EmotionChartContainer } from './common/EmotionChartContainer';

import { useChartLevelQuery } from '@/services/chart/chart.query';

// Register annotation plugin
Chart.register(annotationPlugin);

export function EmotionLevelChart() {
  const { accentColor } = useTheme();
  const { timePeriod, startDate } = useChart();

  const { data: levelData } = useChartLevelQuery({ period: timePeriod, startDate });

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const valueToLabel = (value: number) => {
    const labels = EMOTION_STEPS.map(step => step.type);
    return labels[value] || '';
  };

  // 데이터 가공
  const labels = useMemo(() => levelData?.data.map(item => item.label) || [], [levelData]);
  const barColor = useMemo(
    () => EMOTION_COLORS_MAP_ALPHA[accentColor as keyof typeof EMOTION_COLORS_MAP_ALPHA],
    [accentColor]
  );
  const lineColor = useMemo(() => EMOTION_COLORS_MAP[accentColor as keyof typeof EMOTION_COLORS_MAP], [accentColor]);
  const averageLineColor = '#f59e0b';

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'Emotion Level',
          data: levelData?.data.map(item => item.value) || [],
          backgroundColor: barColor,
          borderColor: barColor,
          borderWidth: 1,
        },
        {
          type: 'line' as const,
          label: '',
          data: levelData?.data.map(item => item.value) || [],
          backgroundColor: lineColor,
          borderColor: lineColor,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true, // Connect data points even with missing values
        },
      ],
    }),
    [labels, levelData, barColor, lineColor]
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
          type: 'category' as const,
          labels: [...labels],
          ticks: {
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
        annotation: {
          annotations: {
            averageLine: {
              type: 'line' as const,
              scaleID: 'y',
              value: levelData?.average || 0,
              borderColor: averageLineColor,
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                enabled: true,
                content: 'Average',
                position: 'end' as const,
                backgroundColor: averageLineColor,
                color: 'black',
                font: {
                  size: 12,
                  family: 'Helvetica',
                  weight: 'bold' as const,
                },
              },
            },
          },
        },
      },
    }),
    [labels, levelData]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
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
    <EmotionChartContainer title="Emotion Level Chart" className="max-mobile:h-[320px] max-mobile:pb-10">
      <div className="h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
