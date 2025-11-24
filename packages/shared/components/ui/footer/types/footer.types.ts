/**
 * [Footer type definitions]
 * Types for footer menu items and configuration
 */

/** Footer menu item configuration */
export interface FooterMenuItem {
  /** Display text */
  text: string;
  /** Navigation path */
  linkPath: string;
  /** Default text color */
  defaultColor?: string;
  /** Active state text color */
  activeColor?: string;
}
