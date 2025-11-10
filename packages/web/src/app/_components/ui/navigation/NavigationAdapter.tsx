'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { ComponentType, forwardRef } from 'react';

import { Navigation, LinkProps as SharedLinkProps } from '@zerogravity/shared/components/ui/navigation';

// Next.js Link wrapper that matches the shared LinkProps interface
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

interface NavigationAdapterProps {
  className?: string;
  background?: boolean;
  border?: boolean;
}

export function NavigationAdapter({ className, background, border }: NavigationAdapterProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const user = session?.user
    ? {
        name: session.user.name ?? 'ZeroGravity User',
        email: session.user.email ?? undefined,
        image: session.user.image ?? undefined,
      }
    : undefined;

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
