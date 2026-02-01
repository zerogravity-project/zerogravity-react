/**
 * [AccountActions component]
 * Client component for account actions (logout, delete)
 */
'use client';

import { signOut } from 'next-auth/react';

import { useModal } from '@/app/_components/ui/modal/_contexts/ModalContext';
import { useLogoutMutation } from '@/services/auth/auth.query';
import { useDeleteUserMutation } from '@/services/user/user.query';

import { SettingAction } from './SettingAction';
import { SettingSection } from './SettingSection';

/*
 * ============================================
 * Component
 * ============================================
 */

export function AccountActions() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { openAlertModal, openConfirmModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Query Hooks
   * --------------------------------------------
   */
  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      signOut({ callbackUrl: '/login' });
    },
    onError: error => {
      console.error('[Settings] Failed to logout:', error);
      openAlertModal({
        title: 'Logout Failed',
        description: error.response?.data?.message || 'Failed to logout. Please try again.',
      });
    },
  });

  const { mutate: deleteUser } = useDeleteUserMutation({
    onSuccess: () => {
      signOut({ callbackUrl: '/login' });
    },
    onError: error => {
      console.error('[Settings] Failed to delete user:', error);
      openAlertModal({
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Failed to delete account. Please try again.',
      });
    },
  });

  /*
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */

  /** Handle delete account with confirmation */
  const handleDeleteAccount = () => {
    openConfirmModal({
      title: 'Delete Account',
      description:
        'Are you sure you want to delete your account? All your emotion records and data will be permanently deleted. This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => deleteUser(),
    });
  };

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  return (
    <SettingSection title="Account">
      <SettingAction label="Logout" buttonText="Logout" variant="soft" color="gray" onClick={() => logout()} />
      <SettingAction
        label="Delete Account"
        buttonText="Delete"
        variant="soft"
        color="red"
        onClick={handleDeleteAccount}
      />
    </SettingSection>
  );
}
