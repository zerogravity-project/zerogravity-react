import EmotionRecordForm from './_components/EmotionRecordForm';
import { EmotionRecordProvider } from './_contexts/EmotionRecordContext';

export default function RecordPage() {
  return (
    <EmotionRecordProvider>
      <section className="flex h-[calc(100dvh-56px)] flex-col items-center pt-10 sm:pb-20">
        <EmotionRecordForm />
      </section>
    </EmotionRecordProvider>
  );
}
