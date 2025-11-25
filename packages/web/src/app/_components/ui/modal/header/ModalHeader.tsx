import { Dialog } from '@radix-ui/themes';

import { useIsMobile } from '@zerogravity/shared/hooks';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ModalHeaderProps {
  title: string;
  description?: string;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function ModalHeader({ title, description }: ModalHeaderProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <header className="flex w-full flex-col">
      <Dialog.Title size={isMobile ? '6' : '5'}>{title}</Dialog.Title>
      {description && (
        <Dialog.Description size={isMobile ? '3' : '2'} color="gray">
          {description}
        </Dialog.Description>
      )}
    </header>
  );
}
