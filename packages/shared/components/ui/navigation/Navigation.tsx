'use client';

import { ComponentType, lazy, Suspense, useEffect, useState } from 'react';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link as RadixLink } from '@radix-ui/themes';

import { useClock, useIsSm } from '../../../hooks';
import { cn, getDateStringData } from '../../../utils';
import { Icon } from '../icon';
import { Logo } from '../logo';

import { MENU_ITEMS } from './constants/navigation.constants';
import { ProfileDropdown } from './dropdown/ProfileDropdown';
import { LinkProps, MenuItem, NavigationUser } from './types/navigation.types';

/** Lazy load MenuDrawer to avoid bundling motion on initial load */
const LazyMenuDrawer = lazy(() => import('./drawer/MenuDrawer').then(mod => ({ default: mod.MenuDrawer })));

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface NavigationProps {
  /** Authentication */
  isAuthenticated: boolean;
  user?: NavigationUser;

  /** Navigation */
  currentPath: string;
  LinkComponent?: ComponentType<LinkProps>;
  menuItems?: MenuItem[];

  /** Callbacks */
  onFeedbackClick?: () => void;

  /** Styling */
  background?: boolean;
  border?: boolean;
  className?: string;
}

/*
 * ============================================
 * Helper Components
 * ============================================
 */

const DefaultLink = ({ href, children, className, ...props }: LinkProps) => (
  <a {...props} href={href} className={className}>
    {children}
  </a>
);

/*
 * ============================================
 * Component
 * ============================================
 */

export function Navigation({
  isAuthenticated,
  user,
  currentPath,
  LinkComponent = DefaultLink,
  menuItems = MENU_ITEMS,
  onFeedbackClick,
  background,
  border,
  className,
}: NavigationProps) {
  /*
   * --------------------------------------------
   * 1. States
   * --------------------------------------------
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /*
   * --------------------------------------------
   * 2. Custom Hooks
   * --------------------------------------------
   */
  const isSm = useIsSm();
  const now = useClock();

  /*
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const dateData = now ? getDateStringData(now) : null;
  const userName = user?.name ?? 'ZeroGravity User';
  const profileImage = user?.image;

  /*
   * --------------------------------------------
   * 4. Effects
   * --------------------------------------------
   */
  /** Close menu when current path changes */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  /** Dispatch custom event when menu opens/closes for external listeners */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('navigation-menu-toggle', { detail: { isOpen: isMenuOpen } }));
    }
  }, [isMenuOpen]);

  /*
   * --------------------------------------------
   * 5. Return
   * --------------------------------------------
   */
  return (
    <header className="contents">
      <NavigationMenu.Root
        className={cn(
          'h-topnav-height relative z-[2000] flex w-full flex-1 items-center justify-between px-5 sm:px-6',
          background && `bg-[var(--gray-1)]`,
          border && 'border-b border-[var(--gray-3)]',
          className
        )}
      >
        <div className="flex items-center gap-4">
          {/* Logo */}
          <RadixLink asChild>
            <LinkComponent href="/" aria-label="ZeroGravity Home">
              <Logo />
            </LinkComponent>
          </RadixLink>
        </div>

        {/* Date */}
        <div className="flex flex-shrink-0 items-center gap-12">
          {dateData && (
            <div className="hidden h-8 items-center justify-center overflow-hidden sm:flex">
              <span className="text-sm leading-[0.9] text-[var(--gray-a10)]">
                {dateData.year} · {dateData.month} · {dateData.day} · {dateData.weekday}
              </span>
            </div>
          )}

          {/* Profile */}
          {isAuthenticated && (
            <>
              {!isSm && (
                <ProfileDropdown
                  userName={userName}
                  profileImage={profileImage}
                  className="max-mobile:hidden"
                  menuItems={menuItems}
                  LinkComponent={LinkComponent}
                  onFeedbackClick={onFeedbackClick}
                />
              )}
              {isSm && (
                <>
                  {/* Hamburger Menu */}
                  <button
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] focus:bg-[var(--gray-a3)] focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    type="button"
                  >
                    <Icon color="accent">{isMenuOpen ? 'close' : 'menu'}</Icon>
                  </button>
                  <Suspense fallback={null}>
                    <LazyMenuDrawer
                      isOpen={isMenuOpen}
                      user={user}
                      currentPath={currentPath}
                      menuItems={menuItems}
                      LinkComponent={LinkComponent}
                      onFeedbackClick={onFeedbackClick}
                    />
                  </Suspense>
                </>
              )}
            </>
          )}
          {!isAuthenticated && (
            <RadixLink asChild>
              <LinkComponent href="/login">
                <div className="flex h-8 items-center justify-center text-sm">Login</div>
              </LinkComponent>
            </RadixLink>
          )}
        </div>
      </NavigationMenu.Root>
    </header>
  );
}
