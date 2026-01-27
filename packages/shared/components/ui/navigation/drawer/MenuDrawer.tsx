import { ComponentType } from 'react';

import { Theme } from '@radix-ui/themes';
import { AnimatePresence, m, Variants } from 'motion/react';
import { createPortal } from 'react-dom';

import { cn } from '../../../../utils';
import { useTheme } from '../../../providers';
import { LinkProps, MenuItem, NavigationUser } from '../types/navigation.types';

import { MenuDrawerHeader } from './header/MenuDrawerHeader';
import { MenuList } from './list/MenuList';

/*
 * ============================================
 * Constants
 * ============================================
 */

/** Drawer animation variants with dynamic exit based on close reason */
const drawerVariants: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: {
    opacity: 1,
    height: 356,
    transition: { opacity: { duration: 0 }, height: { duration: 0.3, ease: 'easeInOut' } },
  },
  exit: (isToggleClose: boolean) => ({
    opacity: 0,
    height: 0,
    transition: isToggleClose
      ? { opacity: { duration: 0, delay: 0.3 }, height: { duration: 0.3, ease: 'easeInOut' } }
      : { opacity: { duration: 0 }, height: { duration: 0.3, ease: 'easeInOut' } },
  }),
};

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface MenuDrawerProps {
  isOpen: boolean;
  /** Whether close was triggered by toggle button (vs navigation) */
  isToggleClose?: boolean;
  /** Called when exit animation completes */
  onExitComplete?: () => void;
  user?: NavigationUser;
  currentPath: string;
  menuItems: MenuItem[];
  LinkComponent: ComponentType<LinkProps>;
  onFeedbackClick?: () => void;
  className?: string;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function MenuDrawer({
  isOpen,
  isToggleClose,
  onExitComplete,
  user,
  currentPath,
  menuItems,
  LinkComponent,
  onFeedbackClick,
  className,
}: MenuDrawerProps) {
  const { accentColor } = useTheme();

  // SSR safety check
  if (typeof document === 'undefined') return null;

  return createPortal(
    <Theme grayColor="slate" accentColor={accentColor} appearance="dark">
      <AnimatePresence custom={isToggleClose} onExitComplete={onExitComplete}>
        {isOpen && (
          <m.nav
            key="menu-drawer"
            aria-label="Mobile navigation"
            className={cn(
              'top-topnav-height fixed left-0 z-[2000] flex w-[100dvw] flex-col items-center justify-between overflow-hidden bg-[var(--gray-1)] shadow-[0_8px_30px_rgba(0,0,0,0.4)]',
              className
            )}
            custom={isToggleClose}
            variants={drawerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MenuDrawerHeader user={user} />
            <MenuList
              menuItems={menuItems}
              currentPath={currentPath}
              LinkComponent={LinkComponent}
              onFeedbackClick={onFeedbackClick}
            />
          </m.nav>
        )}
      </AnimatePresence>
    </Theme>,
    document.body
  );
}
