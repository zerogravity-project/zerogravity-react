'use client';

import { usePathname } from 'next/navigation';

import { Button, Separator, Text, TextField } from '@radix-ui/themes';
import { signOut, useSession } from 'next-auth/react';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { useIsMobile } from '@zerogravity/shared/hooks';

import { useModal } from './_contexts/ModalContext';
import { Modal } from './Modal';

export function SettingModal() {
  const pathname = usePathname();
  const { closeModal } = useModal();
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name ?? 'ZeroGravity User';
  const email = user?.email ?? 'example@example.com';

  return (
    <Modal modalId="setting" title="Settings" description="Manage your account settings.">
      <button
        className="absolute top-5.5 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] focus:bg-[var(--gray-a3)] focus:outline-none"
        onClick={closeModal}
        aria-label="Close modal"
        type="button"
      >
        <Icon>close</Icon>
      </button>

      <div className="flex flex-col gap-7">
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
              closeModal();
            }}
          />
          <SettingAction label="Delete Account" buttonText="Delete" variant="soft" color="red" />
        </SettingSection>
      </div>
    </Modal>
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
