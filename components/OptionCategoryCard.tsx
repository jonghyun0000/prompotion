"use client";

import { Check, ChevronRight } from "lucide-react";
import type { OptionCategory, PromptOption } from "@/lib/types";

interface OptionCategoryCardProps {
  category: OptionCategory;
  selectedOption?: PromptOption;
  onOpen: (categoryId: string) => void;
}

/** Page 3 의 가로형 옵션 카드. 클릭하면 해당 옵션 선택 페이지로 이동한다. */
export default function OptionCategoryCard({
  category,
  selectedOption,
  onOpen,
}: OptionCategoryCardProps) {
  const selected = Boolean(selectedOption);

  return (
    <button
      type="button"
      onClick={() => onOpen(category.id)}
      className={[
        "group flex w-full items-center gap-4 rounded-card border bg-surface p-5 text-left transition-colors duration-150",
        selected ? "border-ink" : "border-line hover:border-ink",
      ].join(" ")}
    >
      <div
        className={[
          "flex size-8 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-ink bg-ink text-white" : "border-line text-subtle",
        ].join(" ")}
        aria-hidden
      >
        {selected ? (
          <Check size={15} strokeWidth={2.5} />
        ) : (
          <span className="text-xs">{category.order}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="font-semibold text-ink">{category.name}</h3>
          <span className="text-xs tracking-wide text-subtle">
            {category.englishName}
          </span>
        </div>

        <p className="mt-1 truncate text-sm">
          {selected ? (
            <span className="text-ink">{selectedOption?.title}</span>
          ) : (
            <span className="text-subtle">옵션을 선택해주세요</span>
          )}
        </p>
      </div>

      <span className="hidden shrink-0 items-center gap-1 text-sm text-muted group-hover:text-ink sm:flex">
        {selected ? "변경하기" : "선택하기"}
        <ChevronRight size={16} strokeWidth={1.5} />
      </span>
      <ChevronRight
        size={18}
        strokeWidth={1.5}
        className="shrink-0 text-subtle sm:hidden"
      />
    </button>
  );
}
