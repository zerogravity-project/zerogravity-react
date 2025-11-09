'use client';

import { usePathname } from 'next/navigation';

import { Button, Separator, Text, TextField } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';

import { useIsMobile } from '@zerogravity/shared/hooks';

export default function ProfileSettingsPage() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name ?? 'ZeroGravity User';
  const email = user?.email ?? 'example@example.com';

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-7 p-6 md:p-8">
      {/* Profile Settings Section */}
      <SettingSection title="Profile">
        <SettingField label="Display Name" value={displayName} />
        <SettingField label="Email" value={email} type="email" />
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
