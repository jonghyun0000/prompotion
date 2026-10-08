"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Download, House, RotateCcw, Save } from "lucide-react";
import Button from "@/components/Button";
import CopyButton from "@/components/CopyButton";
import { useToast } from "@/context/ToastContext";
import { trackEvent } from "@/lib/analytics";
import {
  DEFAULT_DREAM_HOME_BRIEF,
  DREAM_HOME_OPTIONS,
  buildDreamHomeResult,
  normalizeDreamHomeBrief,
  type DreamHomeBrief,
} from "@/lib/dream-home";

const STORAGE_KEY = "prompotion:dream-home:v1";
const STEPS = ["집의 형태", "생활과 공간", "분위기와 마감", "확인하고 만들기"];

function BoardLayout({ brief }: { brief: DreamHomeBrief }) {
  const levels = brief.homeType === "apartment" ? 1 : { single: 1, two: 2, three: 3 }[brief.floors];
  return (
    <figure className="mt-6 rounded-xl border border-line bg-canvas p-4 sm:p-5" aria-labelledby="board-layout-caption">
      <figcaption id="board-layout-caption" className="text-sm font-semibold">한 장의 보드 구성 안내</figcaption>
      <p className="mt-2 text-xs leading-6 text-muted">아래는 배치 설명이며 실제 생성 이미지나 도면 미리보기가 아닙니다.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        <div className="col-span-2 flex min-h-24 flex-col justify-center border border-line bg-white p-4"><span className="font-semibold">01 · 외관</span><span className="mt-1 text-xs leading-5 text-muted">주거 형태와 마당·발코니·테라스 조건</span></div>
        <div className="col-span-2 flex min-h-24 flex-col justify-center border border-line bg-white p-4 md:col-span-1 md:row-span-2"><span className="font-semibold">04 · 개념 평면도</span><span className="mt-1 text-xs leading-5 text-muted">{levels === 1 ? "한 층의 공간 구성" : `${levels}개 층별 공간 구성`} · 축척 없음</span><span className="mt-1 text-xs leading-5 text-muted">집 전체 희망 조건: {brief.bedrooms === 0 ? "별도 침실 없음" : `침실 ${brief.bedrooms}개`} · 욕실 {brief.bathrooms}개</span></div>
        <div className="flex min-h-24 flex-col justify-center border border-line bg-white p-4"><span className="font-semibold">02 · 거실</span><span className="mt-1 text-xs leading-5 text-muted">주방 연결과 바닥·벽 마감</span></div>
        <div className="flex min-h-24 flex-col justify-center border border-line bg-white p-4"><span className="font-semibold">03 · {brief.bedrooms === 0 ? "수면 공간" : "침실"}</span><span className="mt-1 text-xs leading-5 text-muted">같은 집의 분위기와 재료</span></div>
        <div className="col-span-2 border border-line bg-white p-4 md:col-span-3"><span className="font-semibold">05 · 재료·색상 팔레트와 요구사항</span><p className="mt-1 text-xs leading-5 text-muted">선택 조건과 ‘상담용 개념도 · 시공용 아님’ 표시</p></div>
      </div>
      <p className="mt-4 text-xs leading-6 text-muted">AI가 방 수나 문·창·계단을 잘못 그릴 수 있습니다. 결과와 선택 조건을 대조하고, 치수와 구조가 검증된 도면으로 사용하지 마세요.</p>
    </figure>
  );
}

type Choice = { id: string; label: string; description: string; swatch?: string };
type SingleChoiceKey = Exclude<keyof typeof DREAM_HOME_OPTIONS, "priorities">;

