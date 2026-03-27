/**
 * [ConsentSection component]
 * Client component for privacy consent toggles with AI warning dialog
 * Uses React Query hydration for consent data
 */
'use client';

import { Button, Dialog, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { useUpdateConsentMutation, useUserProfileQuery } from '@/services/user/user.query';

import { ConsentToggle } from './ConsentToggle';
import { SettingSection } from './SettingSection';

/*
 * ============================================
 * Component
 * ============================================
 */

export function ConsentSection() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { data: session, update: updateSession } = useSession();
  const { openAlertModal } = useModal();

  /*
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [showAIWarning, setShowAIWarning] = useState(false);

  /*
   * --------------------------------------------
   * 3. Query Hooks
   * --------------------------------------------
   */
  const { data: userProfile } = useUserProfileQuery();

  const { mutate: updateConsent, isPending: isUpdatingConsent } = useUpdateConsentMutation({
    onSuccess: async data => {
      // Update next-auth session with new consent data
      await updateSession({
        user: {
          consents: data.data.consents,
        },
      });
      setShowAIWarning(false);
    },
    onError: error => {
      console.error('[Settings] Failed to update consent:', error);
      openAlertModal({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update consent. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 4. Derived Values
   * --------------------------------------------
   */
  const consents = userProfile?.consents || session?.user?.consents;

  /*
   * --------------------------------------------
   * 5. Event Handlers
   * --------------------------------------------
   */

  /** Handle AI consent toggle */
  const handleAIConsentToggle = (checked: boolean) => {
    if (!checked) {
      // Show warning when disabling AI consent
      setShowAIWarning(true);
    } else {
      // Enable AI consent immediately
      updateConsent({
        termsAgreed: true,
        privacyAgreed: true,
        sensitiveDataConsent: true,
        aiAnalysisConsent: true,
      });
    }
  };

  /** Confirm AI consent disable */
  const confirmAIConsentDisable = () => {
    updateConsent({
      termsAgreed: true,
      privacyAgreed: true,
      sensitiveDataConsent: true,
      aiAnalysisConsent: false,
    });
  };

  /*
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <>
      <SettingSection title="Privacy & Consent">
        <ConsentToggle
          label="Terms of Service"
          description="Required to use ZeroGravity"
          checked={consents?.termsAgreed ?? false}
          disabled
          viewDetailUrl="/terms/service"
        />
        <ConsentToggle
          label="Privacy Policy"
          description="Required to use ZeroGravity"
          checked={consents?.privacyAgreed ?? false}
          disabled
          viewDetailUrl="/terms/privacy"
        />
        <ConsentToggle
          label="Sensitive Data Processing"
          description="Required for emotion tracking"
          checked={consents?.sensitiveDataConsent ?? false}
          disabled
          viewDetailUrl="/terms/sensitive-data"
        />
        <ConsentToggle
          label="AI-Powered Analysis"
          description="Optional: Get personalized insights from AI"
          checked={consents?.aiAnalysisConsent ?? false}
          disabled={isUpdatingConsent}
          onCheckedChange={handleAIConsentToggle}
          viewDetailUrl="/terms/ai-analysis"
        />
      </SettingSection>

      {/* AI Consent Warning Dialog */}
      <Dialog.Root open={showAIWarning} onOpenChange={setShowAIWarning}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Disable AI-Powered Analysis?</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            <div className="flex flex-col gap-3">
              <Text>
                Disabling AI analysis will stop sending your emotion data to Google Gemini AI for future insights.
              </Text>
              <Text weight="bold" color="amber">
                Important: Previously sent data cannot be retrieved or deleted from AI systems. You can still view
                previously generated insights stored in our database.
              </Text>
            </div>
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button variant="solid" color="red" onClick={confirmAIConsentDisable}>
                Disable AI Analysis
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
