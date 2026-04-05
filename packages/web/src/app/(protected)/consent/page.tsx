'use client';

import { useRouter } from 'next/navigation';

import { Button, Callout, Checkbox, Link, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import type { UpdateConsentRequest } from '@/services/user/user.dto';
import { useUpdateConsentMutation } from '@/services/user/user.query';

/*
 * ============================================
 * Component
 * ============================================
 */

export default function ConsentPage() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const router = useRouter();
  const { update: updateSession } = useSession();
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [consents, setConsents] = useState<UpdateConsentRequest>({
    termsAgreed: false,
    privacyAgreed: false,
    sensitiveDataConsent: false,
    aiAnalysisConsent: false,
  });

  /*
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */
  const { mutate: updateConsent, isPending: isUpdatingConsent } = useUpdateConsentMutation({
    onSuccess: async data => {
      // Update NextAuth session with new consent data
      await updateSession({
        user: {
          consents: data.data.consents,
        },
      });
      router.push('/');
    },
    onError: error => {
      console.error('[Consent] Failed to update consent:', error);
      openAlertModal({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to save your consent preferences. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 4. Derived Values
   * --------------------------------------------
   */
  const allRequiredConsentsChecked = consents.termsAgreed && consents.privacyAgreed && consents.sensitiveDataConsent;

  /*
   * --------------------------------------------
   * 5. Event Handlers
   * --------------------------------------------
   */

  /** Handle form submission */
  const handleSubmit = () => {
    // Validate required consents
    if (!consents.termsAgreed || !consents.privacyAgreed || !consents.sensitiveDataConsent) {
      openAlertModal({
        title: 'Required Agreements',
        description: 'Please agree to all required terms to continue.',
      });
      return;
    }

    updateConsent(consents);
  };

  /*
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] p-8"
    >
      <div
        className="w-full max-w-[600px] rounded-[var(--radius-4)] bg-[var(--color-background)] p-8"
        style={{ boxShadow: 'var(--shadow-4)' }}
      >
        {/* Title */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Text size="6" weight="bold">
              Welcome to Zero Gravity
            </Text>
            <Text size="3" color="gray" style={{ textAlign: 'center' }}>
              Before you begin, please review and accept our terms
            </Text>
          </div>
        </div>

        {/* Required Consents */}
        <div className="mb-5 flex flex-col gap-4">
          <Text size="4" weight="bold" mb="2">
            Required Agreements
          </Text>

          {/* Terms of Service */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={consents.termsAgreed}
              onCheckedChange={checked => setConsents({ ...consents, termsAgreed: checked === true })}
              size="2"
              style={{ marginTop: '2px' }}
            />
            <div className="flex flex-1 flex-col gap-1">
              <Text size="3">
                I agree to the{' '}
                <Link href="/terms/service" target="_blank" rel="noopener noreferrer" color="blue" underline="hover">
                  Terms of Service
                </Link>{' '}
                <Text color="red">*</Text>
              </Text>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={consents.privacyAgreed}
              onCheckedChange={checked => setConsents({ ...consents, privacyAgreed: checked === true })}
              size="2"
              style={{ marginTop: '2px' }}
            />
            <div className="flex flex-1 flex-col gap-1">
              <Text size="3">
                I agree to the{' '}
                <Link href="/terms/privacy" target="_blank" rel="noopener noreferrer" color="blue" underline="hover">
                  Privacy Policy
                </Link>{' '}
                <Text color="red">*</Text>
              </Text>
            </div>
          </div>

          {/* Sensitive Data Consent */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={consents.sensitiveDataConsent}
              onCheckedChange={checked => setConsents({ ...consents, sensitiveDataConsent: checked === true })}
              size="2"
              style={{ marginTop: '2px' }}
            />
            <div className="flex flex-1 flex-col gap-1">
              <Text size="3">
                I agree to the collection and processing of{' '}
                <Link
                  href="/terms/sensitive-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue"
                  underline="hover"
                >
                  Sensitive Personal Data
                </Link>{' '}
                <Text color="red">*</Text>
              </Text>
              <Text size="2" color="gray">
                Includes emotion data, health-related information, and personal notes
              </Text>
            </div>
          </div>
        </div>

        {/* Optional Consents */}
        <div className="mb-6 flex flex-col gap-4">
          <Text size="4" weight="bold" mb="2">
            Optional Features
          </Text>

          {/* AI Analysis Consent */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={consents.aiAnalysisConsent}
              onCheckedChange={checked => setConsents({ ...consents, aiAnalysisConsent: checked === true })}
              size="2"
              style={{ marginTop: '2px' }}
            />
            <div className="flex flex-1 flex-col gap-2">
              <Text size="3">
                I agree to{' '}
                <Link
                  href="/terms/ai-analysis"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue"
                  underline="hover"
                >
                  AI-Powered Analysis
                </Link>
              </Text>
              <Callout.Root color="amber" size="1">
                <Callout.Text>
                  <Text size="2">
                    Your emotion data will be sent to Google Gemini AI for personalized insights. This data transmission
                    is irreversible and cannot be deleted from AI systems. You can disable this feature later in
                    Settings, but it will only stop future transmissions.
                  </Text>
                </Callout.Text>
              </Callout.Root>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-3">
          <Button
            size="3"
            disabled={!allRequiredConsentsChecked || isUpdatingConsent}
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {isUpdatingConsent ? 'Saving...' : 'Accept and Continue'}
          </Button>
          <Text size="2" color="gray" style={{ textAlign: 'center' }}>
            <Text color="red">*</Text> Required to use Zero Gravity
          </Text>
        </div>
      </div>
    </main>
  );
}
