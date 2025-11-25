import { Heading, Spinner, Text } from '@radix-ui/themes';

import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';

/**
 * ============================================
 * Component
 * ============================================
 */

export default function AiPredictionLoading() {
  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        AI is analyzing your emotions...
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        This may take a few moments.
      </Text>

      {/* Loading Animation */}
      <div className="flex h-full min-h-[300px] w-full flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <GeminiLogo width={48} className="animate-pulse" />
          <Spinner size="3" />
        </div>
        <Text color="gray" className="text-center text-sm font-light">
          Analyzing your diary entry with Gemini AI
        </Text>
      </div>
    </>
  );
}
