'use client';

import { useIsMobile, useIsSm } from '@zerogravity/shared/hooks';

import { EmotionCountChart } from '../charts/EmotionCountChart';
import { EmotionLevelChart } from '../charts/EmotionLevelChart';
import { EmotionReasonsChart } from '../charts/EmotionReasonsChart';

// Mock data for charts - Week view
const mockCountData = [
  {
    label: 'Emotion Count',
    data: [
      { x: 0.5, y: 3 }, // Mon 12:00
      { x: 0.78, y: 5 }, // Mon 18:45
      { x: 1.38, y: 2 }, // Tue 09:00
      { x: 2.25, y: 4 }, // Wed 06:00
      { x: 3.5, y: 6 }, // Thu 12:00
      { x: 4.1, y: 3 }, // Fri 02:24
      { x: 5.67, y: 5 }, // Sat 16:00
      { x: 6.25, y: 4 }, // Sun 06:00
    ],
    backgroundColor: '#8E4EC6',
  },
];

const mockLevelData = [
  {
    label: 'Emotion Level',
    data: [2.5, 3.8, 4.2, 3.5, 4.8, 3.2, 4.5],
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
