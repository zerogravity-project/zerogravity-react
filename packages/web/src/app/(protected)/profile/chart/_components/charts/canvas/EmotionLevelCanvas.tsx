'use client';

import type { ActiveElement, ChartEvent, TooltipItem, TooltipModel } from 'chart.js';
import type { EventContext } from 'chartjs-plugin-annotation';
import { m } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import { EMOTION_COLORS_MAP, EMOTION_COLORS_MAP_ALPHA } from '@zerogravity/shared/entities/emotion';

import type { ChartLevelResponse, ChartPeriod } from '@/services/chart/chart.dto';

import { Chart } from '../../../_config/chartSetup';
import { CHART_GRID_COLOR } from '../../../_constants/chart.constants';
import {
  calculateTooltipLeftPosition,
  createEmotionYScaleConfig,
  formatTooltipDateFromIndex,
  generateEmotionRangeHtml,
  getChartConfig,
  getOrCreateTooltip,
} from '../../../_utils/chartUtils';

/*
 * ============================================
 * Type Extensions
 * ============================================
 */

/** Extend HTMLCanvasElement to include custom tooltip handler */
declare global {
  interface HTMLCanvasElement {
    _averageTooltipHandler?: (e: MouseEvent) => void;
  }
}

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionLevelCanvasProps {
  levelData: ChartLevelResponse;
  timePeriod: ChartPeriod;
  startDate: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function EmotionLevelCanvas({ levelData, timePeriod, startDate }: EmotionLevelCanvasProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();

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
   * 3. Computed Values
   * --------------------------------------------
   */

  /** Chart labels from config (static, without next period label) */
  const labels = useMemo(() => {
    const configLabels = getChartConfig(timePeriod, startDate)?.labels || [];
    // Remove last label (next period: next SUN, next month's 1, next JAN)
    return [...configLabels].slice(0, -1);
  }, [timePeriod, startDate]);

  const barColor = useMemo(
    () => EMOTION_COLORS_MAP_ALPHA[accentColor as keyof typeof EMOTION_COLORS_MAP_ALPHA],
    [accentColor]
  );
  const lineColor = useMemo(() => EMOTION_COLORS_MAP[accentColor as keyof typeof EMOTION_COLORS_MAP], [accentColor]);
  const averageLineColor = '#f59e0b';

  /** Whether we have valid average data to show */
  const hasAverage = levelData.average != null;

  /** Chart data (empty on first render for animation) */
  const chartData = useMemo(
    () => ({
      labels,
      datasets: isInitialized
        ? [
            {
              type: 'bar' as const,
              label: 'Emotion Level',
              data: levelData.data.map(item => item.value) || [],
              backgroundColor: barColor,
              borderColor: barColor,
              borderWidth: 1,
            },
            {
              type: 'line' as const,
              label: '',
              data: levelData.data.map(item => item.value) || [],
              backgroundColor: lineColor,
              borderColor: lineColor,
              borderWidth: 1,
              pointRadius: 3,
              pointHoverRadius: 6,
              spanGaps: true,
            },
          ]
        : [],
    }),
    [labels, levelData, barColor, lineColor, isInitialized]
  );

  const chartOptions = useMemo(
    () => ({
      clip: false as const,
      responsive: true,
      maintainAspectRatio: false,
      animations: {
        colors: { duration: 0 },
      },
      onHover: (event: ChartEvent, elements: ActiveElement[]) => {
        const canvas = event.native?.target as HTMLCanvasElement | undefined;
        if (canvas) {
          const hasDataPoint = elements.length > 0;
          if (hasDataPoint) {
            canvas.style.cursor = 'pointer';
          } else if (!canvas.dataset.hoveringAverage) {
            canvas.style.cursor = 'default';
          }
        }
      },
      scales: {
        x: {
          grid: { color: CHART_GRID_COLOR },
          type: 'category' as const,
          labels: [...labels],
          ticks: { font: { size: 11 } },
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
          external: (context: { chart: Chart; tooltip: TooltipModel<'bar'> }) => {
            const { chart, tooltip } = context;
            const parentNode = chart.canvas.parentNode as HTMLElement;
            const tooltipEl = getOrCreateTooltip(parentNode, 'level-tooltip');

            const averageTooltipEl = parentNode.querySelector<HTMLElement>('.average-tooltip');
            if (averageTooltipEl) {
              averageTooltipEl.style.visibility = 'hidden';
              averageTooltipEl.style.opacity = '0';
            }
            if (chart.canvas._averageTooltipHandler) {
              chart.canvas.removeEventListener('mousemove', chart.canvas._averageTooltipHandler);
              delete chart.canvas._averageTooltipHandler;
            }
            delete chart.canvas.dataset.hoveringAverage;

            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
              const linePoint = tooltip.dataPoints.find((dp: TooltipItem<'bar'>) => dp.datasetIndex === 1);
              const dataPoint = linePoint || tooltip.dataPoints[0];

              const index = dataPoint.dataIndex;
              const value = dataPoint.parsed.y;

              if (value === null) return;

              const dateLabel = formatTooltipDateFromIndex(index, timePeriod, startDate);
              const emotionHtml = generateEmotionRangeHtml(value);

              tooltipEl.innerHTML = `
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px; font-size: 13px;">
                  ${dateLabel}
                </div>
                <div style="font-size: 12px;">
                  ${emotionHtml}
                </div>
              `;

              const { offsetLeft: positionX } = chart.canvas;
              const parentRect = parentNode.getBoundingClientRect();
              const tooltipRect = tooltipEl.getBoundingClientRect();
              const yPos = chart.scales.y.getPixelForValue(value);
              const left = calculateTooltipLeftPosition(
                positionX + tooltip.caretX,
                tooltipRect.width,
                parentRect.width
              );

              // Check if tooltip would overflow top boundary
              const wouldOverflowTop = yPos - tooltipRect.height - 10 < 0;

              tooltipEl.style.opacity = '1';
              tooltipEl.style.left = left + 'px';
              tooltipEl.style.top = yPos + (wouldOverflowTop ? 10 : -10) + 'px';
              tooltipEl.style.transform = wouldOverflowTop ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
            }
          },
        },
        annotation: {
          annotations: {
            averageLine: {
              type: 'line' as const,
              scaleID: 'y',
              value: hasAverage ? (levelData.average ?? 0) : 0,
              borderColor: hasAverage ? averageLineColor : 'transparent',
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                display: false,
              },
            },
            averageHoverArea: {
              type: 'box' as const,
              display: hasAverage,
              yMin: (levelData.average || 0) - 0.25,
              yMax: (levelData.average || 0) + 0.25,
              backgroundColor: 'transparent',
              borderWidth: 0,
              enter: (context: EventContext) => {
                const chart = context.chart;
                const parentNode = chart.canvas.parentNode as HTMLElement;
                const average = levelData.average || 0;

                chart.canvas.dataset.hoveringAverage = 'true';
                chart.canvas.style.cursor = 'pointer';

                const levelTooltipEl = parentNode.querySelector('.level-tooltip') as HTMLElement;
                if (levelTooltipEl?.style.opacity === '1') {
                  return;
                }

                const tooltipEl = getOrCreateTooltip(parentNode, 'average-tooltip');
                const emotionHtml = generateEmotionRangeHtml(average);

                tooltipEl.innerHTML = `
                  <div style="font-weight: 600; color: #fff; margin-bottom: 4px; font-size: 13px;">
                    Average
                  </div>
                  <div style="font-size: 12px;">
                    ${emotionHtml}
                  </div>
                `;

                const yPos = chart.scales.y.getPixelForValue(average);

                const updateTooltipPosition = (e: MouseEvent) => {
                  const parentRect = parentNode.getBoundingClientRect();
                  const mouseX = e.clientX - parentRect.left;
                  const tooltipRect = tooltipEl.getBoundingClientRect();
                  const left = calculateTooltipLeftPosition(mouseX, tooltipRect.width, parentRect.width);

                  // Check if tooltip would overflow top boundary
                  const wouldOverflowTop = yPos - tooltipRect.height - 10 < 0;

                  tooltipEl.style.left = left + 'px';
                  tooltipEl.style.top = yPos + (wouldOverflowTop ? 10 : -10) + 'px';
                  tooltipEl.style.transform = wouldOverflowTop ? 'translate(-50%, 0)' : 'translate(-50%, -100%)';
                  tooltipEl.style.right = 'auto';
                  tooltipEl.style.visibility = 'visible';
                  tooltipEl.style.opacity = '1';
                };

                chart.canvas._averageTooltipHandler = updateTooltipPosition;
                chart.canvas.addEventListener('mousemove', updateTooltipPosition);
              },
              leave: (context: EventContext) => {
                const chart = context.chart;
                const parentNode = chart.canvas.parentNode as HTMLElement | null;

                if (chart.canvas._averageTooltipHandler) {
                  chart.canvas.removeEventListener('mousemove', chart.canvas._averageTooltipHandler);
                  delete chart.canvas._averageTooltipHandler;
                }

                delete chart.canvas.dataset.hoveringAverage;
                chart.canvas.style.cursor = 'default';

                const tooltipEl = parentNode?.querySelector<HTMLElement>('.average-tooltip');
                if (tooltipEl) {
                  tooltipEl.style.visibility = 'hidden';
                  tooltipEl.style.opacity = '0';
                }
              },
            },
          },
        },
      },
    }),
    [labels, levelData, hasAverage, timePeriod, startDate]
  );

  /*
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */

  /** Initialize chart instance once */
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    // Small delay for initial animation
    const timer = setTimeout(() => setIsInitialized(true), 50);

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
   * 5. Return
   * --------------------------------------------
   */
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="h-full w-full"
    >
      <canvas ref={chartRef} role="img" aria-label="Emotion level chart by period" className="h-full w-full" />
    </m.div>
  );
}