function ChoiceQuestion({
  name,
  title,
  description,
  choices,
  value,
  onChange,
}: {
  name: string;
  title: string;
  description?: string;
  choices: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-lg font-semibold tracking-tight">{title}</legend>
      {description && <p className="mt-2 text-sm leading-6 text-muted">{description}</p>}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {choices.map((choice) => (
          <label key={choice.id} className="relative cursor-pointer">
            <input
              className="peer sr-only"
              type="radio"
              name={name}
              value={choice.id}
              checked={value === choice.id}
              onChange={() => onChange(choice.id)}
            />
            <span className="flex h-full min-h-24 gap-3 rounded-xl border border-line bg-surface p-4 transition-colors peer-checked:border-ink peer-checked:bg-canvas peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#345d4c]">
              {choice.swatch && (
                <span
                  aria-hidden="true"
                  className="mt-1 h-9 w-9 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: choice.swatch }}
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{choice.label}</span>
                <span className="mt-1 block text-xs leading-5 text-muted">{choice.description}</span>
              </span>
              <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line">
                {value === choice.id && <Check size={13} />}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Summary({ brief }: { brief: DreamHomeBrief }) {
  const { summary } = buildDreamHomeResult(brief);
  return (
    <dl className="divide-y divide-line text-sm">
      {summary.map((item) => (
        <div key={item.label} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 py-3">
          <dt className="text-muted">{item.label}</dt>
          <dd className="break-words font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DreamHomeBuilder() {
  const { showToast } = useToast();
  const [brief, setBrief] = useState<DreamHomeBrief>(() => ({ ...DEFAULT_DREAM_HOME_BRIEF, priorities: [] }));
  const [step, setStep] = useState(0);
  const [generatedBrief, setGeneratedBrief] = useState<DreamHomeBrief | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const result = generatedBrief ? buildDreamHomeResult(generatedBrief) : null;
  const activePrompt = result?.boardPrompt ?? "";

  const focusHeading = (target: "step" | "result") => {
    requestAnimationFrame(() => {
      const heading = target === "step" ? stepHeading.current : resultHeading.current;
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  };

  const update = <K extends keyof DreamHomeBrief>(key: K, value: DreamHomeBrief[K]) => {
    const next = normalizeDreamHomeBrief({ ...brief, [key]: value });
    setBrief(next);
    setGeneratedBrief(null);
    setError("");
    setNotice(
      key === "homeType" && value === "apartment" && brief.homeType !== "apartment"
        ? "아파트는 한 층 세대로 구상하도록 설정했어요. 건물 전체가 1층이라는 뜻은 아닙니다." + (brief.outdoor === "garden" ? " 개인 마당은 이 버전에서 다루지 않아 외부 공간을 발코니로 바꿨어요." : "")
        : "",
    );
  };

  const goToStep = (next: number) => {
    setStep(next);
    setError("");
    trackEvent("dream_home_step_viewed", { step: next + 1 });
    focusHeading("step");
  };

  const saveDraft = () => {
    setError("");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, brief }));
      setNotice("현재 답변을 이 브라우저에 저장했어요. ‘저장한 답변 불러오기’로 다시 이어갈 수 있습니다.");
      showToast("내 집 답변을 저장했습니다.");
      trackEvent("dream_home_saved", { homeType: brief.homeType });
    } catch {
      setError("이 브라우저에 저장하지 못했어요. 프롬프트를 만든 뒤 텍스트 파일로 내려받아 보관해주세요.");
    }
  };

  const restoreDraft = () => {
    setError("");
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setNotice("이 브라우저에 저장한 내 집 답변이 아직 없어요.");
        return;
      }
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || !("version" in parsed) || parsed.version !== 1 || !("brief" in parsed) || !parsed.brief || typeof parsed.brief !== "object" || Array.isArray(parsed.brief)) {
        throw new Error("Invalid saved home brief");
      }
      if (!window.confirm("현재 입력한 답변을 저장한 답변으로 바꿀까요?")) return;
      setBrief(normalizeDreamHomeBrief(parsed.brief));
      setGeneratedBrief(null);
      setStep(0);
      setNotice("저장한 답변을 불러왔어요. 내용을 확인하고 프롬프트를 다시 만들 수 있습니다.");
      focusHeading("step");
    } catch {
      setError("저장한 답변을 불러오지 못했어요. 현재 답변으로 계속 진행할 수 있습니다.");
    }
  };

  const reset = () => {
    if (!window.confirm("현재 답변과 이 기능에 저장한 답변을 초기화할까요? 기존 건축 프롬프트 보관함은 그대로 유지됩니다.")) return;
    setBrief({ ...DEFAULT_DREAM_HOME_BRIEF, priorities: [] });
    setGeneratedBrief(null);
    setStep(0);
    setNotice("처음의 예시 선택으로 돌아왔어요. 원하는 조건으로 바꿔주세요.");
    setError("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setError("화면의 답변은 초기화했지만, 브라우저에 저장한 답변은 삭제하지 못했어요.");
    }
    trackEvent("reset", { flow: "dream-home" });
    focusHeading("step");
  };

  const generate = () => {
    setError("");
    try {
      const normalized = normalizeDreamHomeBrief(brief);
      const next = buildDreamHomeResult(normalized);
      if (!next.boardPrompt || !next.briefText) throw new Error("Empty home prompt");
      setGeneratedBrief(normalized);
      trackEvent("dream_home_generated", { homeType: normalized.homeType, output: "board", promptLength: next.boardPrompt.length });
      focusHeading("result");
    } catch (failure) {
      if (process.env.NODE_ENV === "development") console.error("Dream home generation failed", failure);
      setError("프롬프트를 만들지 못했어요. 답변을 확인하고 다시 시도해주세요.");
    }
  };

  const download = () => {
    if (!result) return;
    setError("");
    let url: string | undefined;
    try {
      const text = [
        "PromPotion — 내가 원하는 집",
        result.briefText,
        `Architectural Presentation Board · 통합 보드용 프롬프트\n${result.boardPrompt}`,
        "이 문서는 취향과 공간 요구를 정리한 구상용 자료입니다. 실제 설계도, 치수, 시공 가능성을 보장하지 않습니다. 이미지는 외부 생성형 AI에서 별도로 생성합니다.",
      ].join("\n\n");
      url = URL.createObjectURL(new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "prompotion-my-home.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      trackEvent("dream_home_downloaded", { output: "board", promptCount: 1 });
    } catch {
      setError("파일을 내려받지 못했어요. 프롬프트를 직접 복사해 보관해주세요.");
    } finally {
      if (url) {
        const downloadUrl = url;
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      }
    }
  };

  const select = (key: SingleChoiceKey, title: string, description?: string, choices?: readonly Choice[]) => (
    <ChoiceQuestion
      name={key}
      title={title}
      description={description}
      choices={choices || DREAM_HOME_OPTIONS[key]}
      value={String(brief[key])}
      onChange={(value) => update(key, value as DreamHomeBrief[SingleChoiceKey])}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      <header className="max-w-3xl pb-8 pt-10 sm:pt-14">
        <p className="mb-4 flex items-center gap-2 text-xs tracking-[0.14em] text-muted"><House size={16} aria-hidden="true" /> MY HOME BRIEF</p>
        <h1 className="break-keep text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">내가 원하는 집 만들기</h1>
        <p className="mt-4 text-base leading-7 text-muted">어떤 집에서, 어떻게 살고 싶나요? 쉬운 질문에 답하면 외관·거실·침실·개념 평면도를 한 장에 담는 설계 상담용 보드 프롬프트를 정리해드려요.</p>
        <p className="mt-3 text-sm leading-6 text-muted">가입·API 키 없이 사용합니다. 여기서는 프롬프트를 만들며, 이미지는 외부 AI에서 별도로 생성해요.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 border-y border-line py-4">
        <Button type="button" variant="secondary" onClick={saveDraft}><Save size={15} aria-hidden="true" /> 답변 저장</Button>
        <Button type="button" variant="ghost" onClick={restoreDraft}>저장한 답변 불러오기</Button>
        <Button type="button" variant="ghost" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> 처음부터</Button>
        <span className="w-full text-xs leading-5 text-muted">답변 저장은 이 브라우저에만 적용됩니다. 다른 기기와 자동으로 공유되지 않아요.</span>
      </div>

      <div aria-live="polite" aria-atomic="true">{notice && <p className="mb-5 rounded-lg border border-line bg-white p-4 text-sm leading-6">{notice}</p>}</div>
      {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p>}

      <nav aria-label="내 집 질문 단계" className="mb-8">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button type="button" onClick={() => goToStep(index)} aria-current={step === index ? "step" : undefined} className={`flex min-h-12 w-full items-center gap-2 rounded-lg px-3 text-left text-xs sm:text-sm ${step === index ? "bg-ink text-white" : "bg-white text-muted hover:text-ink"}`}>
                <span aria-hidden="true" className="tabular-nums">0{index + 1}</span>{label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-8" aria-labelledby="home-step-title">
          <p className="mb-2 text-xs text-muted">질문 {step + 1} / {STEPS.length}</p>
          <h2 id="home-step-title" ref={stepHeading} tabIndex={-1} className="scroll-mt-36 text-2xl font-semibold tracking-tight">{STEPS[step]}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">선택된 값은 시작을 위한 예시예요. 원하는 조건으로 바꿔주세요.</p>

          <div className="mt-8 space-y-9">
            {step === 0 && (
              <>
                {select("homeType", "어떤 집을 원하세요?")}
                {select("area", "집의 크기는 어느 정도인가요?", "대략적인 느낌만 골라도 괜찮아요. 실제 면적이나 치수를 계산하지는 않습니다.")}
                {brief.homeType !== "apartment" && select("floors", "몇 층으로 생각하고 있나요?", "건물 전체가 아닌, 내가 사용하는 주택의 층수를 골라주세요.")}
                {select("outdoor", "어떤 외부 공간이 있으면 좋을까요?", brief.homeType === "apartment" ? "아파트는 발코니 또는 테라스 중심으로 구상합니다. 개인 마당은 이 버전에서 다루지 않아요." : "마당이나 테라스도 집의 요구사항에 함께 담아요.", DREAM_HOME_OPTIONS.outdoor.filter((item) => brief.homeType !== "apartment" || item.id !== "garden"))}
              </>
            )}
            {step === 1 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block" htmlFor="home-bedrooms">
                    <span className="block text-lg font-semibold">침실은 몇 개 필요하세요?</span>
                    <span id="bedrooms-help" className="mt-2 block text-sm leading-6 text-muted">거실은 제외해요. 원룸은 0개를 선택하세요.</span>
                    <select id="home-bedrooms" aria-describedby="bedrooms-help" value={brief.bedrooms} onChange={(event) => update("bedrooms", Number(event.target.value))} className="mt-3 min-h-12 w-full rounded-lg border border-line bg-canvas px-3 text-base">
                      {[0, 1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count === 0 ? "0개 · 원룸" : `${count}개`}</option>)}
                    </select>
                  </label>
                  <label className="block" htmlFor="home-bathrooms">
                    <span className="block text-lg font-semibold">욕실은 몇 개 필요하세요?</span>
                    <span id="bathrooms-help" className="mt-2 block text-sm leading-6 text-muted">화장실을 포함한 전체 욕실 수예요.</span>
                    <select id="home-bathrooms" aria-describedby="bathrooms-help" value={brief.bathrooms} onChange={(event) => update("bathrooms", Number(event.target.value))} className="mt-3 min-h-12 w-full rounded-lg border border-line bg-canvas px-3 text-base">
                      {[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count}개</option>)}
                    </select>
                  </label>
                </div>
                {select("living", "거실과 주방은 어떻게 연결할까요?")}
                <fieldset>
                  <legend className="text-lg font-semibold">집에서 중요한 생활은 무엇인가요?</legend>
                  <p className="mt-2 text-sm text-muted">해당하는 것만 여러 개 고르거나, 건너뛰어도 괜찮아요.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {DREAM_HOME_OPTIONS.priorities.map((option) => (
                      <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-line p-4">
                        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#1a1a1a]" checked={brief.priorities.includes(option.id)} onChange={(event) => update("priorities", event.target.checked ? [...brief.priorities, option.id] : brief.priorities.filter((id) => id !== option.id))} />
                        <span><span className="block text-sm font-semibold">{option.label}</span><span className="mt-1 block text-xs leading-5 text-muted">{option.description}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
            {step === 2 && (
              <>
                {select("mood", "어떤 분위기를 좋아하세요?")}
                {select("floorMaterial", "바닥은 어떤 재료가 좋을까요?", "장판, 마루, 타일의 재료와 색을 따로 정해요.")}
                {select("floorColor", "바닥 색은 무엇으로 할까요?", "색상은 화면에서 보는 참고용이며 실제 자재 색과 다를 수 있어요.")}
                {select("wallColor", "벽은 어떤 색이면 좋을까요?")}
                {select("lighting", "어떤 빛에서 보고 싶으세요?")}
              </>
            )}
            {step === 3 && (
              <>
                <Summary brief={brief} />
                <div className="rounded-xl bg-canvas p-5 text-sm leading-7">
                  <h3 className="font-semibold">결과는 이렇게 나와요</h3>
                  <p className="mt-2">외관·거실·침실·개념 평면도·재료 팔레트를 한 장에 담는 Architectural Presentation Board 통합 프롬프트 하나를 만듭니다. 별도로 장면을 고를 필요 없이, 모든 답변이 하나의 보드 구성에 반영됩니다.</p>
                  <p className="mt-2 text-muted">건축사무소에 원하는 집을 설명하는 상담용 자료입니다. 평면도는 축척 없는 개념도이며, 방 수와 이미지 간 일치나 설계·시공 가능성을 보장하지 않아요.</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-line pt-6">
            <Button type="button" variant="secondary" onClick={() => goToStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} aria-hidden="true" /> 이전</Button>
            {step < 3 ? (
              <Button type="button" onClick={() => goToStep(step + 1)}>다음 질문 <ArrowRight size={16} aria-hidden="true" /></Button>
            ) : (
              <Button type="button" onClick={generate}>통합 보드 프롬프트 만들기 <ArrowRight size={16} aria-hidden="true" /></Button>
            )}
          </div>
        </section>

        <aside className="min-w-0 rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24" aria-label="내 집 선택 요약">
          <h2 className="text-base font-semibold">지금 구상하는 집</h2>
          <Summary brief={brief} />
          <p className="mt-4 border-t border-line pt-4 text-xs leading-6 text-muted">이 기능은 원하는 집을 상상하고 설명하기 위한 도구입니다. 주소나 연락처는 입력하지 않아요.</p>
        </aside>
      </div>

      {result && (
        <section className="mt-10 min-w-0 rounded-2xl border border-line bg-white p-5 sm:p-8" aria-labelledby="home-result-title">
          <p className="mb-2 text-xs tracking-wider text-muted">YOUR HOME BRIEF</p>
          <h2 id="home-result-title" ref={resultHeading} tabIndex={-1} className="scroll-mt-36 break-keep text-2xl font-semibold tracking-tight">Architectural Presentation Board 통합 프롬프트</h2>
          <p className="mt-3 text-sm leading-7 text-muted">외관·거실·침실·개념 평면도·재료 팔레트를 한 장에 담도록 구성했습니다. 아래 프롬프트 전체를 한 번 복사해 이미지 생성 AI에 붙여넣으세요. 이미지는 아직 생성하지 않았어요.</p>

          <details className="mt-6 rounded-lg border border-line p-4">
            <summary className="py-1 text-sm font-semibold">한국어 요구사항 요약 보기</summary>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{result.briefText}</p>
          </details>
          {generatedBrief && <BoardLayout brief={generatedBrief} />}
          <label htmlFor="home-final-prompt" className="mt-6 block text-sm font-semibold">한 장의 보드용 통합 프롬프트</label>
          <p id="home-prompt-help" className="mt-2 text-xs leading-6 text-muted">모든 장면과 개념 평면도를 포함하는 하나의 프롬프트입니다. 외부 AI와 설정에 따라 결과가 달라집니다.</p>
          <textarea id="home-final-prompt" lang="en" aria-describedby="home-prompt-help" readOnly value={activePrompt} rows={11} spellCheck={false} className="mt-3 w-full min-w-0 resize-y rounded-lg border border-line bg-canvas p-4 text-sm leading-7 text-ink" />
          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
            <CopyButton key={activePrompt} text={activePrompt} />
            <Button type="button" variant="secondary" onClick={download}><Download size={16} aria-hidden="true" /> 전체 내용 내려받기</Button>
          </div>
          {result.warnings.length > 0 && <ul className="mt-6 list-disc space-y-1 pl-5 text-xs leading-6 text-muted">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
          <div className="mt-7 border-t border-line pt-5 text-sm leading-7">
            <p className="font-semibold">실제 집을 계획하고 있다면</p>
            <p className="mt-1 text-muted">생성한 보드와 한국어 요구사항을 함께 가져가 상담을 시작하세요. 이 이미지로 바로 시공할 수는 없습니다. 실제 대지·기존 도면, 면적·예산을 확인하고 건축사의 설계, 구조·설비와 인허가 검토를 거쳐야 합니다.</p>
            <Link href="/select" className="mt-3 inline-block underline underline-offset-4">건축 요소를 더 세밀하게 고르고 싶어요</Link>
          </div>
        </section>
      )}
    </div>
  );
}
