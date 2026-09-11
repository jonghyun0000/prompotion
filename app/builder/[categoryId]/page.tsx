"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ProgressNavigation from "@/components/ProgressNavigation";
import PromptOptionCard from "@/components/PromptOptionCard";
import { useSelection } from "@/context/SelectionContext";
import { getCategory, getImageType, getSelectedOption } from "@/lib/prompt";

/** Page 4 — 옵션별 프롬프트 선택 (Before / After 비교) */
export default function PromptOptionPage() {
  const router = useRouter();
  const params = useParams<{ categoryId: string }>();
  const categoryId = params?.categoryId ?? "";

  const { selection, hydrated, selectOption } = useSelection();

  const imageType = getImageType(selection.selectedImageType);
  const candidate = getCategory(categoryId);
  const category = useMemo(
    () =>
      imageType?.optionCategoryIds.includes(categoryId) && candidate
        ? {
            ...candidate,
            promptOptions: candidate.promptOptions.filter(
              (option) =>
                !option.compatibleTypes ||
                option.compatibleTypes.includes(imageType.id),
            ),
          }
        : undefined,
    [imageType, categoryId, candidate],
  );
  const selectedOption = category
    ? getSelectedOption(category, selection)
    : undefined;

  // 잘못된 경로거나 이미지 종류가 없으면 앞 단계로 되돌린다.
  useEffect(() => {
    if (!hydrated) return;
    if (!imageType) router.replace("/select");
    else if (!category) router.replace("/builder");
  }, [hydrated, imageType, category, router]);

  if (!hydrated || !imageType || !category) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-sm text-muted sm:px-8">
        불러오는 중...
      </div>
    );
  }

  const handleSelect = (optionId: string) => {
    selectOption(category.id, optionId);
    // 선택하면 곧바로 Prompt Builder 로 돌아간다.
    router.push("/builder");
  };

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-5 pb-24 sm:px-8">
      <div className="flex flex-col gap-6 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/builder"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            프롬프트 구성으로
          </Link>
          <ProgressNavigation current="prompt" />
        </div>

        <Breadcrumb
          items={[imageType.name, category.name, selectedOption?.title]}
        />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {category.name} 선택
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Before / After 이미지를 비교하고 원하는 표현을 선택하세요.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {category.promptOptions.map((option) => (
          <PromptOptionCard
            key={option.id}
            option={option}
            selected={selectedOption?.id === option.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
