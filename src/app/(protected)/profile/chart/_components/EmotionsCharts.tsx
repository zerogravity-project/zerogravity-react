'use client';

import { EmotionChartsHeader } from './header/EmotionChartsHeader';
import { ChartLayout } from './layout/ChartLayout';

export function EmotionsCharts() {
  return (
    <section className="mobile:p-5.5 h-full w-full flex-1 bg-[var(--background-dark)]">
      <div className="flex h-full w-full flex-col">
        <EmotionChartsHeader />
        <ChartLayout />
      </div>
    </section>
  );
}
