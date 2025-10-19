'use client';

import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

import { DAYS_OF_WEEK } from '@/app/(protected)/profile/calendar/_constants/calendar.constants';

import { EMOTION_STEPS } from '../../../../../_components/ui/emotion/_constants/emotion.constants';

import { EmotionChartContainer } from './common/EmotionChartContainer';

interface EmotionCountChartProps {
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
  }>;
}

export function EmotionCountChart({ datasets }: EmotionCountChartProps) {
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

    const chartData = {
      labels: [...DAYS_OF_WEEK],
      datasets: datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.backgroundColor,
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      })),
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: '#212225',
          },
          type: 'category' as const,
          labels: [...DAYS_OF_WEEK],
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
            max: 8,
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
              return `Emotion Type: ${tooltipItem.raw.y}`;
            },
          },
        },
      },
    };

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
  }, [datasets]);

  return (
    <EmotionChartContainer title="Emotion Count Chart" className="max-mobile:h-[320px] sm:col-span-2">
      <div className="h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
