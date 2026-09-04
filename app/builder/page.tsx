"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import FinalPromptModal from "@/components/FinalPromptModal";
import OptionCategoryCard from "@/components/OptionCategoryCard";
import ProgressNavigation from "@/components/ProgressNavigation";
import { useSelection } from "@/context/SelectionContext";
import {
  buildFinalPrompt,
  buildPromptBreakdown,
  getCategoriesForImageType,
  getImageType,
  getProgress,
  getSelectedOption,
  isComplete,
} from "@/lib/prompt";

/** Page 3 — Prompt Builder (선택 현황을 모아 보는 중심 페이지) */
export default function PromptBuilderPage() {
  const router = useRouter();
  const { selection, hydrated } = useSelection();
  const [resultOpen, setResultOpen] = useState(false);

  const imageType = getImageType(selection.selectedImageType);
  const categories = useMemo(
    () => getCategoriesForImageType(selection.selectedImageType),
    [selection.selectedImageType],
  );
  const progress = getProgress(selection);
  const complete = isComplete(selection);
  const remaining = progress.total - progress.done;

  // 이미지 종류를 고르지 않고 직접 들어온 경우 선택 페이지로 보낸다.
  useEffect(() => {
    if (hydrated && !imageType) router.replace("/select");
  }, [hydrated, imageType, router]);

  if (!hydrated || !imageType) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-sm text-muted sm:px-8">불러오는 중...</div>
    );
  }

  const percent = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100);

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-5 pb-40 sm:px-8">
      <div className="flex flex-col gap-6 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/select"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            이미지 종류 변경
          </Link>
          <ProgressNavigation current="prompt" />
        </div>

        <Breadcrumb items={[imageType.name, "프롬프트 구성"]} />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {imageType.name} 프롬프트 구성
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            각 항목을 눌러 Before / After 를 비교하고 원하는 표현을 선택하세요.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">
              {progress.done} / {progress.total} 옵션 선택 완료
            </span>
            <span className="tabular-nums text-subtle">{percent}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-ink transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <OptionCategoryCard
            key={category.id}
            category={category}
            selectedOption={getSelectedOption(category, selection)}
            onOpen={(categoryId) => router.push(`/builder/${categoryId}`)}
          />
        ))}
      </div>

      {/* 하단 고정 영역 */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-muted">
            {complete
              ? "모든 옵션을 선택했습니다."
              : `${remaining}개의 옵션이 남았습니다.`}
          </p>
          <Button
            size="lg"
            disabled={!complete}
            onClick={() => setResultOpen(true)}
            className="w-full sm:w-auto"
          >
            프롬프트 받기
          </Button>
        </div>
      </div>

      <FinalPromptModal
        open={resultOpen}
        imageTypeName={imageType.name}
        finalPrompt={buildFinalPrompt(selection)}
        breakdown={buildPromptBreakdown(selection)}
        onClose={() => setResultOpen(false)}
      />
    </div>
  );
}
