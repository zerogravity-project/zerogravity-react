'use client';

import { Dialog, Button, Flex } from '@radix-ui/themes';

import { AIAnalysisContent } from '@/app/(public)/terms/[type]/_components/AIAnalysisContent';
import { PrivacyPolicyContent } from '@/app/(public)/terms/[type]/_components/PrivacyPolicyContent';
import { SensitiveDataContent } from '@/app/(public)/terms/[type]/_components/SensitiveDataContent';
import { ServiceTermsContent } from '@/app/(public)/terms/[type]/_components/ServiceTermsContent';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'service' | 'privacy' | 'sensitive-data' | 'ai-analysis' | '';
}

const TERMS_TITLE_MAP = {
  service: 'Terms of Service',
  privacy: 'Privacy Policy',
  'sensitive-data': 'Sensitive Data Processing',
  'ai-analysis': 'AI-Powered Analysis',
} as const;

const TERMS_CONTENT_MAP = {
  service: ServiceTermsContent,
  privacy: PrivacyPolicyContent,
  'sensitive-data': SensitiveDataContent,
  'ai-analysis': AIAnalysisContent,
} as const;

export function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  if (!type) return null;

  const title = TERMS_TITLE_MAP[type];
  const ContentComponent = TERMS_CONTENT_MAP[type];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content maxWidth="600px" style={{ maxHeight: '80vh', overflow: 'auto' }}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {ContentComponent && <ContentComponent />}
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
