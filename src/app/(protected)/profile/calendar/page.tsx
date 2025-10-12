import Calendar from '@/app/(protected)/profile/calendar/_components/EmotionCalendar';

export default function ProfileCalendarPage() {
  return (
    <div className="flex w-[100dvw] sm:h-[calc(100dvh-var(--spacing-topnav-height))]">
      <Calendar />
    </div>
  );
}
