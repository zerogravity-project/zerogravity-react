'use client';

import { ReactNode } from 'react';

import { useIsLg } from '@zerogravity/shared/hooks';

import { DesktopMenu } from '@/app/_components/ui/menu/desktop/DesktopMenu';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ProfileLayoutClientProps {
  children: ReactNode;
}

/**
 * ============================================
 * Component
 * ============================================
 */

/**
 * Profile layout client component
 * Handles responsive menu rendering
 * Desktop: Side menu + content
 * Mobile: Content only (menu is in Navigation drawer)
 */
export function ProfileLayoutClient({ children }: ProfileLayoutClientProps) {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isLg = useIsLg();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return (
    <div className="pt-topnav-height flex h-[100dvh] w-[100dvw]">
      {!isLg && (
        <div className="flex h-full w-[256px] flex-shrink-0">
          <DesktopMenu className="border-r border-[var(--gray-3)]" />
        </div>
      )}
      {children}
    </div>
  );
}
