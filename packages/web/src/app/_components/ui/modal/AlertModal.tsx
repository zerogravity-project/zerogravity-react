'use client';

import { Button, Dialog, Flex } from '@radix-ui/themes';

import { AlertModalConfig, useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/**
 * ============================================
 * AlertModal Component
 * ============================================
 * State-based modal with single confirm button
 * Automatically displays from ModalContext queue
 */

export function AlertModal() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentStateModal, closeModal } = useModal();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  /** Check if current modal is an alert type */
  const isAlertModal = currentStateModal?.type === 'alert';

  /** Alert configuration from current modal */
  const config = isAlertModal ? (currentStateModal.config as AlertModalConfig) : null;

  /**
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  /** Handle confirm button click */
  const handleConfirm = () => {
    config?.onConfirm?.();
    closeModal();
  };

  /** Handle dialog close (outside click or ESC key) */
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
  if (!isAlertModal || !config) return null;

  return (
    <Dialog.Root open={isAlertModal} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="500px">
        <div className="flex flex-col gap-8 py-2">
          <ModalHeader title={config.title} description={config.description} />

          <Flex gap="3" justify="end">
            <Button onClick={handleConfirm} size="3">
              {config.confirmText ?? 'OK'}
            </Button>
          </Flex>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
