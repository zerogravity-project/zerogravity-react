'use client';

import { useIsMobile } from '@/app/_hooks/useMediaQuery';

import { CalendarProvider } from './_contexts/CalendarContext';
import DesktopCalendar from './desktop/DesktopCalendar';
import MobileCalendar from './mobile/MobileCalendar';

export default function Calendar() {
  const isMobile = useIsMobile();

  return <CalendarProvider>{isMobile ? <MobileCalendar /> : <DesktopCalendar />}</CalendarProvider>;
}
