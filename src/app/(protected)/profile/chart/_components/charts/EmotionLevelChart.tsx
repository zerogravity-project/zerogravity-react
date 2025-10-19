'use client';

import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useEffect, useRef } from 'react';

import { DAYS_OF_WEEK } from '@/app/(protected)/profile/calendar/_constants/calendar.constants';
import { EMOTION_STEPS } from '@/app/_components/ui/emotion/_constants/emotion.constants';

import { EmotionChartContainer } from './common/EmotionChartContainer';

// Register annotation plugin
Chart.register(annotationPlugin);

interface EmotionLevelChartProps {
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

export function EmotionLevelChart({ datasets }: EmotionLevelChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const valueToLabel = (value: number) => {
    const labels = EMOTION_STEPS.map(step => step.type);
    return labels[value] || '';
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = [...DAYS_OF_WEEK];
    const barColor = '#0077FF3A';
    const lineColor = '#0090FF';
    const averageLineColor = '#f59e0b';

    const chartData = {
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: datasets[0].label,
          data: datasets[0].data,
          backgroundColor: barColor,
          borderColor: barColor,
          borderWidth: 1,
        },
        {
          type: 'line' as const,
          label: '',
          data: datasets[0].data,
          backgroundColor: lineColor,
          borderColor: lineColor,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true, // Connect data points even with missing values
        },
      ],
    };

    // Calculate average from non-zero data
    const nonZeroData = datasets[0].data.filter(value => value !== 0);
    const average = nonZeroData.length > 0 ? nonZeroData.reduce((a, b) => a + b, 0) / nonZeroData.length : 0;

    const chartOptions = {
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
          grid: {
            color: '#212225',
          },
          ticks: {
            callback: (tickValue: string | number) => valueToLabel(Number(tickValue)),
            stepSize: 1,
            min: 1,
            max: 7,
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
              value: average,
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
    };

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
  }, [datasets]);

  return (
    <EmotionChartContainer title="Emotion Level Chart" className="max-mobile:h-[320px] max-mobile:pb-10">
      <div className="h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
