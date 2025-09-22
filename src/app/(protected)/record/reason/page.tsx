export default function RecordReasonPage() {
  return (
    <section className="space-y-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">기록 · 쉬고 싶은 이유</h1>
      <p className="text-sm text-neutral-600">
        쉬고 싶은 이유, 피하고 싶은 것들을 체크리스트나 선택형으로 입력받는 공간입니다. Validation 로직은 server actions와
        연동할 계획입니다.
      </p>
    </section>
  );
}
