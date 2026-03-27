'use client';

import { Button, Dialog } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

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
  const isMobile = useIsMobile();
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
      <Dialog.Content
        maxWidth="480px"
        size={isMobile ? '2' : '3'}
        className="max-mobile:min-h-[200px] max-mobile:!px-5 flex min-h-[220px] flex-col"
      >
        <div className="max-mobile:pt-3 max-mobile:pb-2 flex flex-1 flex-col justify-between pt-2">
          <ModalHeader title={config.title} description={config.description} />

          <div className="max-mobile:w-full flex justify-end gap-3">
            <Button onClick={handleCancel} variant="soft" color="gray" size="3" className="max-mobile:!flex-1">
              {config.cancelText ?? 'Cancel'}
            </Button>
            <Button onClick={handleConfirm} size="3" className="max-mobile:!flex-1">
              {config.confirmText ?? 'OK'}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
