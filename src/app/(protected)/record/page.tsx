'use client';

import { useRouter } from 'next/navigation';

import { Button, Heading, Text } from '@radix-ui/themes';

import { getTodayString } from '@/app/_utils/dateTimeUtils';

export default function RecordPage() {
  const router = useRouter();
  const today = getTodayString();

  const handleDailyRecord = () => {
    router.push(`/record/daily?date=${today}`);
  };

  const handleMomentRecord = () => {
    router.push(`/record/moment?date=${today}`);
  };

  return (
    <section className="mobile:px-5 absolute inset-0 flex h-[100dvh] w-[100dvw] flex-col items-center justify-center gap-8 pt-[96px]">
      <div className="flex flex-col items-center gap-4">
        <Heading size="8" weight="bold">
          Record Your Emotion
        </Heading>
        <Text size="4" color="gray" align="center">
          어떤 기록을 남기시겠어요?
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <Button size="4" variant="solid" onClick={handleDailyRecord}>
          Daily - 하루 기록
        </Button>
        <Button size="4" variant="soft" onClick={handleMomentRecord}>
          Moment - 순간 기록
        </Button>
      </div>
    </section>
  );
}
