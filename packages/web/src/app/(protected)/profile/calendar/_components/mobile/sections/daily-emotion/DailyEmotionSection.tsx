import Link from 'next/link';

import { Badge, Button, Text } from '@radix-ui/themes';
import { useState } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import {
  EMOTION_COLORS,
  EMOTION_STEPS,
  EmotionId,
  EmotionPlanetNull,
  EmotionPlanetScene,
} from '@zerogravity/shared/components/ui/emotion';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { formatDateString } from '@zerogravity/shared/utils';

import { EmotionRecordDetail } from '@/services/emotion/emotion.dto';

import { useCalendar } from '../../../../_contexts/CalendarContext';
import EmotionDetailDrawer from '../../drawers/EmotionDetailDrawer';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DailyEmotionSectionProps {
  emotionRecords?: EmotionRecordDetail;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function DailyEmotionSection({ emotionRecords }: DailyEmotionSectionProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { selectedDate } = useCalendar();
  const { accentColor } = useTheme();

  /**
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const selectedDateString = formatDateString(selectedDate);
  const isEmpty = emotionRecords?.emotionId === undefined;
  const accentEmotionId = EMOTION_COLORS.indexOf(accentColor);
  const emotionId = emotionRecords?.emotionId ?? (accentEmotionId as EmotionId);
  const emotionColor = !isEmpty ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[accentEmotionId].color;

  /**
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <section className="flex w-full flex-col items-center bg-[var(--background-dark)] px-5 pb-9">
      {/* Selected date daily emotion */}

      {isEmpty && (
        <>
          <EmotionPlanetNull emotionId={accentEmotionId} />
          <Link
            href={`/record/daily?date=${selectedDateString}`}
            className="z-1 mt-6 flex w-full flex-col items-center"
          >
            <Button color={emotionColor} variant="solid" size="4" className="!w-full !gap-[6px] !font-normal">
              <Icon size={20}>add</Icon> Add Daily Emotion
            </Button>
          </Link>
        </>
      )}

      {!isEmpty && (
        <>
          <EmotionPlanetScene emotionId={emotionId} />
          <Text color={emotionColor} className="!text-center !text-3xl transition-all duration-400">
            {EMOTION_STEPS[emotionId].type}
          </Text>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {emotionRecords?.reasons?.map(reason => (
              <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
                {reason}
              </Badge>
            ))}
          </div>
          <Button
            color="gray"
            variant="soft"
            size="4"
            className="!mt-6 !w-full !font-normal"
            onClick={() => setIsDrawerOpen(true)}
          >
            See Detail <Icon size={20}>arrow_forward</Icon>
          </Button>
        </>
      )}

      {!isEmpty && (
        <EmotionDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          emotionId={emotionId}
          reasons={emotionRecords?.reasons}
          diaryEntry={emotionRecords?.diaryEntry ?? ''}
        />
      )}
    </section>
  );
}
