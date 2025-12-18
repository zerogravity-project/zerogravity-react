'use client';

import { Button, Dialog } from '@radix-ui/themes';

import { AIAnalysisContent } from '@/app/(public)/terms/[type]/_components/AIAnalysisContent';
import { PrivacyPolicyContent } from '@/app/(public)/terms/[type]/_components/PrivacyPolicyContent';
import { SensitiveDataContent } from '@/app/(public)/terms/[type]/_components/SensitiveDataContent';
import { ServiceTermsContent } from '@/app/(public)/terms/[type]/_components/ServiceTermsContent';

import { useModal } from './_contexts/ModalContext';

/**
 * ============================================
 * Constants
 * ============================================
 */

/** Terms type mapping */
const TERMS_TITLE_MAP = {
  service: 'Terms of Service',
  privacy: 'Privacy Policy',
  'sensitive-data': 'Sensitive Data Processing',
  'ai-analysis': 'AI-Powered Analysis',
} as const;

/** Content component mapping */
const TERMS_CONTENT_MAP = {
  service: ServiceTermsContent,
  privacy: PrivacyPolicyContent,
  'sensitive-data': SensitiveDataContent,
  'ai-analysis': AIAnalysisContent,
} as const;

/** Hash prefix for terms modals */
const TERMS_HASH_PREFIX = 'terms-';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

type TermsType = keyof typeof TERMS_TITLE_MAP;

/**
 * ============================================
 * TermsModal Component
 * ============================================
 * Hash-based modal for displaying terms and policies
 * Usage: openHashModal('terms-service'), openHashModal('terms-privacy'), etc.
 * URL: #terms-service, #terms-privacy, #terms-sensitive-data, #terms-ai-analysis
 */

export function TermsModal() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentHashModal, closeModal } = useModal();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  /** Check if current hash is a terms modal */
  const isTermsModal = currentHashModal?.startsWith(TERMS_HASH_PREFIX) ?? false;

  /** Extract terms type from hash (e.g., 'terms-service' → 'service') */
  const termsType =
    isTermsModal && currentHashModal ? (currentHashModal.replace(TERMS_HASH_PREFIX, '') as TermsType) : null;

  /** Get title for current terms type */
  const title = termsType ? TERMS_TITLE_MAP[termsType] : '';

  /** Get content component for current terms type */
  const ContentComponent = termsType ? TERMS_CONTENT_MAP[termsType] : null;

  /**
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  /** Handle dialog close */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  /**
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  if (!isTermsModal || !termsType || !ContentComponent) return null;

  return (
    <Dialog.Root open={isTermsModal} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="600px" style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <Dialog.Title>{title}</Dialog.Title>
        <div className="rt-r-mb-4">
          <ContentComponent />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
