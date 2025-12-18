'use client';

import Link from 'next/link';

import { Button, Link as RadixLink } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

import { useUpdateConsentMutation } from '@/services/user/user.query';

import { useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface AiConsentModalProps {
  onAgree: () => void;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function AiConsentModal({ onAgree }: AiConsentModalProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { update: updateSession } = useSession();
  const { closeModal } = useModal();

  /**
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const { mutate: updateConsent } = useUpdateConsentMutation({
    onSuccess: async () => {
      // Update next-auth session with new consent data
      await updateSession({
        user: {
          consents: {
            termsAgreed: true,
            privacyAgreed: true,
            sensitiveDataConsent: true,
            aiAnalysisConsent: true,
          },
        },
      });
      closeModal();
      onAgree();
    },
    onError: error => {
      console.error('[AiConsentModal] Failed to update consent:', error);
    },
  });

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="flex flex-col gap-8 py-2">
      <ModalHeader title="Use AI for analysis?" description="Do you agree to use AI for analysis?" />

      <RadixLink asChild size="2">
        <Link href="/terms/ai-analysis" target="_blank">
          View AI Analysis Terms
        </Link>
      </RadixLink>

      <div className="flex justify-end gap-3">
        <Button variant="soft" color="gray" size="3" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          size="3"
          onClick={() => {
            updateConsent({
              termsAgreed: true,
              privacyAgreed: true,
              sensitiveDataConsent: true,
              aiAnalysisConsent: true,
            });
          }}
        >
          Agree
        </Button>
      </div>
    </div>
  );
}
