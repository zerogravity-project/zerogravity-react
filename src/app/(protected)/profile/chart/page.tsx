export default function ProfileChartPage() {
  return (
    <section className="space-y-4 px-6 py-10">
      <h1 className="text-2xl font-semibold">프로필 · 차트</h1>
      <p className="text-sm text-neutral-600">
        통계, 시간당 집중도, 감정 추이를 차트로 렌더링할 페이지입니다. Chart.js 연동 시 서버 데이터 fetch 로직을 이곳에
        추가하세요.
      </p>
    </section>
  );
}
