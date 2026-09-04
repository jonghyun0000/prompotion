"use client";

import { ChevronRight } from "lucide-react";

export type Step = "image" | "prompt" | "result";

const steps: { id: Step; index: string; label: string }[] = [
  { id: "image", index: "01", label: "이미지 선택" },
  { id: "prompt", index: "02", label: "프롬프트 구성" },
  { id: "result", index: "03", label: "결과" },
];

/** Page 2 이후 상단에 표시되는 진행 단계 표시. */
export default function ProgressNavigation({ current }: { current: Step }) {
  return (
    <nav aria-label="진행 단계" className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
      {steps.map((step, i) => {
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <span
              className={
                active
                  ? "font-semibold tracking-wide text-ink"
                  : "tracking-wide text-subtle"
              }
            >
              <span className="mr-1.5 tabular-nums">{step.index}</span>
              {step.label}
            </span>
            {i < steps.length - 1 ? (
              <ChevronRight size={14} strokeWidth={1.5} className="text-subtle" />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
