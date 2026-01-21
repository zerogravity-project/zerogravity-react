'use client';

import type { ActiveElement, ChartEvent, TooltipModel } from 'chart.js';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  EMOTION_COLORS,
  EMOTION_COLORS_MAP,
  EMOTION_TYPES,
  type EmotionId,
  type EmotionType,
} from '@zerogravity/shared/entities/emotion';

import type { ChartCountData, ChartPeriod } from '@/services/chart/chart.dto';

import { Chart } from '../../../_config/chartSetup';
import { CHART_GRID_COLOR } from '../../../_constants/chart.constants';
import {
  calculateTooltipLeftPosition,
  createEmotionYScaleConfig,
  formatTooltipDate,
  getChartConfig,
  getOrCreateTooltip,
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
   * 1. States
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
      };
    });
  }, [countData]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full w-full"
    >
      <canvas ref={chartRef} className="h-full w-full" />
    </motion.div>
  );
}
