import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/app/_utils/styleUtils';
import { MENU_ITEMS } from '@/lib/navigation/constants';

import MobileMenuHeader from './header/MobileMenuHeader';
import MobileMenuList from './list/MobileMenuList';

interface MobileMenuProps {
  isOpen: boolean;
  className?: string;
}

export default function MobileMenu({ isOpen, className }: MobileMenuProps) {
  const menuItems = [...MENU_ITEMS.profile];
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className={cn(
            'top-topnav-height absolute left-0 z-1000 flex w-[100dvw] flex-col items-center justify-between overflow-hidden bg-[var(--gray-1)]',
            className
          )}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 300 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            opacity: { duration: 0 },
            height: { duration: 0.3, ease: 'easeInOut' },
          }}
        >
          <MobileMenuHeader />
          <MobileMenuList menuItems={menuItems} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
