'use client';

import { Dialog } from '@radix-ui/themes';

import { useModal } from './_context/ModalContext';
import { ModalHeader } from './header/ModalHeader';

interface ModalProps {
  modalId: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ modalId, title, description, children }: ModalProps) {
  const { isModalOpen, closeModal } = useModal();
  const isOpen = isModalOpen(modalId);

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && closeModal()}>
      <Dialog.Content maxWidth="500px">
        <div className="flex flex-col gap-8 py-2">
          <ModalHeader title={title} description={description} />
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
