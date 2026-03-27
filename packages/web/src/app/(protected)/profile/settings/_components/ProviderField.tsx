/**
 * [ProviderField component]
 * Displays connected OAuth provider with icon
 */
'use client';

import { Text } from '@radix-ui/themes';

import { GoogleLogo, KakaoLogo } from '@zerogravity/shared/components/ui/logo';
import { useIsMobile } from '@zerogravity/shared/hooks';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ProviderFieldProps {
  /** OAuth provider name ('google' | 'kakao') */
  provider: string;
}

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Provider display names */
const PROVIDER_NAMES: Record<string, string> = {
  google: 'Google',
  kakao: 'Kakao',
};

/** Provider brand background colors */
const PROVIDER_BG_COLORS: Record<string, string> = {
  google: 'bg-[#E8F0FE]',
  kakao: 'bg-[#FEE500]',
};

/** Provider brand text colors */
const PROVIDER_TEXT_COLORS: Record<string, string> = {
  google: 'text-[#1f1f1f]',
  kakao: 'text-[#391B1B]',
};

/*
 * ============================================
 * Component
 * ============================================
 */

export function ProviderField({ provider }: ProviderFieldProps) {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const providerName = PROVIDER_NAMES[provider] || provider;

  /** Render provider logo */
  const renderLogo = (size: string) => {
    if (provider === 'google') return <GoogleLogo className={size} />;
    if (provider === 'kakao') return <KakaoLogo className={`${size} text-[#191919]`} />;
    return null;
  };

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="flex flex-col gap-1">
      <Text as="div" size={isMobile ? '3' : '2'} mb="1" weight="regular">
        Connected Account
      </Text>

      <div className={`flex w-fit items-center gap-1 rounded-full ${PROVIDER_BG_COLORS[provider]} px-2.5 py-1.5`}>
        {renderLogo('h-4 w-4')}
        <Text size={isMobile ? '2' : '1'} weight="bold" className={PROVIDER_TEXT_COLORS[provider]}>
          {providerName}
        </Text>
      </div>
    </div>
  );
}
