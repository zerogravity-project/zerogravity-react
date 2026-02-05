import { Dialog } from '@radix-ui/themes';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ModalHeaderProps {
  title: string;
  description?: React.ReactNode;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function ModalHeader({ title, description }: ModalHeaderProps) {
  /*
   * --------------------------------------------
   * 1. Return
   * --------------------------------------------
   */
  return (
    <header className="flex w-full flex-col">
      <Dialog.Title weight="medium" size="5" className="!mb-2">
        {title}
      </Dialog.Title>
      {description && (
        <Dialog.Description size="2" color="gray" className="!leading-normal">
          {description}
        </Dialog.Description>
      )}
    </header>
  );
}
