"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import CopyButton from "./CopyButton";
import type { OptionCategory, PromptOption } from "@/lib/types";

interface FinalPromptModalProps {
  open: boolean;
  imageTypeName: string;
  finalPrompt: string;
  breakdown: { category: OptionCategory; option: PromptOption }[];
  onClose: () => void;
}

/** 완성된 프롬프트를 보여주는 모달. */
export default function FinalPromptModal({
  open,
  imageTypeName,
  finalPrompt,
  breakdown,
  onClose,
}: FinalPromptModalProps) {
  // 열려 있는 동안 배경 스크롤을 막고, ESC 로 닫을 수 있게 한다.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="완성된 프롬프트"
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-fade-in flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-card border border-line bg-surface sm:rounded-card"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div>
            <h2 className="text-xl font-semibold text-ink">프롬프트가 완성되었습니다.</h2>
            <p className="mt-1 text-sm text-muted">
              {imageTypeName} · {breakdown.length}개 요소 조합
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1 -mt-1 rounded-full p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-[10px] border border-line bg-canvas p-5">
            <p className="mb-2 text-[11px] font-semibold tracking-[0.1em] text-subtle">
              FINAL PROMPT
            </p>
            <p className="font-mono text-sm leading-relaxed break-words whitespace-pre-wrap text-ink">
              {finalPrompt}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.1em] text-subtle">
              선택한 요소
            </p>
            <ul className="divide-y divide-line border-y border-line">
              {breakdown.map(({ category, option }) => (
                <li key={category.id} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="shrink-0 text-sm text-muted">{category.name}</span>
                  <span className="text-right text-sm font-medium text-ink">{option.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-line p-6 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="lg" onClick={onClose} className="w-full sm:w-auto">
            다시 수정하기
          </Button>
          <CopyButton text={finalPrompt} />
        </footer>
      </div>
    </div>
  );
}
