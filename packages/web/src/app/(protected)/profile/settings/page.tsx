'use client';

import { usePathname } from 'next/navigation';

import { Button, Dialog, Flex, Separator, Switch, Text, TextField } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { useIsMobile } from '@zerogravity/shared/hooks';

import { AIAnalysisContent } from '@/app/terms/[type]/_components/AIAnalysisContent';
import { PrivacyPolicyContent } from '@/app/terms/[type]/_components/PrivacyPolicyContent';
import { SensitiveDataContent } from '@/app/terms/[type]/_components/SensitiveDataContent';
import { ServiceTermsContent } from '@/app/terms/[type]/_components/ServiceTermsContent';
import { useUpdateConsentMutation, useUserProfileQuery } from '@/services/user/user.query';

export default function ProfileSettingsPage() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: userProfile } = useUserProfileQuery();
  const user = session?.user;
  const displayName = user?.name ?? 'ZeroGravity User';
  const email = user?.email ?? 'example@example.com';

  const [showAIWarning, setShowAIWarning] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [activeTermsType, setActiveTermsType] = useState<string>('');

  const updateConsentMutation = useUpdateConsentMutation({
    onSuccess: () => {
      setShowAIWarning(false);
    },
    onError: error => {
      console.error('[Settings] Failed to update consent:', error);
      alert('Failed to update consent. Please try again.');
    },
  });

  const consents = userProfile?.consents || user?.consents;

  const handleAIConsentToggle = (checked: boolean) => {
    if (!checked) {
      // Show warning when disabling AI consent
      setShowAIWarning(true);
    } else {
      // Enable AI consent immediately
      updateConsentMutation.mutate({
        termsAgreed: true,
        privacyAgreed: true,
        sensitiveDataConsent: true,
        aiAnalysisConsent: true,
      });
    }
  };

  const confirmAIConsentDisable = () => {
    updateConsentMutation.mutate({
      termsAgreed: true,
      privacyAgreed: true,
      sensitiveDataConsent: true,
      aiAnalysisConsent: false,
    });
  };

  const openTermsModal = (type: string) => {
    setActiveTermsType(type);
    setTermsModalOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-7 p-6 md:p-8">
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
          onViewDetails={() => openTermsModal('service')}
        />
        <ConsentToggle
          label="Privacy Policy"
          description="Required to use ZeroGravity"
          checked={consents?.privacyAgreed ?? false}
          disabled
          onViewDetails={() => openTermsModal('privacy')}
        />
        <ConsentToggle
          label="Sensitive Data Processing"
          description="Required for emotion tracking"
          checked={consents?.sensitiveDataConsent ?? false}
          disabled
          onViewDetails={() => openTermsModal('sensitive-data')}
        />
        <ConsentToggle
          label="AI-Powered Analysis"
          description="Optional: Get personalized insights from AI"
          checked={consents?.aiAnalysisConsent ?? false}
          disabled={updateConsentMutation.isPending}
          onCheckedChange={handleAIConsentToggle}
          onViewDetails={() => openTermsModal('ai-analysis')}
        />
      </SettingSection>

      {/* Account Actions Section */}
      <SettingSection title="Account">
        <SettingAction
          label="Logout"
          buttonText="Logout"
          variant="soft"
          color="gray"
          onClick={() => {
            signOut({ callbackUrl: `/login?callbackUrl=${encodeURIComponent(pathname)}` });
          }}
        />
        <SettingAction label="Delete Account" buttonText="Delete" variant="soft" color="red" />
      </SettingSection>

      {/* AI Consent Warning Dialog */}
      <Dialog.Root open={showAIWarning} onOpenChange={setShowAIWarning}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Disable AI-Powered Analysis?</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            <Flex direction="column" gap="3">
              <Text>
                Disabling AI analysis will stop sending your emotion data to Google Gemini AI for future insights.
              </Text>
              <Text weight="bold" color="amber">
                Important: Previously sent data cannot be retrieved or deleted from AI systems. You can still view
                previously generated insights stored in our database.
              </Text>
            </Flex>
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
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
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Terms & Policies Dialog */}
      <Dialog.Root open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <Dialog.Content maxWidth="600px" style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <Dialog.Title>
            {activeTermsType === 'service' && 'Terms of Service'}
            {activeTermsType === 'privacy' && 'Privacy Policy'}
            {activeTermsType === 'sensitive-data' && 'Sensitive Data Processing'}
            {activeTermsType === 'ai-analysis' && 'AI-Powered Analysis'}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {activeTermsType === 'service' && <ServiceTermsContent />}
            {activeTermsType === 'privacy' && <PrivacyPolicyContent />}
            {activeTermsType === 'sensitive-data' && <SensitiveDataContent />}
            {activeTermsType === 'ai-analysis' && <AIAnalysisContent />}
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
    </div>
  );
}

// SettingSection Component
interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col gap-2">
        <Text size={isMobile ? '4' : '3'} weight="bold">
          {title}
        </Text>
        <Separator orientation="horizontal" size="4" />
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

// SettingField Component
interface SettingFieldProps {
  label: string;
  value: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'tel'
    | 'search'
    | 'hidden';
  readOnly?: boolean;
}

function SettingField({ label, value, type = 'text', readOnly = true }: SettingFieldProps) {
  const isMobile = useIsMobile();

  return (
    <label className="flex flex-col gap-1">
      <Text as="div" size={isMobile ? '3' : '2'} mb="1" weight="regular">
        {label}
      </Text>
      <TextField.Root
        size={isMobile ? '3' : '2'}
        readOnly={readOnly}
        variant="soft"
        color="gray"
        defaultValue={value}
        type={type}
      />
    </label>
  );
}

// ConsentToggle Component
interface ConsentToggleProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onViewDetails: () => void;
}

function ConsentToggle({
  label,
  description,
  checked,
  disabled = false,
  onCheckedChange,
  onViewDetails,
}: ConsentToggleProps) {
  const isMobile = useIsMobile();

  return (
    <Flex direction="column" gap="2">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1" style={{ flex: 1 }}>
          <Text size={isMobile ? '3' : '2'} weight="medium">
            {label}
          </Text>
          <Text size={isMobile ? '2' : '1'} color="gray">
            {description}
          </Text>
        </Flex>
        <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} size="2" />
      </Flex>
      <Text
        size={isMobile ? '2' : '1'}
        color="blue"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onViewDetails}
      >
        View Details
      </Text>
    </Flex>
  );
}

// SettingAction Component
interface SettingActionProps {
  label: string;
  buttonText: string;
  variant?: 'soft' | 'solid' | 'outline' | 'ghost';
  color?: 'gray' | 'red' | 'blue' | 'green';
  onClick?: () => void;
}

function SettingAction({ label, buttonText, variant = 'soft', color = 'gray', onClick }: SettingActionProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between">
      <Text as="div" size={isMobile ? '3' : '2'} mb="1" weight="regular">
        {label}
      </Text>
      <Button variant={variant} color={color} radius="full" className="!w-[70px]" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
}
