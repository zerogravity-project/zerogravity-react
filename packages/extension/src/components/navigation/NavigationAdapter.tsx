'use client';

import { ComponentType, forwardRef, MouseEvent } from 'react';

import { Navigation, LinkProps as SharedLinkProps } from '@zerogravity/shared/components/ui/navigation';

import { useAuth } from '../../hooks/useAuth';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface NavigationAdapterProps {
  className?: string;
  background?: boolean;
  border?: boolean;
}

/*
 * ============================================
 * Helper Components
 * ============================================
 */

/** Extension Link wrapper that opens links in web app */
const NavigationLink: ComponentType<SharedLinkProps> = forwardRef<HTMLAnchorElement, SharedLinkProps>(
  function NavigationLink({ href, children, onClick, className, ...props }, ref) {
    const webAppUrl = import.meta.env.VITE_WEB_APP_URL as string;

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      // Call original onClick if provided
      if (onClick) {
        onClick();
      }

      // Redirect to web app link in current tab
      if (href === '/') {
        window.location.href = '/';
      } else {
        window.location.href = `${webAppUrl}${href}`;
      }
    };

    return (
      <a {...props} href={`${webAppUrl}${href}`} onClick={handleClick} ref={ref} className={className}>
        {children}
      </a>
    );
  }
);

/*
 * ============================================
 * Component
 * ============================================
 */

export function NavigationAdapter({ className, background, border }: NavigationAdapterProps) {
  /*
   * --------------------------------------------
   * 1. Custom Hooks
   * --------------------------------------------
   */
  const { isAuthenticated, user: authUser } = useAuth();

  /*
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const user = authUser
    ? {
        name: authUser.name ?? 'Zero Gravity User',
        email: authUser.email ?? undefined,
        image: authUser.image ?? undefined,
      }
    : undefined;

  /*
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <Navigation
      isAuthenticated={isAuthenticated}
      user={user}
      currentPath="/newtab" // Extension is a single page
      LinkComponent={NavigationLink}
      background={background}
      border={border}
      className={className}
    />
  );
}
