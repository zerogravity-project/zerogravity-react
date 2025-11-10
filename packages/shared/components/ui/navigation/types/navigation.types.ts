import { ReactNode } from 'react';

export interface MenuItem {
  href: string;
  icon: string;
  label: string;
}

export interface LinkProps {
  href: string;
  children: ReactNode;
  scroll?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface NavigationUser {
  name: string;
  email?: string;
  image?: string;
}
