'use client';

import { useEffect, useState } from 'react';

const VISIT_COUNT_KEY = 'spaceout_visit_count';
const MAX_ONBOARDING_VISITS = 3;

export function useSpaceoutVisit() {
  const [visitCount, setVisitCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current visit count from localStorage
    const storedCount = localStorage.getItem(VISIT_COUNT_KEY);
    const currentCount = storedCount ? parseInt(storedCount, 10) : 0;

    // Increment and store
    const newCount = currentCount + 1;
    localStorage.setItem(VISIT_COUNT_KEY, newCount.toString());

    setVisitCount(newCount);
    setIsLoading(false);
  }, []);

  const shouldShowOnboarding = visitCount < MAX_ONBOARDING_VISITS;

  return {
    visitCount,
    shouldShowOnboarding,
    isLoading,
  };
}
