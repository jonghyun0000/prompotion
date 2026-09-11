"use client";

import { Copy } from "lucide-react";
import Button from "./Button";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { rememberCopy } from "@/lib/storage";

/** 클립보드 복사 버튼. Clipboard API 를 쓸 수 없는 환경에서는 대체 방식으로 복사한다. */
export default function CopyButton({ text }: { text: string }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleCopy = async () => {
    setError("");
    try {
      if (!text.trim()) return;
      let successful = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          successful = true;
        } catch {}
      }
      if (!successful) {
        // http 로 접속했거나 권한이 없을 때의 대체 경로
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        (document.querySelector("dialog[open]") || document.body).appendChild(
          textarea,
        );
        textarea.select();
        try {
          successful = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
      }
      if (!successful) throw new Error("Copy rejected");
      setCopied(true);
      rememberCopy(text);
      trackEvent("prompt_copied", { promptLength: text.length });
      showToast("프롬프트가 복사되었습니다.");
    } catch {
      setCopied(false);
      setError("복사하지 못했습니다. 위 프롬프트를 선택해 직접 복사해주세요.");
      showToast("복사에 실패했습니다. 직접 선택해 복사해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleCopy} size="lg" className="w-full sm:w-auto">
        <Copy size={16} strokeWidth={1.75} />
        {copied ? "복사 완료!" : "프롬프트 복사"}
      </Button>
      {error && (
        <p role="alert" className="max-w-xs text-xs leading-5 text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
