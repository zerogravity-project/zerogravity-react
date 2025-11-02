'use client';

import { Chart } from 'chart.js/auto';
import { useEffect, useRef } from 'react';

import { DAYS_OF_WEEK } from '@/app/(protected)/profile/calendar/_constants/calendar.constants';

import { EMOTION_STEPS } from '../../../../../_components/ui/emotion/_constants/emotion.constants';

import { EmotionChartContainer } from './common/EmotionChartContainer';

interface EmotionCountChartProps {
  datasets: Array<{
    label: string;
    data: Array<{ x: number; y: number }>;
    backgroundColor: string;
  }>;
}

export function EmotionCountChart({ datasets }: EmotionCountChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const valueToLabel = (value: number) => {
    const labels = EMOTION_STEPS.map(step => step.type);
    return labels[Math.round(value) - 1] || '';
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartData = {
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
          type: 'linear' as const,
          min: 0,
          max: 7,
          ticks: {
            stepSize: 1,
            callback: (value: string | number) => {
              const index = Number(value);
              return index >= 0 && index < DAYS_OF_WEEK.length ? DAYS_OF_WEEK[index] : '';
            },
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
        tooltip: {
          callbacks: {
            title: () => '',
            label: (tooltipItem: any) => {
              const dayIndex = Math.floor(tooltipItem.parsed.x);
              const dayName = DAYS_OF_WEEK[dayIndex] || 'Unknown';
              const emotionLabel = valueToLabel(tooltipItem.parsed.y);
              return `${dayName} - ${emotionLabel}`;
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
