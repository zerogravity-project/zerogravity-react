'use client';

import Link from 'next/link';

import { Button, Link as RadixLink } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

import { useTheme } from '@zerogravity/shared/components/providers';

import { useUpdateConsentMutation } from '@/services/user/user.query';

import { useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface AiConsentModalProps {
  onAgree: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function AiConsentModal({ onAgree }: AiConsentModalProps) {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { accentColor } = useTheme();
  const { update: updateSession } = useSession();
  const { closeModal, openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const { mutate: updateConsent } = useUpdateConsentMutation({
    onSuccess: async () => {
      // Update next-auth session with new consent data
      // Session update failure is non-critical - session syncs later
      try {
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
      } catch (error) {
        console.error('[AiConsentModal] Session update failed:', error);
      }
      closeModal();
      onAgree();
    },
    onError: error => {
      console.error('[AiConsentModal] Failed to update consent:', error);
      closeModal(); // Close AiConsentModal first
      openAlertModal({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update consent. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <div className="max-mobile:pb-2 max-mobile:pt-3 flex flex-1 flex-col justify-between pt-2">
      <ModalHeader
        title="Use AI for analysis?"
        description={
          <>
            Do you agree to use AI for analysis?
            <br />
            <RadixLink asChild color={accentColor} className="!whitespace-nowrap">
              <Link href="/terms/ai-analysis" target="_blank" className="!mt-1">
                View Terms
              </Link>
            </RadixLink>
          </>
        }
      />

      <div className="max-mobile:w-full flex justify-end gap-3">
        <Button variant="soft" color="gray" size="3" onClick={() => closeModal()} className="max-mobile:!flex-1">
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
          className="max-mobile:!flex-1"
        >
          Agree
        </Button>
      </div>
    </div>
  );
}
