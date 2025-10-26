import { redirect } from 'next/navigation';

import { ReactNode } from 'react';

import { auth } from '../../lib/auth';

/**
 * Protected layout with Auth.js v5
 * Redirects to login if user is not authenticated
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
