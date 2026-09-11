"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, X, ShoppingBag } from "lucide-react";
import Button from "@/components/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import FinalPromptModal from "@/components/FinalPromptModal";
import { useSelection } from "@/context/SelectionContext";
import { useToast } from "@/context/ToastContext";
import {
  buildFinalPrompt,
  buildPromptBreakdown,
  getCategoriesForImageType,
  getImageType,
} from "@/lib/prompt";
import { trackEvent } from "@/lib/analytics";

export default function PromptBuilderPage() {
  const router = useRouter();
  const { selection, hydrated, selectOption, clearOption, reset } =
    useSelection();
  const { showToast } = useToast();
  const [activeId, setActiveId] = useState("lighting");
  const [resultOpen, setResultOpen] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [compare, setCompare] = useState(false);
  const imageType = getImageType(selection.selectedImageType);
  const categories = useMemo(
    () => getCategoriesForImageType(selection.selectedImageType),
    [selection.selectedImageType],
  );
  const active = categories.find((c) => c.id === activeId) || categories[0];
  const breakdown = buildPromptBreakdown(selection);
  const cartRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (hydrated && !imageType) router.replace("/select");
  }, [hydrated, imageType, router]);
  useEffect(() => {
    if (!active) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            trackEvent("element_viewed", {
              imageType: selection.selectedImageType || "",
              category: active.id,
              element: (entry.target as HTMLElement).dataset.element || "",
            });
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.5 },
    );
    document
      .querySelectorAll("[data-element]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [active, selection.selectedImageType]);
  if (!hydrated || !imageType || !active)
    return <p className="p-12 text-muted">불러오는 중…</p>;
  const generate = () => {
    try {
      const prompt = buildFinalPrompt(selection);
      if (!prompt) {
        showToast("원하는 요소를 하나 이상 선택해주세요.");
        return;
      }
      setFinalPrompt(prompt);
      setResultOpen(true);
      trackEvent("prompt_generated", {
        imageType: imageType.id,
        elementCount: breakdown.length,
        promptLength: prompt.length,
        elements: breakdown.map(
          ({ category, option }) => category.id + ":" + option.id,
        ),
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error(error);
      showToast("프롬프트를 만들지 못했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-7">
        <Link href="/select" className="text-sm text-muted">
          ← 이미지 유형 변경
        </Link>
        <p className="text-xs text-muted">
          01 이미지 유형 / <span className="text-ink">02 요소 조합</span> / 03
          복사
        </p>
      </div>
      <div className="border-b border-line py-7">
        <p className="eyebrow">{imageType.englishName}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {imageType.name} 프롬프트 구성
        </h1>
        <p className="mt-3 text-sm text-muted">
          이미지로 비교하고, 필요한 요소만 담으세요. 모든 항목을 채우지 않아도
          됩니다.
        </p>
      </div>
      <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-10">
        <section className="min-w-0">
          <nav aria-label="요소 카테고리" className="mb-7 flex flex-wrap gap-2">
            {[...categories]
              .sort((a, b) =>
                a.id === "lighting" ? -1 : b.id === "lighting" ? 1 : 0,
              )
              .map((category) => (
                <button
                  key={category.id}
                  aria-pressed={active.id === category.id}
                  onClick={() => {
                    setActiveId(category.id);
                    setCompare(false);
                  }}
                  className={
                    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm " +
                    (active.id === category.id
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-surface hover:border-ink")
                  }
                >
                  {category.name}
                  {selection.selectedOptions[category.id] && (
                    <Check size={13} />
                  )}
                </button>
              ))}
          </nav>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{active.englishName}</p>
              <h2 className="mt-1 text-xl font-semibold">{active.name} 비교</h2>
              <p className="mt-2 text-sm text-muted">{active.description}</p>
            </div>
            <label className="inline-flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
              />
              기준 이미지와 비교
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...active.promptOptions]
              .sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended))
              .map((option) => {
                const selected =
                  selection.selectedOptions[active.id] === option.id;
                return (
                  <article
                    key={active.id + option.id}
                    data-element={option.id}
                    className={
                      "overflow-hidden rounded-xl border bg-surface " +
                      (selected ? "border-ink ring-1 ring-ink" : "border-line")
                    }
                  >
                    {compare && (
                      <div>
                        <p className="px-3 pt-3 text-xs text-muted">
                          기준 · Daylight / Concrete
                        </p>
                        <ImageWithFallback
                          src={option.beforeImage}
                          alt="중립적인 낮의 기준 건축물"
                          className="aspect-[4/3] w-full"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <ImageWithFallback
                        src={option.afterImage}
                        alt={option.title + " — " + option.description}
                        label="이미지를 불러오지 못했습니다"
                        className="aspect-[4/3] w-full"
                      />
                      {option.recommended && (
                        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold">
                          추천 조합
                        </span>
                      )}
                      {selected && (
                        <span className="absolute right-3 top-3 rounded-full bg-ink p-1.5 text-white">
                          <Check size={14} />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{option.title}</h3>
                      <p className="mt-2 min-h-10 text-xs leading-relaxed text-muted">
                        {option.description}
                      </p>
                      <button
                        aria-pressed={selected}
                        aria-label={
                          option.title + (selected ? " 선택 해제" : " 담기")
                        }
                        onClick={() =>
                          selected
                            ? clearOption(active.id)
                            : selectOption(active.id, option.id)
                        }
                        className={
                          "mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm " +
                          (selected
                            ? "border-ink bg-ink text-white"
                            : "border-line hover:border-ink")
                        }
                      >
                        {selected ? <Check size={15} /> : <Plus size={15} />}
                        {selected ? "선택됨 · 해제" : "담기"}
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Preview는 요소 이해를 돕는 AI 생성 예시입니다. 실제 생성 결과는
            사용하는 AI에 따라 달라집니다. 카테고리당 한 요소를 선택하며 새
            선택은 이전 요소를 대체합니다.
          </p>
        </section>
        <aside
          ref={cartRef}
          id="prompt-cart"
          aria-label="Prompt Cart"
          className="scroll-mt-24 self-start rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingBag size={18} />
              Prompt Cart
            </h2>
            <span className="rounded-full bg-canvas px-3 py-1 text-xs">
              {breakdown.length}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted">
            {imageType.name} · {imageType.englishName}
          </p>
          {!breakdown.length ? (
            <div className="my-6 rounded-lg border border-dashed border-line p-6 text-center text-sm leading-6 text-muted">
              마음에 드는 빛부터 골라볼까요?
              <br />
              선택한 요소가 여기에 모입니다.
            </div>
          ) : (
            <ul className="my-5 divide-y divide-line">
              {breakdown.map(({ category, option }) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between gap-2 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted">{category.name}</p>
                    <p className="mt-1 text-sm font-medium">{option.title}</p>
                  </div>
                  <button
                    onClick={() => clearOption(category.id)}
                    aria-label={option.title + " 삭제"}
                    className="rounded-full p-3 hover:bg-canvas"
                  >
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Button
            disabled={!breakdown.length}
            onClick={generate}
            size="lg"
            className="w-full"
          >
            프롬프트 생성
          </Button>
          <button
            onClick={() => {
              reset();
              router.push("/select");
            }}
            className="mt-3 min-h-11 w-full text-xs text-muted"
          >
            ↺ 전체 초기화
          </button>
          <p className="mt-4 border-t border-line pt-4 text-xs leading-5 text-muted">
            생성 후 복사해 이미지 생성 AI에서 사용하세요. 완성된 프롬프트는 내
            프롬프트에 저장할 수 있습니다.
          </p>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-line bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
        <button
          onClick={() => {
            cartRef.current?.scrollIntoView({ behavior: "smooth" });
            trackEvent("cart_opened", { elementCount: breakdown.length });
          }}
          className="inline-flex min-h-11 items-center gap-2 text-sm"
        >
          <ShoppingBag size={17} />
          Cart · {breakdown.length}
        </button>
        <Button disabled={!breakdown.length} onClick={generate}>
          프롬프트 생성
        </Button>
      </div>
      <FinalPromptModal
        key={finalPrompt}
        open={resultOpen}
        imageTypeName={imageType.name}
        finalPrompt={finalPrompt}
        breakdown={breakdown}
        onClose={() => setResultOpen(false)}
      />
    </div>
  );
}
