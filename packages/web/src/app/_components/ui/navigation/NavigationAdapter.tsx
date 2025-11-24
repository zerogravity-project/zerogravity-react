'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { ComponentType, forwardRef } from 'react';

import { Navigation, LinkProps as SharedLinkProps } from '@zerogravity/shared/components/ui/navigation';

/**
 * ============================================
 * Helper Components
 * ============================================
 */

/** Next.js Link wrapper that matches the shared LinkProps interface */
const NextLink: ComponentType<SharedLinkProps> = forwardRef<HTMLAnchorElement, SharedLinkProps>(function NextLink(
  { href, children, onClick, ...props },
  ref
) {
  return (
    <Link href={href} onClick={onClick} ref={ref} {...props}>
      {children}
    </Link>
  );
});

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface NavigationAdapterProps {
  className?: string;
  background?: boolean;
  border?: boolean;
}

/**
 * ============================================
 * Component
 * ============================================
 */

export function NavigationAdapter({ className, background, border }: NavigationAdapterProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const pathname = usePathname();
  const { data: session, status } = useSession();

  /**
   * --------------------------------------------
   * 2. Derived Values
   * --------------------------------------------
   */
  const isAuthenticated = status === 'authenticated';
  const user = session?.user
    ? {
        name: session.user.name ?? 'ZeroGravity User',
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : undefined;

  /**
   * --------------------------------------------
   * 3. Return
   * --------------------------------------------
   */
  return (
    <Navigation
      isAuthenticated={isAuthenticated}
      user={user}
      currentPath={pathname}
      LinkComponent={NextLink}
      background={background}
      border={border}
      className={className}
    />
  );
}
