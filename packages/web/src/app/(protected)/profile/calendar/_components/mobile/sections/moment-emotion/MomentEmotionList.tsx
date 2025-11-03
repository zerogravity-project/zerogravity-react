'use client';

import { Badge, Text } from '@radix-ui/themes';
import { useMemo } from 'react';

import { EMOTION_STEPS } from '@zerogravity/shared/components/ui/emotion';

import { EmotionPlanetImage } from '@/app/_components/ui/emotion/EmotionPlanetImage';

import { formatTime } from '../../../../_utils/dateUtils';

const REASON_LISTS = ['Health', 'Fitness', 'Self-care', 'Hobby', 'Identity', 'Religion'];

interface MomentEmotionListProps {
  emotionId: number;
  time: string;
  reasons: string[];
}

export default function MomentEmotionList({ emotionId, time, reasons }: MomentEmotionListProps) {
  const randomEmotionId = useMemo(() => {
    return Math.floor(Math.random() * 7);
  }, []);

  const emotionColor = emotionId ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[randomEmotionId].color;
  const emotionName = emotionId ? EMOTION_STEPS[emotionId].type : EMOTION_STEPS[randomEmotionId].type;
  const reasonList = reasons ? reasons : REASON_LISTS;
  const formattedTime = time ? formatTime(new Date(time)) : formatTime(new Date());

  return (
    <li className="flex w-full items-center gap-4 py-4">
      <div className="flex h-full flex-col">
        <EmotionPlanetImage emotionId={emotionId ?? randomEmotionId} width={56} height={56} isGlow={false} />
      </div>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <Text size="2" color={emotionColor}>
            {emotionName}
          </Text>
          <Text size="1" color="gray">
            {formattedTime}
          </Text>
        </div>

        <div className="flex flex-wrap gap-2">
          {reasonList.map(reason => (
            <Badge key={reason} color="gray" radius="full" variant="soft" className="!font-normal">
              {reason}
            </Badge>
          ))}
        </div>
      </div>
    </li>
  );
}
