import Calendar from '@/app/(protected)/profile/calendar/_components/Calendar';

export default function ProfileCalendarPage() {
  return (
    <section className="flex w-[100dvw] sm:h-[calc(100dvh-var(--spacing-topnav-height))]">
      <div className="h-full w-full bg-[var(--background-dark)] sm:p-3">
        <Calendar />
      </div>
    </section>
  );
}
