'use client';

import { Heading, Text, TextArea } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Icon } from '@zerogravity/shared/components/ui/icon';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { AiConsentModal } from '@/app/_components/ui/modal/AiConsentModal';

import { useEmotionRecordContext } from '../../../../_contexts/EmotionRecordContext';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface AiPredictionInputProps {
  predictEmotion: (params: { diaryEntry: string }) => void;
  aiPredictionEntry: string;
  setAiPredictionEntry: (value: string) => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function AiPredictionInput({
  predictEmotion,
  aiPredictionEntry,
  setAiPredictionEntry,
}: AiPredictionInputProps) {
  /*
   * ------------------------------------------------------------
   * 1. External Hooks
   * ------------------------------------------------------------
   */
  const { data: session } = useSession();
  const { openComponentModal } = useModal();
  const { prevStep } = useEmotionRecordContext();

  /*
   * ------------------------------------------------------------
   * 2. Refs
   * ------------------------------------------------------------
   */
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * ------------------------------------------------------------
   * 3. States
   * ------------------------------------------------------------
   */
  const [isFocused, setIsFocused] = useState(false);

  /*
   * ------------------------------------------------------------
   * 4. Derived Values
   * ------------------------------------------------------------
   */
  const consents = session?.user?.consents;
  const isValid = aiPredictionEntry?.length >= 100 && aiPredictionEntry?.length <= 300;
  const showError = aiPredictionEntry?.length > 0 && !isValid && isFocused;

  /*
   * ------------------------------------------------------------
   * 5. Callbacks
   * ------------------------------------------------------------
   */

  /** Handle textarea input change */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.slice(0, 300);
      setAiPredictionEntry(value);
    },
    [setAiPredictionEntry]
  );

  /** Submit diary entry for AI analysis */
  const handleSubmit = useCallback(() => {
    // Validate diary entry
    if (!aiPredictionEntry || !isValid) {
      return;
    }

    // Show AI consent modal if user has not consented to AI analysis
    if (!consents?.aiAnalysisConsent) {
      openComponentModal({
        component: <AiConsentModal onAgree={() => predictEmotion({ diaryEntry: aiPredictionEntry })} />,
      });
      return;
    }

    predictEmotion({ diaryEntry: aiPredictionEntry });
  }, [aiPredictionEntry, isValid, predictEmotion, openComponentModal, consents?.aiAnalysisConsent]);

  /*
   * ------------------------------------------------------------
   * 6. Effects
   * ------------------------------------------------------------
   */

  /** Focus textarea on mount */
  useEffect(() => {
    const textarea = containerRef.current?.querySelector('textarea');
    textarea?.focus();
  }, []);

  /*
   * ------------------------------------------------------------
   * 7. Return
   * ------------------------------------------------------------
   */
  return (
    <>
      {/* Title */}
      <Heading as="h1" className="mobile:!text-xl !text-center !text-lg !font-light">
        AI Prediction
      </Heading>
      <Text color="gray" className="mobile:text-base text-center text-sm font-light">
        We&apos;ll use AI to predict your emotion and reason.
      </Text>

      {/* Input Area */}
      <div className="mobile:pb-12 max-mobile:px-2 flex h-full w-full max-w-[480px] flex-1 flex-col gap-3 pt-10 pb-3">
        <div ref={containerRef} className="relative h-full min-h-[150px] w-full">
          <TextArea
            value={aiPredictionEntry}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            placeholder="What made you feel this way? What happened today?"
            size="3"
            radius="full"
            className="!h-full !w-full !shadow-none [&_textarea]:!px-5 [&_textarea]:!py-3.5"
            color={showError ? 'red' : undefined}
            aria-required="true"
            aria-describedby="ai-input-hint"
            aria-invalid={showError}
          />

          {showError && (
            <Text id="ai-input-hint" color="red" size="1" className="absolute bottom-4.5 left-5 pr-[100px]">
              &#8251; Text has to be between 100 and 300 characters
            </Text>
          )}
          <Text color={showError ? 'red' : 'gray'} className="absolute right-5 bottom-3.5 whitespace-nowrap">
            {aiPredictionEntry?.length ?? 0} / 300
          </Text>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mobile:pb-20 flex w-full max-w-[480px] gap-3">
        <MotionButton
          onClick={prevStep}
          variant="surface"
          className="mobile:!rounded-[9999px] max-mobile:!hidden !w-12"
          size="4"
          radius="none"
          aria-label="Go to previous step"
        >
          <Icon>arrow_back</Icon>
        </MotionButton>
        <div className="w-full">
          <MotionButton
            className="mobile:!rounded-[9999px] max-mobile:!h-14 !w-full"
            size="4"
            radius="none"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            Analyze with AI
            <Icon>auto_awesome</Icon>
          </MotionButton>
        </div>
      </div>
    </>
  );
}
