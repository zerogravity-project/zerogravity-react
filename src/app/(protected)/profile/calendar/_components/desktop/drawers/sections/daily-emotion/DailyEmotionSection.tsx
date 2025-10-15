import { Badge, Text } from '@radix-ui/themes';
import { useMemo, useState } from 'react';

import { EmotionPlanetScene } from '@/app/_components/ui/emotion';
import { EMOTION_STEPS } from '@/app/_components/ui/emotion/Emotion.type';
import EmotionPlanetNull from '@/app/_components/ui/emotion/EmotionPlanetNull';

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
    <section className="flex w-full flex-col items-center bg-[var(--background-dark)] px-5 pt-5 pb-6">
      {/* Selected date daily emotion */}

      {!emotionId && (
        <>
          <EmotionPlanetNull emotionId={randomEmotionId} width={130} height={130} isShowText={false} />
        </>
      )}

      {emotionId && (
        <>
          <EmotionPlanetScene emotionId={emotionId} width="100%" height={130} isLoadingShowText={false} />
          <Text color={emotionColor} size="5">
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
  );
}
