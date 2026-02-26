'use client';

/**
 * [Spaceout Video Error Boundary]
 * Displayed when video manifest fetch fails
 * Opens confirm modal for retry/skip on mount
 */

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export default function SpaceoutVideoError({ reset }: ErrorProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { openConfirmModal } = useModal();

  /**
   * --------------------------------------------
   * 2. Effects
   * --------------------------------------------
   */
  useEffect(() => {
    openConfirmModal({
      id: 'spaceout-video-manifest-error',
      title: 'Video Load Failed',
      description: 'Failed to load videos. Would you like to retry or skip?',
      confirmText: 'Retry',
      cancelText: 'Skip',
      onConfirm: reset,
      onCancel: () => router.replace('/record'),
    });
  }, [openConfirmModal, reset, router]);

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return null;
}
