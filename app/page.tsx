import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Page 1 — 서비스 소개 */
export default function HomePage() {
  const steps = [
    {
      index: "STEP 01",
      title: "이미지 종류 선택",
      description: "투시도, 조감도, 다이어그램 등 만들고 싶은 이미지를 고릅니다.",
    },
    {
      index: "STEP 02",
      title: "옵션별 프롬프트 비교",
      description: "각 프롬프트가 결과를 어떻게 바꾸는지 Before / After 로 확인합니다.",
    },
    {
      index: "STEP 03",
      title: "최종 프롬프트 완성",
      description: "고른 요소들이 하나의 프롬프트로 조합되고, 그대로 복사해 사용합니다.",
    },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-5 sm:px-8">
      <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
        <p className="text-xs tracking-[0.2em] text-subtle">ARCHITECTURAL PROMPT BUILDER</p>

        <h1 className="max-w-3xl text-4xl leading-[1.2] font-semibold tracking-tight text-ink sm:text-6xl">
          이미지를 보고
          <br />
          프롬프트를 선택하세요.
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          원하는 건축 이미지를 선택하고, Before / After 결과를 비교하며 필요한 요소만 골라
          하나의 프롬프트로 조합해보세요.
        </p>

        <Link
          href="/select"
          className="mt-4 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-medium text-white transition-colors hover:bg-black"
        >
          이미지 종류 선택하기
          <ArrowRight size={18} strokeWidth={1.75} />
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.index} className="flex flex-col gap-3 bg-surface p-7">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-subtle">
              {step.index}
            </span>
            <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
            <p className="text-sm leading-relaxed text-muted">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            프롬프트를 문장이 아니라 요소로 다룹니다.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            긴 영어 문장을 통째로 복사해 고치는 대신, 재질과 조명과 구도를 각각 골라 담습니다.
            어떤 요소가 결과의 어느 부분을 바꾸는지 이미지로 확인하면서 선택하기 때문에,
            프롬프트를 직접 해석할 필요가 없습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
