'use client';

import { ScrollArea, Text } from '@radix-ui/themes';
import { m } from 'motion/react';

import { EMOTION_REASONS } from '@zerogravity/shared/entities/emotion';

import { useChartReasonQuery } from '@/services/chart/chart.query';

import { useChart } from '../../_contexts/ChartContext';

import { EmotionChartContainer } from './common/EmotionChartContainer';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface EmotionReasonsChartProps {
  isReady?: boolean;
}

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Default reason data with count '-' */
const DEFAULT_REASON_DATA = EMOTION_REASONS.map(label => ({ label, count: '-' }));

/*
 * ============================================
 * Component
 * ============================================
 */

export function EmotionReasonsChart({ isReady = false }: EmotionReasonsChartProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { timePeriod, startDate } = useChart();

  /*
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const { data: reasonData, isError, refetch } = useChartReasonQuery({ period: timePeriod, startDate });

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */

  /** Use actual data or default (shows '-' counts while loading) */
  const displayData = reasonData?.data ?? DEFAULT_REASON_DATA;

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <EmotionChartContainer
      title="Emotion Reasons"
      className="max-mobile:!min-h-[200px] max-mobile:max-h-[200px]"
      isError={isError}
      onRetry={refetch}
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="h-full min-h-0 overflow-hidden"
      >
        <ScrollArea type="always" scrollbars="vertical" style={{ height: '100%' }}>
          <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 pr-7">
            {displayData.map(reason => (
              <div key={reason.label} className="flex items-center justify-between">
                <Text size="2" weight="light">
                  {reason.label}
                </Text>
                <Text size="2" weight="regular" className="text-[var(--accent-9)]">
                  {reason.count}
                </Text>
              </div>
            ))}
          </div>
        </ScrollArea>
      </m.div>
    </EmotionChartContainer>
  );
}
