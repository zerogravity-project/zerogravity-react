'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { useTheme } from '@zerogravity/shared/components/providers';
import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Clock } from '@zerogravity/shared/components/ui/clock';
import { EmotionPlanetScene } from '@zerogravity/shared/components/ui/emotion/scene';
import { Footer } from '@zerogravity/shared/components/ui/footer';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_COLORS, type EmotionColor } from '@zerogravity/shared/entities/emotion';
import { useIsLg } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

import { PwaInstallBanner } from '@/app/(public)/_components/pwa/PwaInstallBanner';
import { usePwaInstall } from '@/app/(public)/_hooks/usePwaInstall';

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
  const { showBanner, isIOS, promptInstall, dismissBanner } = usePwaInstall();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Listen to navigation menu toggle event to freeze 3D scene */
  useEffect(() => {
    const handleMenuToggle = (event: CustomEvent<{ isOpen: boolean }>) => {
      setIsMenuOpen(event.detail.isOpen);
    };

    window.addEventListener('navigation-menu-toggle', handleMenuToggle as EventListener);
    return () => window.removeEventListener('navigation-menu-toggle', handleMenuToggle as EventListener);
  }, []);

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="flex h-[100dvh] w-[100dvw] flex-col">
      {/* Main Area */}
      <div className="pt-topnav-height animate-fade-in relative min-h-0 flex-1 overflow-hidden bg-[var(--background-dark)]">
        {/* Decorative Background */}
        <div
          aria-hidden="true"
          className={cn('absolute inset-0 z-3 mt-44 flex w-full justify-center', isLg ? 'mt-44' : 'mt-48')}
        >
          <div className={cn(isLg ? 'h-[1200px] w-[1200px]' : 'h-[1500px] w-[1500px]')}>
            <EmotionPlanetScene
              emotionId={EMOTION_COLORS.indexOf(accentColor as EmotionColor)}
              isSparkles={true}
              isGlow={true}
              isLarge={true}
              isPaused={isMenuOpen}
              width={isLg ? 1200 : 1500}
              height={isLg ? 1200 : 1500}
            />
          </div>
        </div>

        {/* Main Content */}
        <main id="main-content" className="contents">
          <Clock />

          <div className="absolute bottom-[calc(4rem+var(--safe-area-bottom))] left-[50%] z-5 translate-x-[-50%] max-[1025px]:bottom-[calc(7rem+var(--safe-area-bottom))]">
            <MotionButton
              size="4"
              variant="surface"
              radius="full"
              onClick={() => router.push('/spaceout')}
              className="!font-normal !text-nowrap hover:!opacity-80"
            >
              Start Spaceout <Icon>arrow_forward</Icon>
            </MotionButton>
          </div>
        </main>

        {/* Footer */}
        <Footer LinkComponent={Link} />
      </div>

      {/* PWA Install Banner */}
      {showBanner && <PwaInstallBanner isIOS={isIOS} onInstall={promptInstall} onDismiss={dismissBanner} />}
    </div>
  );
}
