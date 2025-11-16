import { Badge, Text, Theme } from '@radix-ui/themes';

import { useTheme } from '@zerogravity/shared/components/providers';
import {
  EMOTION_COLORS,
  EMOTION_STEPS,
  EmotionId,
  EmotionPlanetNull,
  EmotionPlanetScene,
  EmotionReason,
} from '@zerogravity/shared/components/ui/emotion';
import { cn } from '@zerogravity/shared/utils';

interface DailyEmotionSectionProps {
  emotionId?: EmotionId;
  emotionReasons?: EmotionReason[];
}

export default function DailyEmotionSection({ emotionId, emotionReasons }: DailyEmotionSectionProps) {
  const { accentColor } = useTheme();

  const isEmpty = emotionId === undefined;
  const accentEmotionId = EMOTION_COLORS.indexOf(accentColor);
  const emotionColor = !isEmpty ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[accentEmotionId].color;

  return (
    <Theme appearance="dark">
      <section
        className={cn(
          'flex w-full flex-col items-center bg-[var(--background-dark)] px-5 pt-1',
          !isEmpty ? 'pb-7' : 'pb-1'
        )}
      >
        {/* Selected date daily emotion */}
        {isEmpty && (
          <>
            <EmotionPlanetNull emotionId={accentEmotionId} width={240} height={240} isShowText={false} />
          </>
        )}

        {!isEmpty && (
          <>
            <EmotionPlanetScene emotionId={emotionId} width={240} height={240} isLoadingShowText={false} delay={500} />
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
