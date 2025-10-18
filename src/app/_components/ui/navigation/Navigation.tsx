'use client';

import Link from 'next/link';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link as RadixLink } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useClock } from '@/app/(public)/_hooks/useClock';
import { useIsMobile } from '@/app/_hooks/useMediaQuery';
import { getDateStringData } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';

import { Icon } from '../icon';
import MobileMenu from '../menu/mobile/MobileMenu';
import { LogoSvg } from '../others';

import ProfileDropdown from './profile/ProfileDropdown';

interface TopNavigationProps {
  className?: string;
  border?: boolean;
}

export default function TopNavigation({ className, border }: TopNavigationProps) {
  const { data: session, status } = useSession();
  const isMobile = useIsMobile();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const now = useClock();
  const dateData = now ? getDateStringData(now) : null;

  const isAuthenticated = status === 'authenticated';
  const userName = session?.user?.name ?? 'ZeroGravity User';
  const profileImage = session?.user?.image ?? undefined;

  return (
    <NavigationMenu.Root
      className={cn(
        'h-topnav-height mobile:p-6 relative z-1000 flex w-full flex-1 items-center justify-between bg-[var(--gray-1)] px-5',
        border && 'border-b border-[var(--gray-3)]',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <RadixLink asChild>
          <Link href="/">
            <LogoSvg />
          </Link>
        </RadixLink>
      </div>

      {/* Date */}
      <div className="flex flex-shrink-0 items-center gap-16">
        <div className="mobile:flex hidden h-8 items-center justify-center overflow-hidden">
          <span className="text-sm leading-[0.9] text-[var(--gray-a10)]">
            {dateData ? dateData.year : '0000'}年 · {dateData ? dateData.month : '00'}月 ·{' '}
            {dateData ? dateData.day : '00'}日 · {dateData ? dateData.weekday : ''}
          </span>
        </div>

        {/* Profile */}
        {!isAuthenticated && (
          <>
            {!isMobile && (
              <ProfileDropdown userName={userName} profileImage={profileImage} className="max-mobile:hidden" />
            )}
            {isMobile && (
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
                <MobileMenu isOpen={isMenuOpen} />
              </>
            )}
          </>
        )}
        {isAuthenticated && (
          <>
            <RadixLink asChild>
              <Link href="/login">
                <div className="flex h-8 items-center justify-center text-sm">Login</div>
              </Link>
            </RadixLink>
          </>
        )}
      </div>
    </NavigationMenu.Root>
  );
}
