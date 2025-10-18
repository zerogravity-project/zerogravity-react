import { Dialog } from '@radix-ui/themes';

import { useIsMobile } from '@/app/_hooks/useMediaQuery';

interface ModalHeaderProps {
  title: string;
  description?: string;
}

export function ModalHeader({ title, description }: ModalHeaderProps) {
  const isMobile = useIsMobile();

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
