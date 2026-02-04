import { Skeleton, Text } from '@radix-ui/themes';

import { parseBoldMarkdown } from '../../_utils/markdownUtils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface KeyInsightsSectionProps {
  insights?: string[];
  isLoading?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function KeyInsightsSection({ insights, isLoading }: KeyInsightsSectionProps) {
  return (
    <section className="w-full">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-t border-b border-[var(--gray-3)] bg-[var(--gray-2)] px-4 py-[5px]">
          <Text size="2" weight="medium" className="!text-[13px] !leading-[17px] text-[var(--gray-12)]">
            Key Insights
          </Text>
        </div>

        {/* Content */}
        <div className="flex flex-col px-4 pt-5 pb-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 px-1">
                    <Skeleton height="16px" width="16px" className="flex-shrink-0" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton height="13px" width="100%" />
                      <Skeleton height="13px" width="100%" />
                      <Skeleton height="13px" width="80%" />
                    </div>
                  </div>
                  {i !== 2 && <div className="my-4 h-px bg-[var(--gray-4)]" />}
                </div>
              ))
            : insights?.map((insight, index) => (
                <div key={`insight-${index}`}>
                  <div className="flex items-start gap-3 px-1">
                    <Text size="2" className="leading-relaxed text-[var(--accent-9)]">
                      {index + 1}.
                    </Text>
                    <Text size="2" weight="light" className="!text-[13px] leading-relaxed">
                      {parseBoldMarkdown(insight)}
                    </Text>
                  </div>
                  {index !== insights.length - 1 && <div className="my-4 h-px bg-[var(--gray-4)]" />}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
