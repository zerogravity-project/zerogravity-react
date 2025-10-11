'use client';

import Image from 'next/image';
import Link from 'next/link';

import * as Avatar from '@radix-ui/react-avatar';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Link as RadixLink } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';

import Icon from '@/app/_components/ui/icon/Icon';
import { useDateTime } from '@/app/_hooks/useDateTime';
import { Color } from '@/app/style/type';
import { cn } from '@/lib/utils';

import { RadixButton } from '../button';
import { LogoSvg } from '../others';

// interface MenuItem {
//   label: string;
//   href: string;
// }

// const MENU_ITEMS: MenuItem[] = [
//   { label: 'Home', href: '/' },
//   { label: 'About', href: '/about' },
// ];

interface TopNavigationProps {
  background?: boolean;
  className?: string;
}

export default function TopNavigation({ background, className }: TopNavigationProps) {
  const { data: session, status } = useSession();
  const { dateData } = useDateTime();

  const isAuthenticated = status === 'authenticated';
  const profileImage = session?.user?.image ?? null;
  const displayName = session?.user?.name ?? 'ZeroGravity User';

  return (
    <NavigationMenu.Root
      className={cn(
        'h-topnav-height relative z-10 flex w-full flex-1 items-center justify-between px-6 sm:px-8',
        background && 'border-b border-[var(--gray-3)] bg-white',
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

        {/* Menu */}
        {/* <NavigationMenu.List className="hidden sm:flex sm:items-center">
          {MENU_ITEMS.map(item => (
            <NavigationMenu.Item key={item.href}>
              <MenuLink href={item.href} label={item.label} color="gray" />
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List> */}
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
        <RadixButton size="2" variant="outline" radius="small" color="gray" className="!pr-1 !pl-1 sm:!hidden">
          <Icon color="blue">menu</Icon>
        </RadixButton>
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
