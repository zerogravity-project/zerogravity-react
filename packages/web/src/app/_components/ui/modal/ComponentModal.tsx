'use client';

import { Dialog } from '@radix-ui/themes';

import { ComponentModalConfig, useModal } from './_contexts/ModalContext';

/*
 * ============================================
 * Constants
 * ============================================
 */
/** Map size to maxWidth */
const MODAL_SIZE_MAP = {
  sm: '400px',
  md: '600px',
  lg: '800px',
};

/*
 * ============================================
 * ComponentModal Component
 * ============================================
 * State-based modal with custom component content
 * Automatically displays from ModalContext queue
 * Child components can use useModal() hook for closeModal access
 */

export function ComponentModal() {
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
  /** Check if current modal is a component type */
  const isComponentModal = currentStateModal?.type === 'component';

  /** Component configuration from current modal */
  const config = isComponentModal ? (currentStateModal.config as ComponentModalConfig) : null;

  /** Map size to maxWidth */
  const maxWidth = config?.size ? MODAL_SIZE_MAP[config.size] : '500px';

  /*
   * --------------------------------------------
   * 3. Event Handlers
   * --------------------------------------------
   */
  /** Handle dialog close (outside click or ESC key) */
  const handleOpenChange = (open: boolean) => {
    // Only close if closeOnOutsideClick is true (default) or not specified
    if (!open && (config?.closeOnOutsideClick ?? true)) {
      closeModal();
    }
  };

  /*
   * --------------------------------------------
   * 4. Return
   * --------------------------------------------
   */
  if (!isComponentModal || !config) return null;

  return (
    <Dialog.Root open={isComponentModal} onOpenChange={handleOpenChange}>
      <Dialog.Content maxWidth={maxWidth}>{config.component}</Dialog.Content>
    </Dialog.Root>
  );
}
