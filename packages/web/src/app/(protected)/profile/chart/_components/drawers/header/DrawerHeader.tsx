import { Text } from '@radix-ui/themes';

import { Icon } from '@zerogravity/shared/components/ui/icon';
import { GeminiLogo } from '@zerogravity/shared/components/ui/logo';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface DrawerHeaderProps {
  onClose: () => void;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export default function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <header className="relative flex w-full items-center gap-2 p-4">
      <GeminiLogo width={14} />

      <Text size="3">AI Analysis</Text>

      <button
        onClick={onClose}
        aria-label="Close drawer"
        className="absolute right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] hover:bg-[var(--gray-a3)]"
      >
        <Icon size={20}>close</Icon>
      </button>
    </header>
  );
}
