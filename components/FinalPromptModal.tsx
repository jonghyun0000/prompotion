"use client";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import CopyButton from "./CopyButton";
import { useSelection } from "@/context/SelectionContext";
import { useToast } from "@/context/ToastContext";
import { savePrompt, readResultImage, SavedPromptLimitError } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import type { OptionCategory, PromptOption } from "@/lib/types";

interface Props {
  open: boolean;
  imageTypeName: string;
  finalPrompt: string;
  breakdown: { category: OptionCategory; option: PromptOption }[];
  onClose: () => void;
}
export default function FinalPromptModal({
  open,
  imageTypeName,
  finalPrompt,
  breakdown,
  onClose,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { selection } = useSelection();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<string>();
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!open) {
      ref.current?.close();
      return;
    }
    ref.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const save = () => {
    try {
      const id = savedId || crypto.randomUUID();
      savePrompt({
        id,
        title:
          title.trim().slice(0, 100) ||
          imageTypeName + " · " + (breakdown[0]?.option.title || "내 프롬프트"),
        prompt: finalPrompt,
        selection,
        createdAt: new Date().toISOString(),
        image,
      });
      setSavedId(id);
      setStatus("내 프롬프트에 저장했습니다.");
      trackEvent("prompt_saved", {
        imageType: selection.selectedImageType || "",
        elementCount: breakdown.length,
      });
      showToast("이 브라우저의 내 프롬프트에 저장했습니다.");
    } catch (error) {
      setStatus(
        error instanceof SavedPromptLimitError
          ? "최대 30개까지 저장할 수 있습니다. 내 프롬프트에서 사용하지 않는 항목을 삭제한 뒤 다시 저장해주세요."
          : "저장 공간이 부족하거나 저장이 차단되어 있습니다. 프롬프트를 복사해 보관해주세요.",
      );
    }
  };
  return (
    <dialog
      ref={ref}
      aria-label="완성된 프롬프트"
      className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl rounded-card border border-line bg-surface p-0 text-ink backdrop:bg-black/40"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90dvh] flex-col overflow-hidden">
        <header className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
          <div>
            <p className="eyebrow">READY TO CREATE</p>
            <h2 className="mt-2 text-xl font-semibold">
              프롬프트가 완성되었습니다.
            </h2>
            <p className="mt-2 text-sm text-muted">
              {imageTypeName} · {breakdown.length}개 요소 조합
            </p>
          </div>
          <button onClick={onClose} aria-label="닫기" className="p-3">
            ✕
          </button>
        </header>
        <div className="overflow-y-auto p-5 sm:p-6">
          <label className="eyebrow" htmlFor="final-prompt">
            FINAL PROMPT
          </label>
          <textarea
            id="final-prompt"
            lang="en"
            readOnly
            value={finalPrompt}
            className="mt-2 min-h-40 w-full resize-y rounded-lg border border-line bg-canvas p-4 font-mono text-sm leading-relaxed"
          />
          <ul className="my-5 divide-y divide-line border-y border-line">
            {breakdown.map(({ category, option }) => (
              <li
                key={category.id}
                className="flex justify-between gap-4 py-3 text-sm"
              >
                <span className="text-muted">{category.name}</span>
                <span className="text-right">{option.title}</span>
              </li>
            ))}
          </ul>
          <details>
            <summary className="cursor-pointer py-3 text-sm font-medium">
              프롬프트 저장 / 결과 이미지 첨부
            </summary>
            <div className="space-y-4 pt-3">
              <label className="block text-sm">
                저장 이름
                <input
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 따뜻한 저녁의 콘크리트 주택"
                  className="mt-2 w-full rounded-lg border border-line p-3"
                />
              </label>
              <label className="block text-sm">
                생성 결과 이미지 첨부 (선택)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  className="mt-2 block max-w-full text-xs"
                  onChange={async (e) => {
                    const input = e.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    try {
                      setImage(await readResultImage(file));
                      trackEvent("result_uploaded", {
                        imageType: selection.selectedImageType || "",
                        fileBytes: file.size,
                      });
                    } catch {
                      setStatus(
                        "이미지를 열지 못했습니다. 10MB 이하 JPG·PNG·WebP 파일로 다시 시도해주세요.",
                      );
                    } finally {
                      setBusy(false);
                      input.value = "";
                    }
                  }}
                />
              </label>
              {image && (
                <p className="text-xs text-muted">
                  이미지 첨부 완료 · 저장하면 함께 보관됩니다.
                </p>
              )}
              <p className="text-xs leading-5 text-muted">
                10MB 이하 JPG·PNG·WebP. 이 브라우저에만 저장됩니다. 브라우저
                데이터 삭제 시 사라집니다.
              </p>
              <Button variant="secondary" disabled={busy} onClick={save}>
                {busy
                  ? "이미지 처리 중…"
                  : savedId
                    ? "저장 내용 업데이트"
                    : "프롬프트 저장"}
              </Button>
              {status && (
                <p role="status" className="text-sm leading-6">
                  {status}
                </p>
              )}
            </div>
          </details>
        </div>
        <footer className="flex flex-col-reverse gap-3 border-t border-line p-5 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="lg" onClick={onClose}>
            다시 수정하기
          </Button>
          <CopyButton key={finalPrompt} text={finalPrompt} />
        </footer>
      </div>
    </dialog>
  );
}
