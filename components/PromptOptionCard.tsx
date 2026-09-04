"use client";

import { Check } from "lucide-react";
import BeforeAfterViewer from "./BeforeAfterViewer";
import Button from "./Button";
import type { PromptOption } from "@/lib/types";

interface PromptOptionCardProps {
  option: PromptOption;
  selected: boolean;
  onSelect: (optionId: string) => void;
}

/** Page 4 의 핵심 카드. Before/After 비교와 실제 프롬프트 문구를 함께 보여준다. */
export default function PromptOptionCard({ option, selected, onSelect }: PromptOptionCardProps) {
  return (
    <article
      className={[
        "rounded-card border bg-surface p-5 transition-colors duration-150 sm:p-6",
        selected ? "border-ink" : "border-line",
      ].join(" ")}
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{option.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{option.description}</p>
        </div>

        {selected ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
            <Check size={13} strokeWidth={2.5} />
            선택됨
          </span>
        ) : null}
      </header>

      <BeforeAfterViewer
        beforeImage={option.beforeImage}
        afterImage={option.afterImage}
        title={option.title}
      />

      <div className="mt-4 rounded-[10px] border border-line bg-canvas p-4">
        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.1em] text-subtle">PROMPT</p>
        <p className="font-mono text-[13px] leading-relaxed break-words text-ink">
          {option.promptText}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant={selected ? "secondary" : "primary"}
          onClick={() => onSelect(option.id)}
        >
          {selected ? "이 프롬프트 유지" : "이 프롬프트 선택"}
        </Button>
      </div>
    </article>
  );
}
