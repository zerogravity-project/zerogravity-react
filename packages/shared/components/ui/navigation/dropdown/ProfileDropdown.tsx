import { ComponentType } from 'react';

import { Avatar, Button, DropdownMenu, Text } from '@radix-ui/themes';

import { cn } from '../../../../utils';
import { Icon } from '../../icon';
import { LinkProps, MenuItem } from '../types/navigation.types';

/*
 * ============================================
 * Type Definitions
 * ============================================
 */

interface ProfileDropdownProps {
  userName: string;
  profileImage?: string;
  menuItems: MenuItem[];
  LinkComponent: ComponentType<LinkProps>;
  className?: string;
}

interface ProfileDropdownItemProps {
  label: string;
  href: string;
  icon?: string;
  onClick?: () => void;
  className?: string;
  LinkComponent: React.ComponentType<LinkProps>;
}

/*
 * ============================================
 * Component
 * ============================================
 */

export function ProfileDropdown({ userName, profileImage, menuItems, LinkComponent, className }: ProfileDropdownProps) {
  return (
    <div className={cn('flex h-8 w-8 flex-shrink-0 items-center justify-center', className)}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" className="h-8 w-8 !rounded-[9999px] !p-0">
            <Avatar variant="solid" src={profileImage} size="2" fallback={userName.charAt(0)} radius="full" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="mobile:w-[200px]">
          <div className="flex items-center gap-3 px-3 pt-2 pb-2">
            <Avatar variant="solid" src={profileImage} size="2" fallback={userName.charAt(0)} radius="full" />
            <Text size="2">{userName}</Text>
          </div>
          <DropdownMenu.Separator />
          {menuItems.slice(0, -1).map(item => (
            <ProfileDropdownItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              LinkComponent={LinkComponent}
            />
          ))}
          <DropdownMenu.Separator />
          {menuItems.slice(-1).map(item => (
            <ProfileDropdownItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              className="!mb-1"
              LinkComponent={LinkComponent}
            />
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

/*
 * ============================================
 * Helper Components
 * ============================================
 */

function ProfileDropdownItem({ href, icon, label, onClick, className, LinkComponent }: ProfileDropdownItemProps) {
  return (
    <LinkComponent href={href} onClick={onClick}>
      <DropdownMenu.Item className={cn('!cursor-pointer', className)}>
        <Icon size={20}>{icon}</Icon> {label}
      </DropdownMenu.Item>
    </LinkComponent>
  );
}
