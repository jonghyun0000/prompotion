import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "@/components/ImageWithFallback";
import InstallPromotion from "@/components/InstallPromotion";

/** Page 1 — 서비스 소개 */
export default function HomePage() {
  const steps = [
    {
      index: "STEP 01",
      title: "이미지 종류 선택",
      description:
        "투시도, 조감도, 다이어그램 등 만들고 싶은 이미지를 고릅니다.",
    },
    {
      index: "STEP 02",
      title: "옵션별 프롬프트 비교",
      description:
        "각 프롬프트가 결과를 어떻게 바꾸는지 Before / After 로 확인합니다.",
    },
    {
      index: "STEP 03",
      title: "최종 프롬프트 완성",
      description:
        "고른 요소들이 하나의 프롬프트로 조합되고, 그대로 복사해 사용합니다.",
    },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-5 sm:px-8">
      <section className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col items-start gap-6">
          <p className="text-xs tracking-[0.2em] text-subtle">
            ARCHITECTURAL PROMPT BUILDER
          </p>

          <h1 className="max-w-3xl text-4xl leading-[1.3] font-semibold tracking-tight text-ink sm:text-5xl">
            이미지로 고르는
            <br />
            건축 프롬프트.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            빛, 재료, 시점을 이미지로 비교하고 원하는 요소만 담으세요. 영어
            프롬프트를 몰라도 건축 이미지의 방향을 정할 수 있습니다.
          </p>

          <Link
            href="/select"
            className="mt-4 inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-7 text-base font-medium text-white transition-colors hover:bg-black"
          >
            프롬프트 만들기
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
          <p className="text-xs text-muted">
            가입 없이 시작 · 선택 → 조합 → 복사
          </p>
        </div>
        <figure className="overflow-hidden rounded-xl border border-line bg-surface">
          <ImageWithFallback
            src="/images/elements/lighting-golden-hour.webp"
            alt="따뜻한 노을빛을 받은 콘크리트 주택 Preview"
            className="aspect-[4/3] w-full"
          />
          <figcaption className="flex flex-wrap items-center gap-2 p-4 text-xs">
            <span className="mr-auto font-semibold">
              하나의 건물, 내가 고른 표현.
            </span>
            <span className="rounded-full border border-line px-3 py-2">
              Concrete
            </span>
            <span className="rounded-full border border-line px-3 py-2">
              Warm Sunset
            </span>
            <span className="rounded-full border border-line px-3 py-2">
              35mm
            </span>
          </figcaption>
        </figure>
      </section>

      <section className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.index} className="flex flex-col gap-3 bg-surface p-7">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-subtle">
              {step.index}
            </span>
            <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
            <p className="text-sm leading-relaxed text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </section>

      <section
        aria-labelledby="dream-home-heading"
        className="mt-8 grid gap-7 rounded-card border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div className="max-w-2xl">
          <p className="eyebrow">FOR YOUR FUTURE HOME</p>
          <h2
            id="dream-home-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            내가 원하는 집, 질문부터 시작해요.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            주택인지 아파트인지, 방과 욕실은 몇 개인지, 어떤 바닥 색과 분위기를
            좋아하는지 알려주세요. 건축 용어를 몰라도 원하는 집의 조건을 한국어로
            정리하고, 이미지 생성용 영어 프롬프트를 만들 수 있어요.
          </p>
          <p className="mt-3 text-xs leading-6 text-muted">
            가입·API 키 없이 사용 · 이미지는 외부 AI에서 생성 · 실제 설계 도면은
            제공하지 않아요
          </p>
        </div>
        <Link
          href="/dream-home"
          className="inline-flex min-h-13 items-center justify-center gap-3 rounded-full border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
        >
          내가 원하는 집 구상하기
          <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </section>

      <InstallPromotion />

      <section className="py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            프롬프트를 문장이 아니라 요소로 다룹니다.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            긴 영어 문장을 통째로 복사해 고치는 대신, 재질과 조명과 구도를 각각
            골라 담습니다. 어떤 요소가 결과의 어느 부분을 바꾸는지 이미지로
            확인하면서 선택하기 때문에, 프롬프트를 직접 해석할 필요가 없습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
