'use client';

import { useIsMobile, useIsSm } from '@/app/_hooks/useMediaQuery';

import { EmotionCountChart } from '../charts/EmotionCountChart';
import { EmotionLevelChart } from '../charts/EmotionLevelChart';
import { EmotionReasonsChart } from '../charts/EmotionReasonsChart';

// Mock data for charts
const mockCountData = [
  {
    label: 'Emotion Type',
    data: [3, 2, 6, 1, 5, 2, 0],
    backgroundColor: '#3b82f6',
  },
];

const mockLevelData = [
  {
    label: 'Emotion Level',
    data: [1, 4, 6, 3, 4, 5, 6],
    backgroundColor: '#10b981',
  },
];

export function ChartLayout() {
  const isMobile = useIsMobile();
  const isSm = useIsSm();

  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 w-full min-w-0 flex-shrink-0 flex-col gap-3">
        <EmotionCountChart datasets={mockCountData} />
        <EmotionReasonsChart />
        <EmotionLevelChart datasets={mockLevelData} />
      </div>
    );
  }

  if (isSm) {
    return (
      <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-3 gap-4">
        <EmotionCountChart datasets={mockCountData} />
        <EmotionReasonsChart />
        <EmotionLevelChart datasets={mockLevelData} />
      </div>
    );
  }

  return (
    <div className="grid h-full min-h-0 w-full min-w-0 grid-rows-2 gap-4">
      {/* Emotion Count Chart */}
      <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-3 gap-4">
        <EmotionCountChart datasets={mockCountData} />
        <EmotionReasonsChart />
      </div>

      <EmotionLevelChart datasets={mockLevelData} />
    </div>
  );
}
