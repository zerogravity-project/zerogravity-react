import { auth } from '@/lib/auth';

import { NavigationAdapterClient } from './NavigationAdapter.client';

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

/**
 * Server-side navigation adapter
 * Fetches session on server and passes to client component
 * Eliminates useSession() from client bundle
 */
export async function NavigationAdapter({ className, background, border }: NavigationAdapterProps) {
  const session = await auth();

  return <NavigationAdapterClient session={session} className={className} background={background} border={border} />;
}
