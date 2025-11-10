/**
 * Consent page
 * First-time user consent collection with Radix UI
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Button, Flex, Text, Link, Box, Callout } from '@radix-ui/themes';
import { Logo } from '@zerogravity/shared/components/ui/logo';
import { useUpdateConsentMutation } from '@/services/user/user.query';
import type { UpdateConsentRequest } from '@/services/user/user.dto';

export default function ConsentPage() {
  const router = useRouter();
  const [consents, setConsents] = useState<UpdateConsentRequest>({
    termsAgreed: false,
    privacyAgreed: false,
    sensitiveDataConsent: false,
    aiAnalysisConsent: false,
  });

  const updateConsentMutation = useUpdateConsentMutation({
    onSuccess: () => {
      router.push('/');
    },
    onError: (error) => {
      console.error('[Consent] Failed to update consent:', error);
      alert('Failed to save your consent preferences. Please try again.');
    },
  });

  const handleSubmit = () => {
    // Validate required consents
    if (!consents.termsAgreed || !consents.privacyAgreed || !consents.sensitiveDataConsent) {
      alert('Please agree to all required terms to continue.');
      return;
    }

    updateConsentMutation.mutate(consents);
  };

  const allRequiredConsentsChecked =
    consents.termsAgreed && consents.privacyAgreed && consents.sensitiveDataConsent;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: 'var(--gray-1)',
      }}
    >
      <Box
        style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-4)',
          padding: '2rem',
          boxShadow: 'var(--shadow-4)',
        }}
      >
        {/* Logo and Title */}
        <Flex direction="column" align="center" gap="4" mb="6">
          <Logo width={48} />
          <Flex direction="column" align="center" gap="2">
            <Text size="6" weight="bold">
              Welcome to ZeroGravity
            </Text>
            <Text size="3" color="gray" style={{ textAlign: 'center' }}>
              Before you begin, please review and accept our terms
            </Text>
          </Flex>
        </Flex>

        {/* Required Consents */}
        <Flex direction="column" gap="4" mb="5">
          <Text size="4" weight="bold" mb="2">
            Required Agreements
          </Text>

          {/* Terms of Service */}
          <Flex gap="3" align="start">
            <Checkbox
              checked={consents.termsAgreed}
              onCheckedChange={(checked) =>
                setConsents({ ...consents, termsAgreed: checked === true })
              }
              size="2"
              style={{ marginTop: '2px' }}
            />
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Text size="3">
                I agree to the{' '}
                <Link
                  href="/terms/service"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue"
                  underline="hover"
                >
                  Terms of Service
                </Link>{' '}
                <Text color="red">*</Text>
              </Text>
            </Flex>
          </Flex>

          {/* Privacy Policy */}
          <Flex gap="3" align="start">
            <Checkbox
              checked={consents.privacyAgreed}
              onCheckedChange={(checked) =>
                setConsents({ ...consents, privacyAgreed: checked === true })
              }
              size="2"
              style={{ marginTop: '2px' }}
            />
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Text size="3">
                I agree to the{' '}
                <Link
                  href="/terms/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue"
                  underline="hover"
                >
                  Privacy Policy
                </Link>{' '}
                <Text color="red">*</Text>
              </Text>
            </Flex>
          </Flex>

          {/* Sensitive Data Consent */}
          <Flex gap="3" align="start">
            <Checkbox
              checked={consents.sensitiveDataConsent}
              onCheckedChange={(checked) =>
                setConsents({ ...consents, sensitiveDataConsent: checked === true })
              }
              size="2"
              style={{ marginTop: '2px' }}
            />
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
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
            </Flex>
          </Flex>
        </Flex>

        {/* Optional Consents */}
        <Flex direction="column" gap="4" mb="6">
          <Text size="4" weight="bold" mb="2">
            Optional Features
          </Text>

          {/* AI Analysis Consent */}
          <Flex gap="3" align="start">
            <Checkbox
              checked={consents.aiAnalysisConsent}
              onCheckedChange={(checked) =>
                setConsents({ ...consents, aiAnalysisConsent: checked === true })
              }
              size="2"
              style={{ marginTop: '2px' }}
            />
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
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
                    Your emotion data will be sent to Google Gemini AI for personalized insights.
                    This data transmission is irreversible and cannot be deleted from AI systems.
                    You can disable this feature later in Settings, but it will only stop future
                    transmissions.
                  </Text>
                </Callout.Text>
              </Callout.Root>
            </Flex>
          </Flex>
        </Flex>

        {/* Submit Button */}
        <Flex direction="column" gap="3">
          <Button
            size="3"
            disabled={!allRequiredConsentsChecked || updateConsentMutation.isPending}
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {updateConsentMutation.isPending ? 'Saving...' : 'Accept and Continue'}
          </Button>
          <Text size="2" color="gray" style={{ textAlign: 'center' }}>
            <Text color="red">*</Text> Required to use ZeroGravity
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}
