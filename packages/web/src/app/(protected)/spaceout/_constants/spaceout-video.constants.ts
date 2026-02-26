/**
 * [Spaceout video constants]
 * Type definitions and CDN path for spaceout video player
 */

import { CDN_BASE_URL } from '@zerogravity/shared/config';

/**
 * ============================================
 * Type Definitions
 * ============================================
 */

export interface SpaceoutVideoItem {
  /** Video filename (stored under CDN /videos/ directory) */
  filename: string;
  /** Accessibility description for screen readers */
  description: string;
}

/**
 * ============================================
 * Constants
 * ============================================
 */

/** CDN video base path */
export const VIDEO_BASE_URL = `${CDN_BASE_URL}/videos`;

/** Maximum number of videos to play per session */
export const MAX_VIDEOS = 5;

/** CDN video manifest URL */
export const VIDEO_MANIFEST_URL = `${VIDEO_BASE_URL}/manifest.json`;
