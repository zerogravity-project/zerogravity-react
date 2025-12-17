'use client';

import { Button, Dialog, Text } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { useLogoutMutation } from '@/services/auth/auth.query';
import { useDeleteUserMutation, useUpdateConsentMutation, useUserProfileQuery } from '@/services/user/user.query';

import { ConsentToggle } from './_components/ConsentToggle';
import { SettingAction } from './_components/SettingAction';
import { SettingField } from './_components/SettingField';
import { SettingSection } from './_components/SettingSection';

/**
 * ============================================
 * Component
 * ============================================
 */

export default function ProfileSettingsPage() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { data: session, update: updateSession } = useSession();

  /**
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [showAIWarning, setShowAIWarning] = useState(false);

  /**
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
      alert('Failed to update consent. Please try again.');
    },
  });

  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      signOut({ callbackUrl: '/login' });
    },
    onError: error => {
      console.error('[Settings] Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    },
  });

  const { mutate: deleteUser } = useDeleteUserMutation({
    onSuccess: () => {
      signOut({ callbackUrl: '/login' });
    },
    onError: error => {
      console.error('[Settings] Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
    },
  });

  /**
   * --------------------------------------------
   * 4. Derived Values
   * --------------------------------------------
   */
  const user = session?.user;
  const displayName = user?.name ?? 'ZeroGravity User';
  const email = user?.email ?? 'example@example.com';
  const consents = userProfile?.consents || user?.consents;

  /**
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

  /**
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <div className="flex h-full w-full flex-1 flex-col gap-7 overflow-y-auto px-6 pt-6 pb-10 md:p-8">
      {/* Profile Settings Section */}
      <SettingSection title="Profile">
        <SettingField label="Display Name" value={displayName} />
        <SettingField label="Email" value={email} type="email" />
      </SettingSection>

      {/* Privacy & Consent Section */}
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

      {/* Account Actions Section */}
      <SettingSection title="Account">
        <SettingAction label="Logout" buttonText="Logout" variant="soft" color="gray" onClick={() => logout()} />
        <SettingAction
          label="Delete Account"
          buttonText="Delete"
          variant="soft"
          color="red"
          onClick={() => deleteUser()}
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
    </div>
  );
}
