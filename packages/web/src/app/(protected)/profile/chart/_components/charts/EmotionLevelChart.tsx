'use client';

import type { ActiveElement, ChartEvent, TooltipItem, TooltipModel } from 'chart.js';
import type { EventContext } from 'chartjs-plugin-annotation';
import { useEffect, useMemo, useRef } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import { EMOTION_COLORS_MAP, EMOTION_COLORS_MAP_ALPHA } from '@zerogravity/shared/entities/emotion';

import { useChartLevelQuery } from '@/services/chart/chart.query';

import { Chart } from '../../_config/chartSetup';
import { CHART_GRID_COLOR } from '../../_constants/chart.constants';
import { useChart } from '../../_contexts/ChartContext';
import {
  calculateTooltipLeftPosition,
  createEmotionYScaleConfig,
  formatTooltipDateFromIndex,
  generateEmotionRangeHtml,
  getChartConfig,
  getOrCreateTooltip,
} from '../../_utils/chartUtils';

import { EmotionChartContainer } from './common/EmotionChartContainer';

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
 * Component
 * ============================================
 */

export function EmotionLevelChart() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();
  const { timePeriod, startDate } = useChart();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  /*
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */
  const { data: levelData, isFetching: isLevelFetching } = useChartLevelQuery({ period: timePeriod, startDate });

  /*
   * --------------------------------------------
   * 4. Computed Values
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
  const hasAverage = levelData?.average != null && !isLevelFetching;

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'bar' as const,
          label: 'Emotion Level',
          data: isLevelFetching ? [] : levelData?.data.map(item => item.value) || [],
          backgroundColor: barColor,
          borderColor: barColor,
          borderWidth: 1,
        },
        {
          type: 'line' as const,
          label: '',
          data: isLevelFetching ? [] : levelData?.data.map(item => item.value) || [],
          backgroundColor: lineColor,
          borderColor: lineColor,
          borderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 6,
          spanGaps: true, // Connect data points even with missing values
        },
      ],
    }),
    [labels, levelData, barColor, lineColor, isLevelFetching]
  );

  const chartOptions = useMemo(
    () => ({
      clip: false as const,
      responsive: true,
      maintainAspectRatio: false,
      animations: {
        colors: { duration: 0 }, // Instant color change for average line visibility
      },
      onHover: (event: ChartEvent, elements: ActiveElement[]) => {
        const canvas = event.native?.target as HTMLCanvasElement | undefined;
        if (canvas) {
          // Change cursor for bar or line dataset
          const hasDataPoint = elements.length > 0;
          // Don't reset to default if hovering average line area
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

            // Hide average tooltip and cleanup its handler when bar/point tooltip is shown
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

            // Hide if no tooltip or not line dataset
            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }

            // Show for both bar and line datasets (prioritize line if both hovered)
            if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
              // Prioritize line dataset (index 1) over bar dataset (index 0)
              const linePoint = tooltip.dataPoints.find((dp: TooltipItem<'bar'>) => dp.datasetIndex === 1);
              const dataPoint = linePoint || tooltip.dataPoints[0];

              const index = dataPoint.dataIndex;
              const value = dataPoint.parsed.y;

              // Skip if value is null (shouldn't happen with valid data)
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

              // Position tooltip at data point
              const { offsetLeft: positionX } = chart.canvas;
              const parentRect = parentNode.getBoundingClientRect();
              const tooltipRect = tooltipEl.getBoundingClientRect();
              const yPos = chart.scales.y.getPixelForValue(value);
              const left = calculateTooltipLeftPosition(
                positionX + tooltip.caretX,
                tooltipRect.width,
                parentRect.width
              );

              tooltipEl.style.opacity = '1';
              tooltipEl.style.left = left + 'px';
              tooltipEl.style.top = yPos - 10 + 'px';
              tooltipEl.style.transform = 'translate(-50%, -100%)';
            }
          },
        },
        annotation: {
          annotations: {
            // Visible average line (animates from 0, hidden via opacity when no data)
            averageLine: {
              type: 'line' as const,
              scaleID: 'y',
              value: hasAverage ? (levelData?.average ?? 0) : 0,
              borderColor: hasAverage ? averageLineColor : 'transparent',
              borderWidth: 1,
              borderDash: [5, 5],
              label: {
                display: false,
              },
            },
            // Invisible hover area for average line
            averageHoverArea: {
              type: 'box' as const,
              display: hasAverage,
              yMin: (levelData?.average || 0) - 0.25,
              yMax: (levelData?.average || 0) + 0.25,
              backgroundColor: 'transparent',
              borderWidth: 0,
              enter: (context: EventContext) => {
                const chart = context.chart;
                const parentNode = chart.canvas.parentNode as HTMLElement;
                const average = levelData?.average || 0;

                // Set flag for onHover to know we're in average area
                chart.canvas.dataset.hoveringAverage = 'true';
                chart.canvas.style.cursor = 'pointer';

                // Don't show average tooltip if point tooltip is visible
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

                // Position tooltip: Y fixed at average line, X follows mouse
                const yPos = chart.scales.y.getPixelForValue(average);

                const updateTooltipPosition = (e: MouseEvent) => {
                  const parentRect = parentNode.getBoundingClientRect();
                  const mouseX = e.clientX - parentRect.left;
                  const tooltipRect = tooltipEl.getBoundingClientRect();
                  const left = calculateTooltipLeftPosition(mouseX, tooltipRect.width, parentRect.width);

                  tooltipEl.style.left = left + 'px';
                  tooltipEl.style.top = yPos - 10 + 'px';
                  tooltipEl.style.transform = 'translate(-50%, -100%)';
                  tooltipEl.style.right = 'auto';
                  tooltipEl.style.visibility = 'visible';
                  tooltipEl.style.opacity = '1';
                };

                // Store handler reference for cleanup
                chart.canvas._averageTooltipHandler = updateTooltipPosition;
                chart.canvas.addEventListener('mousemove', updateTooltipPosition);
              },
              leave: (context: EventContext) => {
                const chart = context.chart;
                const parentNode = chart.canvas.parentNode as HTMLElement | null;

                // Remove mousemove handler
                if (chart.canvas._averageTooltipHandler) {
                  chart.canvas.removeEventListener('mousemove', chart.canvas._averageTooltipHandler);
                  delete chart.canvas._averageTooltipHandler;
                }

                // Remove flag and reset cursor
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
   * 6. Effects
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

  /*
   * --------------------------------------------
   * 7. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer title="Emotion Level Chart" className="max-mobile:h-[320px] max-mobile:pb-10">
      <div className="relative h-full min-h-0 w-full min-w-0">
        <canvas ref={chartRef} className="h-full w-full" />
      </div>
    </EmotionChartContainer>
  );
}
