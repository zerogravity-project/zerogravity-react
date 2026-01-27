import { useTheme } from '@zerogravity/shared/components/providers';
import { MotionButton } from '@zerogravity/shared/components/ui/button';
import { Clock } from '@zerogravity/shared/components/ui/clock';
import { EmotionPlanetScene } from '@zerogravity/shared/components/ui/emotion/scene';
import { Footer } from '@zerogravity/shared/components/ui/footer';
import { Icon } from '@zerogravity/shared/components/ui/icon';
import { EMOTION_COLORS, type EmotionColor } from '@zerogravity/shared/entities/emotion';
import { useIsLg } from '@zerogravity/shared/hooks';
import { cn } from '@zerogravity/shared/utils';

import { NavigationAdapter } from './components/navigation/NavigationAdapter';

/*
 * ============================================
 * Component
 * ============================================
 */

function App() {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();
  const isLg = useIsLg();

  /*
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  /** Navigate to spaceout page in web app */
  const handleSpaceoutClick = () => {
    window.location.href = `${import.meta.env.VITE_WEB_APP_URL as string}/spaceout`;
  };

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="pt-topnav-height relative h-[100dvh] w-[100dvw] overflow-hidden bg-[var(--background-dark)]">
      {/* Navigation */}
      <NavigationAdapter className="fixed top-0" />

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
            width={isLg ? 1200 : 1500}
            height={isLg ? 1200 : 1500}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="contents">
        <Clock />

        <div className="absolute bottom-16 left-[50%] z-5 translate-x-[-50%] max-[1025px]:bottom-28">
          <MotionButton
            size="4"
            variant="surface"
            radius="full"
            onClick={handleSpaceoutClick}
            className="!font-normal !text-nowrap hover:!opacity-80"
          >
            Start Spaceout <Icon>arrow_forward</Icon>
          </MotionButton>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
