"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-2xl font-semibold">잠시 문제가 발생했습니다.</h1>
      <p className="my-4 text-muted">
        다시 시도해주세요. 문제가 계속되면 페이지를 새로고침해주세요.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-ink px-6 py-3 text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
