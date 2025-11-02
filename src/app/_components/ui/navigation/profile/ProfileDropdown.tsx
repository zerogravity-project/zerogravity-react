import { UrlObject } from 'url';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, Button, DropdownMenu, Text } from '@radix-ui/themes';

import { MENU_ITEMS } from '@/app/_components/ui/menu/_constants/menu.constants';
import { cn } from '@/app/_utils/styleUtils';

import { Icon } from '../../icon';

interface ProfileDropdownProps {
  userName: string;
  profileImage?: string;
  className?: string;
}

export default function ProfileDropdown({ userName, profileImage, className }: ProfileDropdownProps) {
  const pathname = usePathname();

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
          {MENU_ITEMS.profile.map(item => (
            <ProfileDropdownItem key={item.href} href={{ pathname: item.href }} icon={item.icon} label={item.label} />
          ))}
          <DropdownMenu.Separator />
          <ProfileDropdownItem href={{ pathname, hash: 'setting' }} label="Setting" icon="settings" className="!mb-1" />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}

interface ProfileDropdownItemProps {
  label: string;
  href: string | UrlObject;
  icon?: string;
  onClick?: () => void;
  className?: string;
}

function ProfileDropdownItem({ href, icon, label, onClick, className }: ProfileDropdownItemProps) {
  const hasHash = typeof href === 'string' ? href.includes('#') : (href as UrlObject).hash;

  return (
    <Link href={href} onClick={onClick} scroll={hasHash ? false : true}>
      <DropdownMenu.Item className={cn('!cursor-pointer', className)}>
        <Icon size={20}>{icon}</Icon> {label}
      </DropdownMenu.Item>
    </Link>
  );
}
