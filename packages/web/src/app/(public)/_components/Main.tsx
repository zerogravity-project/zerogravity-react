'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@radix-ui/themes';
import { useState } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import { Clock } from '@zerogravity/shared/components/ui/clock';
import { LazyEmotionPlanetScene } from '@zerogravity/shared/components/ui/emotion/scene-lazy';
import { Footer } from '@zerogravity/shared/components/ui/footer';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { PageLoading } from '@zerogravity/shared/components/ui/loading';
import { EMOTION_COLORS, type EmotionColor } from '@zerogravity/shared/entities/emotion';
import { useIsLg } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function Main() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();
  const isLg = useIsLg();
  const router = useRouter();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isLoaded, setIsLoaded] = useState(false);

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="pt-topnav-height relative h-[100dvh] w-[100dvw] overflow-hidden bg-[var(--background-dark)]">
      <PageLoading isLoaded={isLoaded} />

      <div className={cn('absolute inset-0 z-3 mt-44 flex w-full justify-center', isLg ? 'mt-44' : 'mt-48')}>
        <div className={cn(isLg ? 'h-[1200px] w-[1200px]' : 'h-[1500px] w-[1500px]')}>
          <LazyEmotionPlanetScene
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
      <Footer LinkComponent={Link} />
    </div>
  );
}
