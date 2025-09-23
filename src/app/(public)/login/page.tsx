export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">ZeroGravity 로그인</h1>
        <p className="text-sm text-neutral-500">카카오 계정으로 로그인하고 개인 맞춤 무중력 경험을 시작하세요.</p>
      </header>

      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-neutral-600">
          실제 로그인 플로우는 곧 연결됩니다. 임시로는 상단 네비게이션의 “카카오 로그인” 버튼을 통해 세션을 발급받을 수
          있도록 구현할 예정입니다.
        </p>
      </div>
    </section>
  );
}
