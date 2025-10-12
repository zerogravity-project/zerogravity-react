import DailyEmotionSection from './sections/daily-emotion/DailyEmotionSection';
import HeaderSection from './sections/header/HeaderSection';
import MomentEmotionSection from './sections/moment-emotion/MomentEmotionSection';

export default function MobileCalendar() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center bg-[var(--background-dark)]">
        <HeaderSection />
        <DailyEmotionSection />
      </div>
      <MomentEmotionSection />
    </div>
  );
}
