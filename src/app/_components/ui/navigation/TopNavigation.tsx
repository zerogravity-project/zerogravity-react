'use client';

import Image from 'next/image';
import Link from 'next/link';

import * as Avatar from '@radix-ui/react-avatar';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Button, Link as RadixLink } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

import Icon from '@/app/_components/ui/icon/Icon';
import { useClock } from '@/app/_hooks/useClock';
import { getDateStringData } from '@/app/_utils/dateTimeUtils';
import { cn } from '@/app/_utils/styleUtils';
import { Color } from '@/app/style/type';

import { LogoSvg } from '../others';

interface TopNavigationProps {
  className?: string;
  border?: boolean;
}

export default function TopNavigation({ className, border }: TopNavigationProps) {
  const { data: session, status } = useSession();
  const now = useClock();
  const dateData = now ? getDateStringData(now) : null;

  const isAuthenticated = status === 'authenticated';
  const profileImage = session?.user?.image ?? null;
  const displayName = session?.user?.name ?? 'ZeroGravity User';

  return (
    <NavigationMenu.Root
      className={cn(
        'h-topnav-height relative z-10 flex w-full flex-1 items-center justify-between px-5 sm:px-8',
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
      <div className="flex items-center gap-16">
        <div className="hidden h-8 items-center justify-center overflow-hidden sm:flex">
          <span className="text-sm leading-[0.9] text-[var(--gray-a10)]">
            {dateData ? dateData.year : '0000'}年 · {dateData ? dateData.month : '00'}月 ·{' '}
            {dateData ? dateData.day : '00'}日 · {dateData ? dateData.weekday : ''}
          </span>
        </div>

        {/* Profile */}
        <div className="hidden sm:flex">
          {isAuthenticated && (
            <NavigationMenu.Link href="/profile">
              <Avatar.Root className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full">
                {profileImage && <Image src={profileImage} alt="profile" width={32} height={32} />}
                {!profileImage && <Avatar.Fallback>{displayName.charAt(0)}</Avatar.Fallback>}
              </Avatar.Root>
            </NavigationMenu.Link>
          )}

          {!isAuthenticated && <MenuLink href="/login" label="Login" />}
        </div>

        {/* Hamburger Menu */}
        <Button size="2" variant="outline" radius="small" color="gray" className="!pr-1 !pl-1 sm:!hidden">
          <Icon color="blue">menu</Icon>
        </Button>
      </div>
    </NavigationMenu.Root>
  );
}

export const MenuLink = ({
  href,
  color,
  label,
  className,
}: {
  href: string;
  color?: Color;
  label: string;
  className?: string;
}) => {
  return (
    <RadixLink asChild color={color}>
      <Link href={href}>
        <div className={cn('flex h-8 items-center justify-center px-3 text-sm', className)}>{label}</div>
      </Link>
    </RadixLink>
  );
};
