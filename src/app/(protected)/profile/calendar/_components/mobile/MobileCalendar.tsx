import CalendarHeader from './header/CalendarHeader';
import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

export default function MobileCalendar() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center bg-[var(--background-dark)]">
        <CalendarHeader />
        <DailyEmotionSection />
      </div>
      <MomentEmotionSection />
    </div>
  );
}
