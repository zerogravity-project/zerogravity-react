/**
 * [ButtonSection component]
 * Login button section with auth error handling
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

import { LoginButton } from './LoginButton';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Backend connection error types from NextAuth */
const BACKEND_ERROR_TYPES = ['Configuration', 'CallbackRouteError', 'Default'];

/** Deactivated user error type from custom AuthError */
const DEACTIVATED_ERROR_TYPE = 'UserDeactivated';

/*
 * ============================================
 * Component
 * ============================================
 */

/**
 * Login button section
 * Handles auth errors and renders social login buttons
 */
export function ButtonSection() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const authError = searchParams.get('error');

  /*
   * --------------------------------------------
   * 3. Effects
   * --------------------------------------------
   */
  /** Check for authentication errors from NextAuth */
  useEffect(() => {
    if (!authError) return;

    if (authError === DEACTIVATED_ERROR_TYPE) {
      openAlertModal({
        id: 'user-deactivated-error',
        title: '탈퇴한 계정',
        description: '탈퇴한 계정입니다. 계정 복구를 원하시면 고객센터에 문의해주세요.',
        confirmText: '확인',
      });
    } else if (BACKEND_ERROR_TYPES.includes(authError)) {
      openAlertModal({
        id: 'backend-auth-error',
        title: 'Authentication Error',
        description: 'Failed to connect to the server. Please try again later.',
        confirmText: 'OK',
      });
    } else {
      return;
    }

    // Clear error from URL while preserving callbackUrl
    const newUrl = callbackUrl !== '/' ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login';
    router.replace(newUrl);
  }, [authError, openAlertModal, router, callbackUrl]);

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <div className="flex w-full flex-col gap-3">
      <LoginButton provider="google" callbackUrl={callbackUrl} />
      <LoginButton provider="kakao" callbackUrl={callbackUrl} />
    </div>
  );
}
