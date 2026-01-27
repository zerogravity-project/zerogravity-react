'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import { ComponentType, forwardRef, useCallback, useEffect, useState } from 'react';

import { Navigation, LinkProps as SharedLinkProps } from '@zerogravity/shared/components/ui/navigation';
import { cn } from '@zerogravity/shared/utils';

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

interface NavigationAdapterClientProps {
  /** Session data from server */
  session?: Session | null;
  /** Additional className */
  className?: string;
  /** Show background */
  background?: boolean;
  /** Show border */
  border?: boolean;
}

/**
 * ============================================
 * Component
 * ============================================
 */

/**
 * Client-side navigation wrapper
 * Handles pathname tracking for menu close on navigation
 * Window scroll detection for shadow effect
 * Receives session from server component
 */
export function NavigationAdapterClient({ session, className, background, border }: NavigationAdapterClientProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const pathname = usePathname();

  /**
   * --------------------------------------------
   * 2. States
   * --------------------------------------------
   */
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * --------------------------------------------
   * 3. Derived Values
   * --------------------------------------------
   */
  const isTermsPage = pathname.startsWith('/terms');
  const hasBackground = background || isTermsPage;
  const isAuthenticated = !!session;
  const user = session?.user
    ? {
        name: session.user.name ?? 'ZeroGravity User',
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : undefined;

  /**
   * --------------------------------------------
   * 4. Callbacks
   * --------------------------------------------
   */
  /** Open Sentry feedback form */
  const handleFeedbackClick = useCallback(async () => {
    const feedback = Sentry.getFeedback();
    const form = await feedback?.createForm();
    form?.appendToDom();
    form?.open();
  }, []);

  /**
   * --------------------------------------------
   * 5. Effects
   * --------------------------------------------
   */
  /** Window scroll detection for shadow effect */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * --------------------------------------------
   * 6. Return
   * --------------------------------------------
   */
  return (
    <Navigation
      isAuthenticated={isAuthenticated}
      user={user}
      currentPath={pathname}
      LinkComponent={NextLink}
      onFeedbackClick={handleFeedbackClick}
      background={hasBackground}
      border={border}
      className={cn('fixed top-0', hasBackground && isScrolled && 'shadow-md', className)}
    />
  );
}
