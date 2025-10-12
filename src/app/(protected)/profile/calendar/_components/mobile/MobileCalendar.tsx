import Link from 'next/link';

import { Badge, Button, Text } from '@radix-ui/themes';
import { useMemo } from 'react';

import Icon from '@/app/_components/ui/icon/Icon';
import { getTodayString } from '@/app/_utils/dateTimeUtils';

import { EmotionPlanetScene } from '../../../../../_components/ui/emotion';
import { EMOTION_STEPS } from '../../../../../_components/ui/emotion/Emotion.type';
import EmotionPlanetNull from '../../../../../_components/ui/emotion/EmotionPlanetNull';

import MobileCalendarHeader from './MobileCalendarHeader';

const REASON_LISTS = ['Health', 'Fitness', 'Self-care', 'Hobby', 'Identity', 'Religion'];

export default function MobileCalendar() {
  const randomEmotionId = useMemo(() => {
    return Math.floor(Math.random() * 7);
  }, []);

  const emotionId = useMemo(() => {
    return Math.random() > 0.1 ? Math.floor(Math.random() * 7) : null;
  }, []);

  const emotionColor = emotionId ? EMOTION_STEPS[emotionId].color : EMOTION_STEPS[randomEmotionId].color;
  const today = getTodayString();

  return (
    <div className="flex w-full flex-col items-center px-5 pt-6 pb-9">
      <MobileCalendarHeader />

      {/* Selected date daily emotion */}
      <div className="relative flex w-full flex-col items-center">
        {!emotionId && (
          <>
            <EmotionPlanetNull emotionId={randomEmotionId} />
            <Link href={`/record/daily?date=${today}`} className="z-1 mt-6 flex w-full flex-col items-center">
              <Button color={emotionColor} variant="solid" size="4" className="!w-full !gap-[6px]">
                <Icon>add</Icon> Add Daily Emotion
              </Button>
            </Link>
          </>
        )}

        {emotionId && (
          <>
            <EmotionPlanetScene emotionId={emotionId} />
            <Text color={emotionColor} className="!text-center !text-3xl !font-normal transition-all duration-400">
              {EMOTION_STEPS[emotionId].type}
            </Text>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {REASON_LISTS.map(reason => (
                <Badge key={reason} color="gray" radius="full" variant="soft">
                  {reason}
                </Badge>
              ))}
            </div>
            <Link href={`/profile/calendar/${today}`} className="z-1 mt-6 flex w-full flex-col items-center">
              <Button color="gray" variant="soft" size="4" className="!w-full">
                See Detail <Icon>arrow_forward</Icon>
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
