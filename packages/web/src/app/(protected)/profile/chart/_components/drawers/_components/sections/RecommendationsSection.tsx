import { Skeleton, Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';

import { parseBoldMarkdown } from '../../_utils/markdownUtils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface RecommendationsSectionProps {
  recommendations?: string[];
  isLoading?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function RecommendationsSection({ recommendations, isLoading }: RecommendationsSectionProps) {
  return (
    <section className="w-full">
      <div className="overflow-hidden">
        {/* Header - Green background */}
        <div className="flex items-center gap-2.5 border-t border-b border-[var(--green-4)] bg-[var(--green-3)] px-4 py-[5px]">
          <Icon size={14} className="text-[var(--green-9)]">
            lightbulb
          </Icon>
          <Text size="2" weight="medium" className="!text-[13px] !leading-[17px] text-[var(--green-10)]">
            Recommendations
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
                      <Skeleton height="13px" width="75%" />
                    </div>
                  </div>
                  {i !== 2 && <div className="my-4 h-px bg-[var(--gray-4)]" />}
                </div>
              ))
            : recommendations?.map((recommendation, index) => (
                <div key={`recommendation-${index}`}>
                  <div className="flex items-start gap-3 px-1">
                    <Icon size={18} className="mt-0.5 flex-shrink-0 text-[var(--green-9)]">
                      check_box
                    </Icon>
                    <Text size="2" weight="light" className="!text-[13px] leading-relaxed">
                      {parseBoldMarkdown(recommendation)}
                    </Text>
                  </div>
                  {index !== recommendations.length - 1 && <div className="my-4 h-px bg-[var(--gray-4)]" />}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
