import { Button } from '@radix-ui/themes';

import { EMOTION_COLORS, EMOTION_REASONS, type EmotionReason } from '@zerogravity/shared/entities/emotion';

import { useEmotionRecordContext } from '../../../_contexts/EmotionRecordContext';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function ReasonSelection() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const {
    emotionValueToStepIndex,
    emotionReasons: emotionReason,
    setEmotionReasons: setEmotionReason,
  } = useEmotionRecordContext();

  /*
   * --------------------------------------------
   * 2. Event Handlers
   * --------------------------------------------
   */
  /** Toggle reason selection */
  const toggleReason = (reason: EmotionReason) => {
    if (emotionReason.includes(reason)) {
      setEmotionReason(emotionReason.filter(r => r !== reason));
    } else {
      setEmotionReason([...emotionReason, reason]);
    }
  };

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="max-mobile:px-5 flex w-full flex-1 flex-col items-center pt-10 pb-12">
      <div
        role="group"
        aria-label="Select reasons for your emotion (required)"
        className="flex w-full max-w-[480px] flex-wrap gap-3"
      >
        {EMOTION_REASONS.map(reason => (
          <Button
            key={reason}
            onClick={() => toggleReason(reason)}
            color={EMOTION_COLORS[emotionValueToStepIndex]}
            variant={emotionReason.includes(reason) ? 'solid' : 'soft'}
            size="2"
            radius="full"
            className="!w-fit"
            aria-pressed={emotionReason.includes(reason)}
          >
            {reason}
          </Button>
        ))}
      </div>
    </div>
  );
}
