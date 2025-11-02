'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@radix-ui/themes';
import { useState } from 'react';

import { useTheme } from '@/app/_components/providers/ThemeProvider';
import { Footer } from '@/app/_components/ui';
import { EmotionPlanetScene } from '@/app/_components/ui/emotion';
import { EMOTION_COLORS } from '@/app/_components/ui/emotion/_constants/emotion.constants';
import { EmotionColor } from '@/app/_components/ui/emotion/_types/emotion.types';
import { Icon } from '@/app/_components/ui/icon';
import PageLoading from '@/app/_components/ui/loading/PageLoading';
import { useIsLg } from '@/app/_hooks/useMediaQuery';
import { cn } from '@/app/_utils/styleUtils';

import Clock from './clock/Clock';

export default function Main() {
  const { accentColor } = useTheme();
  const isLg = useIsLg();
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="pt-topnav-height relative h-[100dvh] w-[100dvw] overflow-hidden bg-[var(--background-dark)]">
      <PageLoading isLoaded={isLoaded} />

      <div className={cn('absolute inset-0 z-3 mt-44 flex w-full justify-center', isLg ? 'mt-44' : 'mt-48')}>
        <div className={cn(isLg ? 'h-[1200px] w-[1200px]' : 'h-[1500px] w-[1500px]')}>
          <EmotionPlanetScene
            emotionId={EMOTION_COLORS.indexOf(accentColor as EmotionColor)}
            isSparkles={true}
            isGlow={true}
            isLarge={true}
            width={isLg ? 1200 : 1500}
            height={isLg ? 1200 : 1500}
            onSceneLoaded={() => setIsLoaded(true)}
          />
        </div>
      </div>

      {/* Main Content */}
      <Clock />

      <div className="absolute bottom-16 left-[50%] z-5 translate-x-[-50%] max-[1025px]:bottom-28">
        <Button
          size="4"
          variant="surface"
          radius="full"
          onClick={() => router.push('/spaceout')}
          className="!font-normal !text-nowrap hover:!opacity-80"
        >
          Start Spaceout <Icon>arrow_forward</Icon>
        </Button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
