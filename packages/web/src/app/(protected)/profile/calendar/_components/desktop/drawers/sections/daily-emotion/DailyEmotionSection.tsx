import { Badge, Text, Theme } from '@radix-ui/themes';

import { useTheme } from '@zerogravity/shared/components/providers';
import { EmotionPlanetNull } from '@zerogravity/shared/components/ui/emotion/null';
import { LazyEmotionPlanetScene } from '@zerogravity/shared/components/ui/emotion/scene-lazy';
import {
  EMOTION_COLORS,
  EMOTION_STEPS,
  type EmotionId,
  type EmotionReason,
} from '@zerogravity/shared/entities/emotion';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DailyEmotionSectionProps {
  emotionId?: EmotionId;
  emotionReasons?: EmotionReason[];
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DailyEmotionSection({ emotionId, emotionReasons }: DailyEmotionSectionProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const isEmpty = emotionId === undefined;
  const accentEmotionId = EMOTION_COLORS.indexOf(accentColor);
  const emotionColor = !isEmpty ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[accentEmotionId].color;

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <Theme appearance="dark">
      <section
        className={cn(
          'flex w-full flex-col items-center bg-[var(--background-dark)] px-5 pt-1',
          !isEmpty ? 'pb-7' : 'pb-1'
        )}
      >
        {/* Empty state */}
        {isEmpty && <EmotionPlanetNull emotionId={accentEmotionId} width={240} height={240} isShowText={false} />}

        {/* Data state */}
        {!isEmpty && (
          <>
            <LazyEmotionPlanetScene
              emotionId={emotionId}
              width={240}
              height={240}
              isLoadingShowText={false}
              delay={500}
            />
            <Text color={emotionColor} size="7" weight="regular">
              {EMOTION_STEPS[emotionId].type}
            </Text>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {emotionReasons?.map((reason: EmotionReason) => (
                <Badge
                  key={reason}
                  color="gray"
                  radius="full"
                  variant="soft"
                  className="!text-[11px] !leading-[14px] !font-normal"
                >
                  {reason}
                </Badge>
              ))}
            </div>
          </>
        )}
      </section>
    </Theme>
  );
}
