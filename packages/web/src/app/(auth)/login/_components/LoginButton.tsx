/**
 * [LoginButton component]
 * Social login button with brand styling for OAuth providers
 */
'use client';

import { signIn } from 'next-auth/react';
import { ReactNode } from 'react';

import { GoogleLogo, KakaoLogo } from '@zerogravity/shared/components/ui/logo';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

type Provider = 'google' | 'kakao';

interface LoginButtonProps {
  /** OAuth provider */
  provider: Provider;
  /** Redirect URL after login */
  callbackUrl: string;
}

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Provider display names */
const PROVIDER_NAMES: Record<Provider, string> = {
  google: 'Google',
  kakao: 'Kakao',
};

/** Provider logos */
const PROVIDER_LOGOS: Record<Provider, (className: string) => ReactNode> = {
  google: className => <GoogleLogo className={className} />,
  kakao: className => <KakaoLogo className={className} />,
};

/** Provider button styles */
const PROVIDER_BUTTON_STYLES: Record<Provider, string> = {
  google: 'border border-[#747775] bg-white text-[#1F1F1F] hover:bg-[#F2F2F2]',
  kakao: 'bg-[#FEE500] text-[#191919] hover:brightness-95',
};

/*
 * ============================================
 * Component
 * ============================================
 */

/** Social login button with brand styling */
export function LoginButton({ provider, callbackUrl }: LoginButtonProps) {
  return (
    <button
      type="button"
      onClick={async () => {
        await signIn(provider, { callbackUrl });
      }}
      className={`mobile:h-10 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 font-medium transition-all active:scale-[0.98] ${PROVIDER_BUTTON_STYLES[provider]}`}
    >
      {PROVIDER_LOGOS[provider]('h-5 w-5')}
      <span>Sign in with {PROVIDER_NAMES[provider]}</span>
    </button>
  );
}
