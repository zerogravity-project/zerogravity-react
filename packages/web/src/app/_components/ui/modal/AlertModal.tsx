'use client';

import { Button, Dialog } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

import { AlertModalConfig, useModal } from './_contexts/ModalContext';
import { ModalHeader } from './header/ModalHeader';

/*
 * ============================================
 * AlertModal Component
 * ============================================
 * State-based modal with single confirm button
 * Automatically displays from ModalContext queue
 */

export function AlertModal() {
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
  /** Check if current modal is an alert type */
  const isAlertModal = currentStateModal?.type === 'alert';

  /** Alert configuration from current modal */
  const config = isAlertModal ? (currentStateModal.config as AlertModalConfig) : null;

  /*
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

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  if (!isAlertModal || !config) return null;

  return (
    <Dialog.Root open={isAlertModal} onOpenChange={handleOpenChange}>
      <Dialog.Content
        maxWidth="480px"
        size={isMobile ? '2' : '3'}
        className="max-mobile:min-h-[200px] max-mobile:!px-5 flex min-h-[220px] flex-col"
      >
        <div className="max-mobile:pt-3 max-mobile:pb-2 flex flex-1 flex-col justify-between pt-2">
          <ModalHeader title={config.title} description={config.description} />

          <div className="max-mobile:w-full flex justify-end gap-3">
            <Button onClick={handleConfirm} size="3" className="max-mobile:!flex-1">
              {config.confirmText ?? 'OK'}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
