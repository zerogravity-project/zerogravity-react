import { ComponentType } from 'react';

import { Theme } from '@radix-ui/themes';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';

import { cn } from '../../../../utils';
import { useTheme } from '../../../providers';
import { LinkProps, MenuItem, NavigationUser } from '../types/navigation.types';

import { MenuDrawerHeader } from './header/MenuDrawerHeader';
import { MenuList } from './list/MenuList';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MenuDrawerProps {
  isOpen: boolean;
  user?: NavigationUser;
  currentPath: string;
  menuItems: MenuItem[];
  LinkComponent: ComponentType<LinkProps>;
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function MenuDrawer({ isOpen, user, currentPath, menuItems, LinkComponent, className }: MenuDrawerProps) {
  const { accentColor } = useTheme();

  // SSR safety check
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Theme grayColor="slate" accentColor={accentColor} appearance="dark" asChild>
          <motion.nav
            aria-label="Mobile navigation"
            className={cn(
              'top-topnav-height fixed left-0 z-[2000] flex w-[100dvw] flex-col items-center justify-between overflow-hidden bg-[var(--gray-1)] shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
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
          </motion.nav>
        </Theme>
      )}
    </AnimatePresence>,
    document.body
  );
}
