'use client';

import Link from 'next/link';

import { Button, Flex, Link as RadixLink } from '@radix-ui/themes';

import { useUpdateConsentMutation } from '@/services/user/user.query';

import { useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

interface AiConsentModalProps {
  onAgree: () => void;
}

export function AiConsentModal({ onAgree }: AiConsentModalProps) {
  const { closeModal } = useModal();
  const { mutate: updateConsent } = useUpdateConsentMutation({
    onSuccess: () => {
      closeModal();
      onAgree();
    },
    onError: error => {
      console.error('[AiConsentModal] Failed to update consent:', error);
    },
  });

  return (
    <div className="flex flex-col gap-8 py-2">
      <ModalHeader title="Use AI for analysis?" description="Do you agree to use AI for analysis?" />

      <RadixLink asChild size="2">
        <Link href="/terms/ai-analysis" target="_blank">
          View AI Analysis Terms
        </Link>
      </RadixLink>

      <Flex gap="3" justify="end">
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
      </Flex>
    </div>
  );
}
