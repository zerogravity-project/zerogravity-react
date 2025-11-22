import { Blockquote, Text } from '@radix-ui/themes';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { useRef } from 'react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { useIsLg } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

import { useChart } from '../../_contexts/ChartContext';

import { useScroll } from '@/app/_hooks/useScroll';
import { usePeriodAnalysisQuery } from '@/services/ai/ai.query';

interface AiAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Parse markdown bold syntax (**text**) into React elements
 * @param text - Text that may contain **bold** markdown syntax
 * @returns Array of React elements (strings and strong elements)
 */
function parseBoldMarkdown(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add the bold text
    parts.push(
      <strong key={key++} className="font-semibold">
        {match[1]}
      </strong>
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no matches found, return the original text
  return parts.length > 0 ? parts : [text];
}

export function AiAnalysisDrawer({ isOpen, onClose }: AiAnalysisDrawerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOverLargeScreen = !useIsLg();
  const { isScrollable, isScrolling, isScrollAtBottom } = useScroll({
    scrollRef,
    enable: isOpen,
    enablePreventBackgroundScroll: isOpen && !isOverLargeScreen,
  });

  const { timePeriod, startDate } = useChart();

  const { data: periodAnalysisData } = usePeriodAnalysisQuery(
    {
      period: timePeriod,
      startDate: startDate,
    },
    isOpen
  );

  // Animation variants based on screen size
  const wrapperAnimation = isOverLargeScreen
    ? {
        initial: { width: 0 },
        animate: { width: 360 },
        exit: { width: 0 },
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'spring' as const, damping: 25, stiffness: 180 },
      };

  const wrapperClassName = isOverLargeScreen
    ? 'h-full flex-shrink-0 overflow-hidden'
    : 'top-topnav-height fixed right-0 z-100 h-[calc(100dvh-var(--spacing-topnav-height))] shadow-2xl';

  const startDateLabel = periodAnalysisData?.data.startDate
    ? format(new Date(periodAnalysisData.data.startDate), 'MMM d')
    : '—';

  const endDateLabel = periodAnalysisData?.data.endDate
    ? format(new Date(periodAnalysisData.data.endDate), 'MMM d, yyyy')
    : '—';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          layout={isOverLargeScreen}
          {...wrapperAnimation}
          className={wrapperClassName}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex h-full w-[360px] flex-col border-l border-[var(--gray-3)] bg-[var(--gray-1)]">
            {/* Header - Fixed */}
            <div className={cn('z-10 flex-shrink-0', isScrolling && 'border-b border-[var(--gray-3)]')}>
              <header className="relative flex w-full items-center p-4">
                <Text size="3">
                  {startDateLabel} - {endDateLabel}
                </Text>

                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="absolute right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[var(--gray-a3)]"
                >
                  <Icon size={20}>close</Icon>
                </button>
              </header>
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto pb-5">
              <div className="flex flex-col gap-6 p-4">
                <Blockquote size="2">{periodAnalysisData?.data.summary.overview}</Blockquote>
                <ul className="flex list-disc flex-col gap-2 pl-4 text-sm">
                  {periodAnalysisData?.data.summary.keyInsights.map((insight, index) => (
                    <li key={`insight-${index}`}>{parseBoldMarkdown(insight)}</li>
                  ))}
                </ul>
                <ul className="flex list-disc flex-col gap-2 pl-4 text-sm">
                  {periodAnalysisData?.data.summary.recommendations.map((recommendation, index) => (
                    <li key={`recommendation-${index}`}>{parseBoldMarkdown(recommendation)}</li>
                  ))}
                </ul>
              </div>

              {/* Gradient - Only show if content is scrollable and not at bottom */}
              {isScrollable && !isScrollAtBottom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 z-9 h-20 w-full bg-gradient-to-t from-[var(--black-a9)] to-transparent"
                />
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
