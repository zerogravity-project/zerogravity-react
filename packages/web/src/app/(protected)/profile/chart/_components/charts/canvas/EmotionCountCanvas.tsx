'use client';

import type { ActiveElement, ChartEvent, TooltipModel } from 'chart.js';
import { m } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  EMOTION_COLORS,
  EMOTION_COLORS_MAP,
  EMOTION_TYPES,
  type EmotionId,
  type EmotionType,
} from '@zerogravity/shared/entities/emotion';
import { useIsLg } from '@zerogravity/shared/hooks';

import type { ChartCountData, ChartPeriod } from '@/services/chart/chart.dto';

import { Chart } from '../../../_config/chartSetup';
import { CHART_GRID_COLOR } from '../../../_constants/chart.constants';
import {
  calculateTooltipLeftPosition,
  createEmotionYScaleConfig,
  formatTooltipDate,
  getChartConfig,
  getOrCreateTooltip,
  removeTooltip,
} from '../../../_utils/chartUtils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionCountCanvasProps {
  countData: ChartCountData[];
  timePeriod: ChartPeriod;
  startDate: string;
  onReady?: () => void;
}

/** Raw data point structure for scatter chart */
interface EmotionCountDataPoint {
  x: number;
  y: EmotionId;
  timestamp: string;
  emotionType: EmotionType;
  daily: number;
  moment: number;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionCountCanvas({ countData, timePeriod, startDate, onReady }: EmotionCountCanvasProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isTouch = useIsLg();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /*
   * --------------------------------------------
   * 2. Computed Values
   * --------------------------------------------
   */

  /** Group data by emotionId for chart datasets */
  const chartDatasets = useMemo(() => {
    const groupedByEmotionId = countData.reduce(
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
        pointHitRadius: isTouch ? 15 : 5,
      };
    });
  }, [countData, isTouch]);

  /** Chart data configuration (empty on first render for animation) */
  const chartData = useMemo(
    () => ({
      datasets: isInitialized ? chartDatasets : [],
    }),
    [chartDatasets, isInitialized]
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
            const tooltipEl = getOrCreateTooltip('count-tooltip');

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

              const canvasRect = chart.canvas.getBoundingClientRect();
              const tooltipRect = tooltipEl.getBoundingClientRect();
              const left = calculateTooltipLeftPosition(
                canvasRect.left + tooltip.caretX,
                tooltipRect.width,
                canvasRect.left,
                canvasRect.right
              );
              const top = canvasRect.top + tooltip.caretY;

              // Determine tooltip placement: prefer above, fallback below, then wider side
              const spaceAbove = top - canvasRect.top;
              const spaceBelow = canvasRect.bottom - top;
              const tooltipH = tooltipRect.height + 10;
              const showBelow =
                spaceAbove >= tooltipH ? false : spaceBelow >= tooltipH ? true : spaceAbove < spaceBelow;

              tooltipEl.style.opacity = '1';
              tooltipEl.style.left = left + 'px';
              tooltipEl.style.top = top + (showBelow ? 10 : -10) + 'px';
              tooltipEl.style.transform = showBelow ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
            }
          },
        },
      },
    }),
    [timePeriod, startDate]
  );

  /*
   * --------------------------------------------
   * 3. Effects
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

    // Small delay for initial animation
    const timer = setTimeout(() => {
      setIsInitialized(true);
      onReady?.();
    }, 50);

    return () => {
      clearTimeout(timer);
      removeTooltip('count-tooltip');
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

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full w-full"
    >
      <canvas ref={chartRef} role="img" aria-label="Emotion record count chart by period" className="h-full w-full" />
    </m.div>
  );
}
