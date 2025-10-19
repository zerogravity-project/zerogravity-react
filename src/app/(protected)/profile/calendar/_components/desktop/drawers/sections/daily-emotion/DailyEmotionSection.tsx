import { Badge, Text, Theme } from '@radix-ui/themes';
import { useMemo, useState } from 'react';

import { EmotionPlanetScene } from '@/app/_components/ui/emotion';
import { EMOTION_STEPS } from '@/app/_components/ui/emotion/_constants/emotion.constants';
import EmotionPlanetNull from '@/app/_components/ui/emotion/EmotionPlanetNull';
import { cn } from '@/app/_utils/styleUtils';

import EmotionDetailDrawer from '../../EmotionDetailDrawer';

const REASON_LISTS = ['Health', 'Fitness', 'Self-care', 'Hobby', 'Identity', 'Religion'];

export default function DailyEmotionSection() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const randomEmotionId = useMemo(() => {
    return Math.floor(Math.random() * 7);
  }, []);

  const emotionId = useMemo(() => {
    return Math.random() > 0.1 ? Math.floor(Math.random() * 7) : null;
  }, []);

  const emotionColor = emotionId ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[randomEmotionId].color;

  return (
    <Theme appearance="dark">
      <section
        className={cn(
          'flex w-full flex-col items-center bg-[var(--background-dark)] px-5 pt-1',
          emotionId ? 'pb-7' : 'pb-1'
        )}
      >
        {/* Selected date daily emotion */}
        {!emotionId && (
          <>
            <EmotionPlanetNull emotionId={randomEmotionId} width={240} height={240} isShowText={false} />
          </>
        )}

        {emotionId && (
          <>
            <EmotionPlanetScene emotionId={emotionId} width={240} height={240} isLoadingShowText={false} delay={500} />
            <Text color={emotionColor} size="7" weight="regular">
              {EMOTION_STEPS[emotionId].type}
            </Text>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {REASON_LISTS.map(reason => (
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

        <EmotionDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </section>
    </Theme>
  );
}
