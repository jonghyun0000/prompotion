"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  readSaved,
  readHistory,
  readResultImage,
  savePrompt,
  deleteSavedPrompt,
  type SavedPrompt,
} from "@/lib/storage";
import { useSelection } from "@/context/SelectionContext";
import { useToast } from "@/context/ToastContext";
import CopyButton from "@/components/CopyButton";
import Button from "@/components/Button";
import ImageWithFallback from "@/components/ImageWithFallback";
import { trackEvent } from "@/lib/analytics";
export default function SavedPage() {
  const [items, setItems] = useState<SavedPrompt[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof readHistory>>([]);
  const [busy, setBusy] = useState("");
  const [deleteId, setDeleteId] = useState<string>();
  const { restore } = useSelection();
  const router = useRouter();
  const { showToast } = useToast();
  useEffect(() => {
    // Browser persistence is read after hydration, never during server rendering.
    /* eslint-disable react-hooks/set-state-in-effect */
    setItems(readSaved());
    setHistory(readHistory());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="eyebrow">MY PROMPTS</p>
      <h1 className="mt-2 text-3xl font-semibold">내 프롬프트</h1>
      <p className="mt-3 text-sm text-muted">
        이 브라우저에 저장된 프롬프트와 생성 결과입니다. 최대 30개 보관하며,
        브라우저 데이터를 지우면 사라집니다.
      </p>
      <p className="mt-2 text-xs text-muted" role="status">저장 {items.length} / 30개</p>
      {!items.length && (
        <div className="my-8 rounded-xl border border-dashed border-line p-10">
          <p>아직 저장한 프롬프트가 없습니다.</p>
          <Link href="/select" className="mt-4 inline-block underline">
            첫 프롬프트 만들기 →
          </Link>
        </div>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-xl border border-line bg-surface"
          >
            {item.image && (
              <div>
                <ImageWithFallback
                  src={item.image}
                  alt={item.title + " 생성 결과"}
                  className="aspect-[4/3] w-full"
                />
                <a
                  download={item.id + ".webp"}
                  href={item.image}
                  className="inline-block p-4 text-xs underline"
                >
                  결과 이미지 다운로드
                </a>
              </div>
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-muted">
                {item.prompt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <CopyButton text={item.prompt} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    restore(item.selection);
                    router.push("/builder");
                  }}
                >
                  다시 편집
                </Button>
                <Button variant="secondary" disabled={!!busy} onClick={() => setDeleteId(item.id)}>
                  삭제
                </Button>
              </div>
              {deleteId === item.id && (
                <div className="mt-4 rounded-lg border border-line p-4" role="group" aria-label="삭제 확인">
                  <p className="text-sm">이 프롬프트와 첨부 이미지를 삭제할까요? 삭제 후에는 복구할 수 없습니다.</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="secondary" onClick={() => setDeleteId(undefined)}>취소</Button>
                    <Button disabled={!!busy} onClick={() => {
                      try {
                        deleteSavedPrompt(item.id);
                        setItems(readSaved());
                        setDeleteId(undefined);
                        showToast("프롬프트와 첨부 이미지를 삭제했습니다.");
                      } catch {
                        showToast("삭제하지 못했습니다. 브라우저 저장 설정을 확인한 뒤 다시 시도해주세요.");
                      }
                    }}>삭제 확인</Button>
                  </div>
                </div>
              )}
              <label className="mt-5 block text-xs">
                생성 결과 {item.image ? "교체" : "추가"} · JPG / PNG / WebP,
                10MB 이하
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={!!busy}
                  className="mt-2 block max-w-full"
                  onChange={async (event) => {
                    const input = event.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    setBusy(item.id);
                    try {
                      const image = await readResultImage(file);
                      savePrompt({ ...item, image });
                      setItems(readSaved());
                      trackEvent("result_uploaded", {
                        imageType: item.selection.selectedImageType || "",
                        fileBytes: file.size,
                      });
                      showToast("생성 결과를 저장했습니다.");
                    } catch {
                      showToast(
                        "이미지를 저장하지 못했습니다. 파일 형식·용량과 브라우저 저장 공간을 확인해주세요.",
                      );
                    } finally {
                      setBusy("");
                      input.value = "";
                    }
                  }}
                />
              </label>
              {busy === item.id && (
                <p role="status" className="mt-2 text-xs">
                  이미지 저장 중…
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      <section className="mt-14">
        <p className="eyebrow">COPY HISTORY</p>
        <h2 className="mt-2 text-xl font-semibold">최근 복사한 프롬프트</h2>
        {!history.length && (
          <p className="mt-4 text-sm text-muted">
            프롬프트를 복사하면 최근 10개가 여기에 표시됩니다.
          </p>
        )}
        <div className="mt-5 space-y-4">
          {history.map((item) => (
            <article
              key={item.prompt}
              className="rounded-xl border border-line p-5"
            >
              <p className="mb-4 break-words text-sm leading-6">
                {item.prompt}
              </p>
              <CopyButton text={item.prompt} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
