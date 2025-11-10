import { ComponentType } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@zerogravity/shared/utils';

import { LinkProps, MenuItem, NavigationUser } from '../types/navigation.types';

import { MenuDrawerHeader } from './header/MenuDrawerHeader';
import { MenuList } from './list/MenuList';

interface MenuDrawerProps {
  isOpen: boolean;
  user?: NavigationUser;
  currentPath: string;
  menuItems: MenuItem[];
  LinkComponent: ComponentType<LinkProps>;
  className?: string;
}

export function MenuDrawer({ isOpen, user, currentPath, menuItems, LinkComponent, className }: MenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className={cn(
            'top-topnav-height absolute left-0 z-[2000] flex w-[100dvw] flex-col items-center justify-between overflow-hidden bg-[var(--gray-1)]',
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
          <MenuDrawerHeader user={user} />
          <MenuList menuItems={menuItems} currentPath={currentPath} LinkComponent={LinkComponent} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
