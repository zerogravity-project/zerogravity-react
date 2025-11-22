'use client';

import { LayoutGroup } from 'motion/react';
import { useState } from 'react';

import { AiAnalysisDrawer } from './drawers/AiAnalysisDrawer';
import { EmotionChartsHeader } from './header/EmotionChartsHeader';
import { ChartLayout } from './layout/ChartLayout';

export function EmotionsCharts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <LayoutGroup>
      <section className="mobile:p-5.5 h-full w-full flex-1 bg-[var(--background-dark)]">
        <div className="flex h-full w-full flex-col">
          <EmotionChartsHeader setIsDrawerOpen={setIsDrawerOpen} />
          <ChartLayout />
        </div>
      </section>
      <AiAnalysisDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </LayoutGroup>
  );
}
