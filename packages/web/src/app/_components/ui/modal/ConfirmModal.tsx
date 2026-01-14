'use client';

import { Button, Dialog } from '@radix-ui/themes';

import { ConfirmModalConfig, useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/*
 * ============================================
 * ConfirmModal Component
 * ============================================
 * State-based modal with confirm and cancel buttons
 * Automatically displays from ModalContext queue
 */

export function ConfirmModal() {
  /*
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const { currentStateModal, closeModal } = useModal();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  /** Check if current modal is a confirm type */
  const isConfirmModal = currentStateModal?.type === 'confirm';

  /** Confirm configuration from current modal */
  const config = isConfirmModal ? (currentStateModal.config as ConfirmModalConfig) : null;

  /*
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  /** Handle confirm button click */
  const handleConfirm = () => {
    config?.onConfirm();
    closeModal();
  };

  /** Handle cancel button click */
  const handleCancel = () => {
    config?.onCancel?.();
    closeModal();
  };

  /** Handle dialog close (outside click or ESC key) */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      config?.onCancel?.();
      closeModal();
    }
  };

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  if (!isConfirmModal || !config) return null;

  return (
    <Dialog.Root open={isConfirmModal} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth="500px">
        <div className="flex flex-col gap-8 py-2">
          <ModalHeader title={config.title} description={config.description} />

          <div className="flex justify-end gap-3">
            <Button onClick={handleCancel} variant="soft" color="gray" size="3">
              {config.cancelText ?? 'Cancel'}
            </Button>
            <Button onClick={handleConfirm} size="3">
              {config.confirmText ?? 'OK'}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
