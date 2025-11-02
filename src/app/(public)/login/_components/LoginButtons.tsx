'use client';

import { useSearchParams } from 'next/navigation';

import { Button } from '@radix-ui/themes';
import { signIn } from 'next-auth/react';

import { useIsMobile } from '@/app/_hooks/useMediaQuery';

/**
 * Login buttons component
 * Separated into Client Component to use useIsMobile hook
 * Uses next-auth/react signIn for client-side authentication
 * Reads callbackUrl from URL params to redirect after login
 */
export default function LoginButtons() {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="flex flex-col gap-4">
      <Button
        color="amber"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('kakao', { callbackUrl });
        }}
      >
        Login With Kakao
      </Button>

      <Button
        color="blue"
        size={isMobile ? '4' : '3'}
        variant="soft"
        className="w-full"
        onClick={async () => {
          await signIn('google', { callbackUrl });
        }}
      >
        Login With Google
      </Button>
    </div>
  );
}
