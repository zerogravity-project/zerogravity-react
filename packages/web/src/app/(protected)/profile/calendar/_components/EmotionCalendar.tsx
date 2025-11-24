'use client';

import { useIsMobile } from '@zerogravity/shared/hooks';

import { CalendarProvider } from '../_contexts/CalendarContext';

import DesktopCalendar from './desktop/DesktopCalendar';
import MobileCalendar from './mobile/MobileCalendar';

/**
 * ============================================
 * Component
 * ============================================
 */

export default function Calendar() {
  /**
   * --------------------------------------------
   * 1. External Hooks
   * --------------------------------------------
   */
  const isMobile = useIsMobile();

  /**
   * --------------------------------------------
   * 2. Return
   * --------------------------------------------
   */
  return <CalendarProvider>{isMobile ? <MobileCalendar /> : <DesktopCalendar />}</CalendarProvider>;
}
