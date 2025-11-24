/**
 * [Navigation type definitions]
 * Types for menu items, links, and user information
 */

import { ReactNode } from 'react';

/** Navigation menu item configuration */
export interface MenuItem {
  /** Navigation path */
  href: string;
  /** Material icon name */
  icon: string;
  /** Display label */
  label: string;
}

/** Link component props for navigation */
export interface LinkProps {
  /** Navigation path */
  href: string;
  /** Link content */
  children: ReactNode;
  /** Enable scroll to top on navigation */
  scroll?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/** User information for navigation display */
export interface NavigationUser {
  /** User display name */
  name: string;
  /** User email address */
  email?: string;
  /** User profile image URL */
  image?: string;
}
