import { Blockquote, Skeleton, Text } from '@radix-ui/themes';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface SummarySectionProps {
  overview?: string;
  isLoading?: boolean;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function SummarySection({ overview, isLoading }: SummarySectionProps) {
  return (
    <section className="w-full">
      <div className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 border-t border-b border-[var(--gray-3)] bg-[var(--gray-2)] px-4 py-[5px]">
          <Text size="2" weight="medium" className="!text-[13px] !leading-[17px] text-[var(--gray-12)]">
            Summary
          </Text>
        </div>

        {/* Content */}
        <div className="bg-[var(--background-dark)] px-4 pt-5 pb-6">
          {isLoading ? (
            <Blockquote color="gray">
              <div className="flex flex-col gap-2">
                <Skeleton height="13px" width="100%" />
                <Skeleton height="13px" width="100%" />
                <Skeleton height="13px" width="100%" />
                <Skeleton height="13px" width="75%" />
              </div>
            </Blockquote>
          ) : (
            <Text size="2" className="!text-[13px] !leading-[17px]">
              <Blockquote>{overview}</Blockquote>
            </Text>
          )}
        </div>
      </div>
    </section>
  );
}
