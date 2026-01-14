'use client';

import type { ActiveElement, ChartEvent, TooltipModel } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { useEffect, useMemo, useRef } from 'react';

import {
  EMOTION_COLORS,
  EMOTION_COLORS_MAP,
  EMOTION_TYPES,
  type EmotionId,
  type EmotionType,
} from '@zerogravity/shared/entities/emotion';

import { useChartCountQuery } from '@/services/chart/chart.query';

import { CHART_GRID_COLOR } from '../../_constants/chart.constants';
import { useChart } from '../../_contexts/ChartContext';
import {
  calculateTooltipLeftPosition,
  createEmotionYScaleConfig,
  formatTooltipDate,
  getChartConfig,
  getOrCreateTooltip,
} from '../../_utils/chartUtils';

import { EmotionChartContainer } from './common/EmotionChartContainer';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

/** Raw data point structure for scatter chart */
interface EmotionCountDataPoint {
  x: number;
  y: EmotionId;
  timestamp: string;
  emotionType: EmotionType;
  daily: number;
  moment: number;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function EmotionCountChart() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { timePeriod, startDate } = useChart();

  /**
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  /**
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */
  const { data: countData, isFetching: isCountFetching } = useChartCountQuery({ period: timePeriod, startDate });

  /**
   * --------------------------------------------
   * 4. Computed Values
   * --------------------------------------------
   */

  /** Group data by emotionId for chart datasets (empty when fetching) */
  const chartDatasets = useMemo(() => {
    if (isCountFetching || !countData?.data) return [];

    const groupedByEmotionId = countData.data.reduce(
      (acc, item) => {
        const emotionId = item.emotionId;
        if (!acc[emotionId]) {
          acc[emotionId] = [];
        }
        acc[emotionId].push({
          x: item.position,
          y: item.emotionId,
          timestamp: item.timestamp,
          emotionType: item.emotionType,
          daily: item.daily,
          moment: item.moment,
        });
        return acc;
      },
      {} as Record<EmotionId, EmotionCountDataPoint[]>
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
  }, [countData, isCountFetching]);

  /** Chart data configuration */
  const chartData = useMemo(
    () => ({
      datasets: chartDatasets,
    }),
    [chartDatasets]
  );

  /** Chart options configuration */
  const chartOptions = useMemo(
    () => ({
      clip: false as const,
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event: ChartEvent, elements: ActiveElement[]) => {
        const canvas = event.native?.target as HTMLCanvasElement | undefined;
        if (canvas) {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      },
      scales: {
        x: {
          grid: { color: CHART_GRID_COLOR },
          type: 'linear' as const,
          min: 0,
          max: getChartConfig(timePeriod, startDate)?.max || 0,
          ticks: {
            stepSize: 1,
            callback: (value: string | number) => {
              const index = Number(value);
              const config = getChartConfig(timePeriod, startDate);
              return index >= 0 && index <= (config?.max || 0) ? config?.labels[index] || '' : '';
            },
            font: { size: 11 },
          },
        },
        y: createEmotionYScaleConfig(),
      },
      plugins: {
        legend: {
          display: false,
          position: 'bottom' as const,
        },
        tooltip: {
          enabled: false,
          external: (context: { chart: Chart; tooltip: TooltipModel<'scatter'> }) => {
            const { chart, tooltip } = context;
            const parentNode = chart.canvas.parentNode as HTMLElement;
            const tooltipEl = getOrCreateTooltip(parentNode, 'count-tooltip');

            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
              const dataPoint = tooltip.dataPoints[0];
              const rawData = dataPoint.raw as EmotionCountDataPoint;

              const emotionId = rawData.y;
              const colorKey = EMOTION_COLORS[emotionId];
              const emotionColor = EMOTION_COLORS_MAP[colorKey as keyof typeof EMOTION_COLORS_MAP];
              const dateStr = formatTooltipDate(rawData.timestamp, timePeriod);

              tooltipEl.innerHTML = `
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px; font-size: 13px;">
                  ${dateStr}
                </div>
                <div style="color: ${emotionColor}; margin-bottom: 4px; font-size: 12px;">
                  ${rawData.emotionType}
                </div>
                <div style="color: #aaa; font-size: 11px;">
                  Daily <span style="font-weight: 600; color: #fff;">${rawData.daily}</span> / Moment <span style="font-weight: 600; color: #fff;">${rawData.moment}</span>
                </div>
              `;

              const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
              const parentRect = parentNode.getBoundingClientRect();
              const tooltipRect = tooltipEl.getBoundingClientRect();
              const left = calculateTooltipLeftPosition(
                positionX + tooltip.caretX,
                tooltipRect.width,
                parentRect.width
              );

              tooltipEl.style.opacity = '1';
              tooltipEl.style.left = left + 'px';
              tooltipEl.style.top = positionY + tooltip.caretY - 10 + 'px';
              tooltipEl.style.transform = 'translate(-50%, -100%)';
            }
          },
        },
      },
    }),
    [timePeriod, startDate]
  );

  /**
   * --------------------------------------------
   * 6. Effects
   * --------------------------------------------
   */

  /** Initialize chart instance once */
  useEffect(() => {
    if (!chartRef.current) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Update chart data and options (with animation) */
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    chartInstanceRef.current.data = chartData;
    chartInstanceRef.current.options = chartOptions;
    chartInstanceRef.current.update();
  }, [chartData, chartOptions]);

  /**
   * --------------------------------------------
   * 7. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer title="Emotion Count Chart" className="max-mobile:h-[320px] sm:col-span-2">
      <div className="relative h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
