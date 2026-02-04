import { Text } from '@radix-ui/themes';

import type { ChartPeriod } from '@/services/chart/chart.dto';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Period label mapping */
const PERIOD_LABELS: Record<ChartPeriod, string> = {
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
};

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface TitleSectionProps {
  period: ChartPeriod;
  startDateLabel: string;
  endDateLabel: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function TitleSection({ period, startDateLabel, endDateLabel }: TitleSectionProps) {
  /*
   * --------------------------------------------
   * 1. Derived Values
   * --------------------------------------------
   */
  const periodLabel = PERIOD_LABELS[period];

  /*
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <div className="space-y-1 px-4 py-5">
      <div className="flex items-center gap-1.5">
        <Text size="1" className="tracking-wide text-[var(--gray-10)] uppercase">
          {startDateLabel} – {endDateLabel}
        </Text>
      </div>
      <Text size="5" weight="medium">
        {periodLabel} Report
      </Text>
    </div>
  );
}
