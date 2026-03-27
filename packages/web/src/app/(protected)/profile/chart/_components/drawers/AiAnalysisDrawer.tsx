import { format } from 'date-fns';
import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef } from 'react';

import { useIsMobile, useIsXl } from '@zerogravity/shared/hooks';

import { TopAppBar } from '@/app/_components/ui/appbar/TopAppBar';
import { QueryErrorState } from '@/app/_components/ui/error/QueryErrorState';
import { useScroll } from '@/app/_hooks/useScroll';
import { usePeriodAnalysisQuery } from '@/services/ai/ai.query';

import { useChart } from '../../_contexts/ChartContext';

import DrawerHeader from './header/DrawerHeader';
import KeyInsightsSection from './sections/key-insights/KeyInsightsSection';
import RecommendationsSection from './sections/recommendations/RecommendationsSection';
import SummarySection from './sections/summary/SummarySection';
import TitleSection from './sections/title/TitleSection';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface AiAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function AiAnalysisDrawer({ isOpen, onClose }: AiAnalysisDrawerProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /*
   * --------------------------------------------
   * 2. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();
  const isOverLargeScreen = !useIsXl();
  const { timePeriod, startDate } = useChart();

  /*
   * --------------------------------------------
   * 3. Custom Hooks
   * --------------------------------------------
   */
  const { isScrollable, isScrollAtBottom } = useScroll({
    scrollRef,
    enable: isOpen,
    enablePreventBackgroundScroll: isOpen && !isOverLargeScreen,
  });

  /*
   * --------------------------------------------
   * 4. Query Hooks
   * --------------------------------------------
   */
  const {
    data: periodAnalysisData,
    isLoading,
    isError,
    refetch,
  } = usePeriodAnalysisQuery(
    {
      period: timePeriod,
      startDate: startDate,
    },
    isOpen
  );

  /*
   * --------------------------------------------
   * 5. Effects
   * --------------------------------------------
   */
  /** Close drawer on Escape key press */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /*
   * --------------------------------------------
   * 6. Derived Values
   * --------------------------------------------
   */

  /** Animation variants based on screen size */
  const getWrapperAnimation = () => {
    if (isOverLargeScreen) {
      // xl+: Side panel with width animation
      return {
        initial: { width: 0 },
        animate: { width: 400 },
        exit: { width: 0 },
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      };
    }
    // mobile ~ xl: Slide from right
    return {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
      transition: { type: 'spring' as const, damping: 25, stiffness: 180 },
    };
  };

  const getWrapperClassName = () => {
    if (isOverLargeScreen) {
      // xl+: Side panel
      return 'h-full flex-shrink-0 overflow-hidden';
    }
    if (isMobile) {
      // mobile: Full screen
      return 'fixed top-0 right-0 z-9999 h-[100dvh] w-[100dvw]';
    }
    // mobile ~ xl: Slide from right, fixed 400px width, below nav
    return 'fixed top-topnav-height right-0 z-101 h-[calc(100dvh-var(--spacing-topnav-height))] w-[400px] shadow-2xl';
  };

  const wrapperAnimation = getWrapperAnimation();
  const wrapperClassName = getWrapperClassName();

  /** Formatted date range */
  const startDateLabel = periodAnalysisData?.data.startDate
    ? format(new Date(periodAnalysisData.data.startDate), 'MMM d')
    : '—';

  const endDateLabel = periodAnalysisData?.data.endDate
    ? format(new Date(periodAnalysisData.data.endDate), 'MMM d, yyyy')
    : '—';

  /** AI analysis summary data */
  const summary = periodAnalysisData?.data.summary;

  /*
   * --------------------------------------------
   * 7. Return
   * --------------------------------------------
   */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Mobile only */}
          {isMobile && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="fixed inset-0 z-9998 bg-black/50"
            />
          )}

          {/* Drawer */}
          <m.aside
            {...wrapperAnimation}
            className={wrapperClassName}
            role="dialog"
            aria-modal="true"
            aria-label="AI analysis"
          >
            <div
              className={`relative flex h-full flex-col bg-[var(--gray-1)] ${
                isOverLargeScreen
                  ? 'w-[400px] border-l border-[var(--gray-3)]'
                  : isMobile
                    ? 'w-full'
                    : 'w-[400px] border-l border-[var(--gray-3)]'
              }`}
            >
              {/* Header - Fixed */}
              {isMobile ? (
                <TopAppBar text="Go Back" icon="arrow_back" onClick={onClose} border />
              ) : (
                <div className="z-10 flex-shrink-0 border-b border-[var(--gray-3)]">
                  <DrawerHeader onClose={onClose} />
                </div>
              )}

              {/* Scrollable Content */}
              <div
                ref={scrollRef}
                className={`flex min-h-0 flex-1 flex-col overflow-y-auto ${isMobile && 'hide-scrollbar'}`}
              >
                {/* Title - Always visible */}
                <TitleSection
                  period={timePeriod}
                  startDateLabel={startDateLabel}
                  endDateLabel={endDateLabel}
                  isLoading={isLoading}
                />

                {/* Error state */}
                {!isLoading && isError && <QueryErrorState onRetry={refetch} />}

                {/* Sections - Pass isLoading for internal skeleton handling */}
                {!isError && (
                  <>
                    <SummarySection overview={summary?.overview} isLoading={isLoading} />
                    <KeyInsightsSection insights={summary?.keyInsights} isLoading={isLoading} />
                    <RecommendationsSection recommendations={summary?.recommendations} isLoading={isLoading} />
                  </>
                )}

                {/* Gradient - Only show if content is scrollable and not at bottom */}
                {isScrollable && !isScrollAtBottom && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="pointer-events-none absolute bottom-0 left-0 z-9 h-20 w-full bg-gradient-to-t from-[var(--gray-1)] to-transparent"
                  />
                )}
              </div>
            </div>
          </m.aside>
        </>
      )}
    </AnimatePresence>
  );
}
