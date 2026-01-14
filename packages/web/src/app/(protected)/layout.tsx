import { redirect } from 'next/navigation';

import { ReactNode } from 'react';

import { auth } from '@/lib/auth';

import ClientProviders from '../_components/providers/ClientProviders';

/**
 * Protected layout with Auth.js v5
 * Includes all client providers (Session, Query, Theme, Modal)
 * Redirects to login if user is not authenticated
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <ClientProviders>{children}</ClientProviders>;
}
